module Main exposing (main)

{-| Systole: Deterministic life-critical ICU physiological telemetry,
multimodal hemodynamic monitoring, and clinical decision support workstation.
Built from first principles in pure Elm with zero runtime exceptions.
-}

import Alarms.EarlyWarning as EW
import Alarms.Manager as AM
import Alarms.Types as AT exposing (AlarmPriority(..))
import Browser
import Browser.Events
import Dsp.Arrhythmia as Arr exposing (ArrhythmiaType(..))
import Dsp.Capnography as Capno
import Dsp.EcgAnalysis as EcgAnalysis exposing (EcgMetrics)
import Dsp.PanTompkins as PT
import Dsp.Plethysmograph as Pleth
import Dsp.PulseContour as PulseContour
import Dsp.Types exposing (Lead(..), WaveformPoint, allLeads)
import Hemodynamics.Calculations as Hemo exposing (HemodynamicProfile, OxygenTransport)
import Hemodynamics.Targets as Targets
import Html exposing (Html, div, span, text)
import Html.Attributes exposing (style)
import Json.Decode as Decode
import Json.Encode as Encode
import Pharmacokinetics.Compartment as PK exposing (CompartmentConcentrations)
import Pharmacokinetics.Models as Models exposing (DrugType(..))
import Pharmacokinetics.Pharmacodynamics as PD
import Pharmacokinetics.Titration as TCI
import Ports
import Simulation.Patient exposing (PatientProfile, defaultPatient)
import Simulation.Scenarios as Scenarios exposing (ClinicalScenario(..))
import Simulation.SignalGenerator as SigGen exposing (GeneratedSamples)
import Simulation.Ward as Ward exposing (WardState)
import Time
import Ui.AlarmBanner as AlarmBanner
import Ui.Controls as Controls
import Ui.HemodynamicsModal as HemoModal
import Ui.InfusionPumpModal as PumpModal exposing (InfusionPumpState)
import Ui.LeadModal as LeadModal exposing (LeadSnippet)
import Ui.NumericBlock as NumericBlock
import Ui.Sweepbar as Sweepbar exposing (SweepbarChannel)
import Ui.Theme as Theme
import Ui.WardOverview as WardOverview


{-| Active modal overlay dialog.
-}
type ActiveModal
    = NoModal
    | Modal12Lead
    | ModalHemodynamics
    | ModalInfusionPump


{-| The central Elm Architecture application state.
-}
type alias Model =
    { currentTimeMs : Float
    , isPaused : Bool
    , simSpeed : Float
    , isWardView : Bool
    , activeModal : ActiveModal
    , ward : WardState
    , activeScenario : ClinicalScenario
    , isHeartBeating : Bool
    , heartBeatTimerMs : Float

    -- DSP Engines
    , ptDetector : PT.DetectorState
    , arrhythmiaClassifier : Arr.ArrhythmiaClassifier
    , pulseContourState : PulseContour.ContourState
    , plethState : Pleth.PlethState
    , capnoState : Capno.CapnoState
    , generatorState : SigGen.GeneratorState

    -- Telemetry Metrics
    , ecgMetrics : EcgMetrics
    , hemoProfile : HemodynamicProfile
    , oxygenTransport : OxygenTransport
    , alarmManager : AM.AlarmManager

    -- Pharmacokinetics and Infusion Pump
    , pumpState : InfusionPumpState
    , pkCompartmentState : PK.CompartmentState

    -- Waveform Buffers (rolling points for sweepbar display)
    , leadIiPoints : List WaveformPoint
    , abpPoints : List WaveformPoint
    , ppgPoints : List WaveformPoint
    , capnoPoints : List WaveformPoint
    , cvpPoints : List WaveformPoint
    , allLeadSnippets : List LeadSnippet
    }


{-| Application messages.
-}
type Msg
    = FrameTick Float
    | TogglePause
    | SetSpeed Float
    | SelectScenario ClinicalScenario
    | SelectBed Int
    | ToggleWardView
    | OpenModal ActiveModal
    | CloseModals
    | SilenceAlarms
    | AcknowledgeAlarms
    | SelectPumpDrug DrugType
    | SetPumpRate Float
    | TogglePump
    | DeliverPumpBolus
    | TriggerEmergencyVfib
    | TriggerEmergencyAsystole
    | ResetNominal
    | InboundTelemetry Encode.Value


{-| Initialize application model.
-}
init : () -> ( Model, Cmd Msg )
init _ =
    let
        genCfg =
            SigGen.defaultGeneratorConfig

        genSt =
            SigGen.initGeneratorState genCfg

        ptSt =
            PT.initDetector PT.defaultConfig

        patient =
            defaultPatient

        cov =
            { ageYears = patient.ageYears
            , weightKg = patient.weightKg
            , heightCm = patient.heightCm
            , isMale = True
            }

        marshParams =
            Models.marshPropofolParams cov

        pkSt =
            PK.initCompartmentState marshParams

        initialPump =
            { drug = PropofolMarsh
            , isRunning = False
            , targetConcentration = 4.0
            , currentRateMcgMin = 350.0
            , syringeVolumeRemainingMl = 48.5
            , syringeTotalCapacityMl = 50.0
            , concentrations = PK.emptyConcentrations
            , historicalCe = []
            }

        initialSnippets =
            List.map (\lead -> { lead = lead, points = [] }) allLeads
    in
    ( { currentTimeMs = 0.0
      , isPaused = False
      , simSpeed = 1.0
      , isWardView = False
      , activeModal = NoModal
      , ward = Ward.initWard
      , activeScenario = BaselineNominal
      , isHeartBeating = False
      , heartBeatTimerMs = 0.0
      , ptDetector = ptSt
      , arrhythmiaClassifier = Arr.emptyClassifier
      , pulseContourState = PulseContour.emptyContourState
      , plethState = Pleth.emptyPlethState
      , capnoState = Capno.emptyCapnoState
      , generatorState = genSt
      , ecgMetrics = EcgAnalysis.emptyMetrics
      , hemoProfile = Hemo.defaultProfile
      , oxygenTransport =
            Hemo.calculateOxygenTransport
                patient.labs.hemoglobinGDl
                98.5
                74.0
                95.0
                40.0
                5.2
                patient.bsaM2
      , alarmManager = AM.emptyAlarmManager
      , pumpState = initialPump
      , pkCompartmentState = pkSt
      , leadIiPoints = []
      , abpPoints = []
      , ppgPoints = []
      , capnoPoints = []
      , cvpPoints = []
      , allLeadSnippets = initialSnippets
      }
    , Cmd.none
    )


{-| Subscriptions: frame tick via requestAnimationFrame and inbound telemetry port.
-}
subscriptions : Model -> Sub Msg
subscriptions model =
    if model.isPaused then
        Ports.streamIn InboundTelemetry

    else
        Sub.batch
            [ Browser.Events.onAnimationFrameDelta FrameTick
            , Ports.streamIn InboundTelemetry
            ]


{-| Main update state machine.
-}
update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        FrameTick deltaMs ->
            stepSimulation deltaMs model

        TogglePause ->
            ( { model | isPaused = not model.isPaused }, Cmd.none )

        SetSpeed spd ->
            ( { model | simSpeed = clamp 0.5 10.0 spd }, Cmd.none )

        SelectScenario scen ->
            let
                def =
                    Scenarios.getScenarioDefinition scen

                genCfg =
                    model.generatorState.config

                updatedGenCfg =
                    { genCfg | stElevationMv = def.stElevationMv }

                genSt =
                    model.generatorState

                updatedGenSt =
                    { genSt | config = updatedGenCfg }
            in
            ( { model
                | activeScenario = scen
                , generatorState = updatedGenSt
              }
            , Cmd.none
            )

        SelectBed bedNum ->
            ( { model
                | ward = Ward.selectBed bedNum model.ward
                , isWardView = False
              }
            , Cmd.none
            )

        ToggleWardView ->
            ( { model | isWardView = not model.isWardView }, Cmd.none )

        OpenModal m ->
            ( { model | activeModal = m }, Cmd.none )

        CloseModals ->
            ( { model | activeModal = NoModal }, Cmd.none )

        SilenceAlarms ->
            ( { model | alarmManager = AM.silenceAlarms 120.0 model.alarmManager }
            , Ports.audioAlarm "MUTE"
            )

        AcknowledgeAlarms ->
            ( { model | alarmManager = AM.emptyAlarmManager }, Cmd.none )

        SelectPumpDrug drug ->
            let
                pState =
                    model.pumpState

                patient =
                    defaultPatient

                cov =
                    { ageYears = patient.ageYears
                    , weightKg = patient.weightKg
                    , heightCm = patient.heightCm
                    , isMale = True
                    }

                newParams =
                    case drug of
                        PropofolMarsh ->
                            Models.marshPropofolParams cov

                        PropofolSchnider ->
                            Models.schniderPropofolParams cov

                        Norepinephrine ->
                            Models.norepinephrineParams cov

                        Dobutamine ->
                            Models.dobutamineParams cov

                        Fentanyl ->
                            Models.fentanylParams cov

                newPkSt =
                    PK.initCompartmentState newParams
            in
            ( { model
                | pumpState = { pState | drug = drug }
                , pkCompartmentState = newPkSt
              }
            , Cmd.none
            )

        SetPumpRate rate ->
            let
                pState =
                    model.pumpState
            in
            ( { model | pumpState = { pState | currentRateMcgMin = max 0.0 rate } }, Cmd.none )

        TogglePump ->
            let
                pState =
                    model.pumpState
            in
            ( { model | pumpState = { pState | isRunning = not pState.isRunning } }, Cmd.none )

        DeliverPumpBolus ->
            let
                pkSt =
                    model.pkCompartmentState

                -- Inject 50 mg (50,000 mcg) bolus into central compartment
                updatedPkSt =
                    { pkSt | massCentral = pkSt.massCentral + 50000.0 }
            in
            ( { model | pkCompartmentState = updatedPkSt }, Cmd.none )

        TriggerEmergencyVfib ->
            let
                mgr =
                    AM.evaluateVitals VentricularFibrillation 0.0 0.0 0.0 0.0 0.0 0.0 False model.currentTimeMs model.alarmManager
            in
            ( { model
                | activeScenario = BaselineNominal
                , alarmManager = mgr
              }
            , Ports.audioAlarm "CRISIS"
            )

        TriggerEmergencyAsystole ->
            let
                mgr =
                    AM.evaluateVitals Asystole 0.0 0.0 0.0 0.0 0.0 0.0 False model.currentTimeMs model.alarmManager
            in
            ( { model
                | activeScenario = BaselineNominal
                , alarmManager = mgr
              }
            , Ports.audioAlarm "CRISIS"
            )

        ResetNominal ->
            let
                def =
                    Scenarios.getScenarioDefinition BaselineNominal

                genCfg =
                    model.generatorState.config

                updatedGenCfg =
                    { genCfg | stElevationMv = 0.0 }

                genSt =
                    model.generatorState

                updatedGenSt =
                    { genSt | config = updatedGenCfg }
            in
            ( { model
                | activeScenario = BaselineNominal
                , generatorState = updatedGenSt
                , alarmManager = AM.emptyAlarmManager
              }
            , Ports.audioAlarm "MUTE"
            )

        InboundTelemetry _ ->
            ( model, Cmd.none )


{-| Step physiological simulation and signal processing by deltaMs.
Executes discrete 5 ms sub-steps (200 Hz DSP frequency) for fidelity.
-}
stepSimulation : Float -> Model -> ( Model, Cmd Msg )
stepSimulation elapsedMs model =
    let
        effectiveElapsedMs =
            min 100.0 (elapsedMs * model.simSpeed)

        subStepDtMs =
            5.0

        numSubSteps =
            max 1 (round (effectiveElapsedMs / subStepDtMs))

        scenDef =
            Scenarios.getScenarioDefinition model.activeScenario

        -- Advance pharmacokinetics
        infusionRate =
            if model.pumpState.isRunning then
                model.pumpState.currentRateMcgMin

            else
                0.0

        dtMinutes =
            (effectiveElapsedMs / 1000.0) / 60.0

        ( updatedConcs, nextPkSt ) =
            PK.stepCompartment infusionRate dtMinutes model.pkCompartmentState

        pState =
            model.pumpState

        nextPumpState =
            { pState | concentrations = updatedConcs }

        -- Execute sub-steps across DSP pipeline
        executeSubStep _ ( m, curTime ) =
            let
                t =
                    curTime + subStepDtMs

                -- Synthesize fresh analog samples
                ( raw, nextGenSt ) =
                    SigGen.synthesizeWaveforms
                        scenDef.heartRateBpm
                        scenDef.systolicMmhg
                        scenDef.diastolicMmhg
                        scenDef.spo2Percent
                        scenDef.etco2Mmhg
                        scenDef.cvpMmhg
                        t
                        m.generatorState

                -- Pan-Tompkins QRS Detection on Lead II
                ( qrsDet, nextPtSt ) =
                    PT.processSample raw.leadII t m.ptDetector

                -- Arrhythmia Classification
                ( arrClass, nextArrCl ) =
                    if qrsDet.isPeak then
                        let
                            rr =
                                Maybe.withDefault (60000.0 / scenDef.heartRateBpm) qrsDet.rrIntervalMs
                        in
                        Arr.updateWithBeat 88.0 rr t m.arrhythmiaClassifier

                    else
                        Arr.classifyRhythm t m.arrhythmiaClassifier

                -- Pulse Contour Analysis on ABP
                ( abpFeat, nextContourSt ) =
                    PulseContour.processAbpSample raw.abpMmhg t m.pulseContourState

                -- Photoplethysmography
                ( ppgFeat, nextPlethSt ) =
                    Pleth.processPpgSample raw.ppgRed raw.ppgIr t m.plethState

                -- Capnography
                ( capnoFeat, nextCapnoSt ) =
                    Capno.processCapnoSample raw.capnoMmhg t m.capnoState

                -- Update points buffer (retain rolling 4 seconds = 800 samples)
                maxPts =
                    750

                addPt val isPk buf =
                    { timestamp = t, value = val, isRPeak = isPk } :: List.take (maxPts - 1) buf

                nextLeadIi =
                    addPt raw.leadII qrsDet.isPeak m.leadIiPoints

                nextAbp =
                    addPt raw.abpMmhg False m.abpPoints

                nextPpg =
                    addPt (raw.ppgIr * 40.0) False m.ppgPoints

                nextCapno =
                    addPt raw.capnoMmhg False m.capnoPoints

                nextCvp =
                    addPt raw.cvpMmhg False m.cvpPoints

                -- Heartbeat visual animation pulse
                ( nextBeating, nextBeatTimer ) =
                    if qrsDet.isPeak then
                        ( True, 120.0 )

                    else if m.heartBeatTimerMs > 0.0 then
                        ( True, m.heartBeatTimerMs - subStepDtMs )

                    else
                        ( False, 0.0 )

                nextM =
                    { m
                        | generatorState = nextGenSt
                        , ptDetector = nextPtSt
                        , arrhythmiaClassifier = nextArrCl
                        , pulseContourState = nextContourSt
                        , plethState = nextPlethSt
                        , capnoState = nextCapnoSt
                        , leadIiPoints = nextLeadIi
                        , abpPoints = nextAbp
                        , ppgPoints = nextPpg
                        , capnoPoints = nextCapno
                        , cvpPoints = nextCvp
                        , isHeartBeating = nextBeating
                        , heartBeatTimerMs = nextBeatTimer
                    }
            in
            ( nextM, t )

        ( finalModel, finalTime ) =
            List.foldl executeSubStep ( model, model.currentTimeMs ) (List.range 1 numSubSteps)

        -- Evaluate alarms with multi-sensor fusion
        mapVal =
            scenDef.diastolicMmhg + ((scenDef.systolicMmhg - scenDef.diastolicMmhg) / 3.0)

        updatedAlarmMgr =
            AM.evaluateVitals
                finalModel.arrhythmiaClassifier.currentRhythm
                scenDef.heartRateBpm
                scenDef.systolicMmhg
                scenDef.diastolicMmhg
                mapVal
                scenDef.spo2Percent
                scenDef.etco2Mmhg
                True
                finalTime
                (AM.tickSilenceTimer (effectiveElapsedMs / 1000.0) finalModel.alarmManager)

        -- Update Hemodynamics
        updatedHemo =
            Hemo.calculateHemodynamics
                scenDef.heartRateBpm
                mapVal
                scenDef.cvpMmhg
                scenDef.systolicMmhg
                22.0
                10.0
                72.0
                defaultPatient.bsaM2

        -- Update Ward bed vitals
        rhythmStr =
            Arr.rhythmToString finalModel.arrhythmiaClassifier.currentRhythm

        hasCrisis =
            List.any (\a -> a.priority == CrisisHighPriority) updatedAlarmMgr.activeAlarms

        hasWarning =
            List.any (\a -> a.priority == WarningMediumPriority) updatedAlarmMgr.activeAlarms

        updatedWard =
            Ward.updateBedVitals
                finalModel.ward.selectedBedNumber
                scenDef.heartRateBpm
                scenDef.systolicMmhg
                scenDef.diastolicMmhg
                scenDef.spo2Percent
                scenDef.etco2Mmhg
                scenDef.cvpMmhg
                hasCrisis
                hasWarning
                rhythmStr
                finalModel.ward
    in
    ( { finalModel
        | currentTimeMs = finalTime
        , alarmManager = updatedAlarmMgr
        , hemoProfile = updatedHemo
        , pumpState = nextPumpState
        , ward = updatedWard
      }
    , Cmd.none
    )


{-| Top-level view router.
-}
view : Model -> Html Msg
view model =
    div
        [ style "background" Theme.backgroundColor
        , style "color" Theme.textPrimaryColor
        , style "min-height" "100vh"
        , style "display" "flex"
        , style "flex-direction" "column"
        , style "font-family" "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif"
        ]
        [ -- 1. Top Alarm Presentation Banner
          AlarmBanner.renderAlarmBanner model.alarmManager SilenceAlarms AcknowledgeAlarms

        -- 2. Patient Demographics & Bed Header Ticker
        , renderPatientHeader model

        -- 3. Main Workspace: Bedside Sweepbar Oscilloscope OR 8-Bed Ward Overview
        , div
            [ style "flex" "1"
            , style "display" "flex"
            , style "flex-direction" "column"
            ]
            [ if model.isWardView then
                WardOverview.renderWardOverview model.ward SelectBed

              else
                renderBedsideWorkspace model
            ]

        -- 4. Bottom Controls & Simulation Toolbar
        , Controls.renderControlToolbar
            model.isPaused
            model.simSpeed
            model.activeScenario
            model.isWardView
            TogglePause
            SetSpeed
            SelectScenario
            (OpenModal Modal12Lead)
            (OpenModal ModalHemodynamics)
            (OpenModal ModalInfusionPump)
            ToggleWardView
            TriggerEmergencyVfib
            TriggerEmergencyAsystole
            ResetNominal

        -- 5. Modal Dialogs Overlay
        , renderActiveModal model
        ]


{-| Patient demographic and ICU conning header.
-}
renderPatientHeader : Model -> Html Msg
renderPatientHeader model =
    let
        activeBed =
            Ward.getBed model.ward.selectedBedNumber model.ward
                |> Maybe.withDefault
                    { bedNumber = 1
                    , patient = defaultPatient
                    , scenario = BaselineNominal
                    , heartRateBpm = 75.0
                    , systolicMmhg = 120.0
                    , diastolicMmhg = 80.0
                    , meanMmhg = 93.3
                    , spo2Percent = 98.0
                    , etco2Mmhg = 38.0
                    , cvpMmhg = 6.0
                    , hasActiveCrisis = False
                    , hasActiveWarning = False
                    , primaryRhythmString = "Normal Sinus Rhythm"
                    }

        p =
            activeBed.patient
    in
    div
        [ style "background" Theme.surfaceColor
        , style "border-bottom" ("1px solid " ++ Theme.bezelColor)
        , style "padding" "10px 20px"
        , style "display" "flex"
        , style "justify-content" "space-between"
        , style "align-items" "center"
        ]
        [ div
            [ style "display" "flex"
            , style "align-items" "baseline"
            , style "gap" "14px"
            ]
            [ span
                [ style "background" Theme.ppgColor
                , style "color" "#000000"
                , style "padding" "3px 8px"
                , style "border-radius" "4px"
                , style "font-size" "13px"
                , style "font-weight" "bold"
                , style "font-family" "monospace"
                ]
                [ text ("ICU BED " ++ String.fromInt activeBed.bedNumber) ]
            , span
                [ style "color" Theme.textPrimaryColor
                , style "font-size" "16px"
                , style "font-weight" "bold"
                , style "font-family" "monospace"
                ]
                [ text p.name ]
            , span
                [ style "color" Theme.textMutedColor
                , style "font-size" "12px"
                , style "font-family" "monospace"
                ]
                [ text (String.fromInt (round p.ageYears) ++ "yo M | " ++ String.fromFloat p.weightKg ++ " kg | BSA " ++ String.fromFloat (toFloat (round (p.bsaM2 * 100.0)) / 100.0) ++ " m²") ]
            , span
                [ style "color" Theme.textMutedColor
                , style "font-size" "12px"
                , style "font-family" "monospace"
                ]
                [ text ("| " ++ p.primaryDiagnosis) ]
            ]
        , div
            [ style "display" "flex"
            , style "align-items" "center"
            , style "gap" "16px"
            ]
            [ span
                [ style "color" Theme.ecgColor
                , style "font-size" "12px"
                , style "font-family" "monospace"
                ]
                [ text "DSP SWEEP: 25 mm/s | 200 Hz" ]
            , span
                [ style "color" Theme.textMutedColor
                , style "font-size" "12px"
                , style "font-family" "monospace"
                ]
                [ text "PURE ELM ENGINE" ]
            ]
        ]


{-| Bedside split workspace: Oscilloscope Waveforms on Left, Parameter Blocks on Right.
-}
renderBedsideWorkspace : Model -> Html Msg
renderBedsideWorkspace model =
    let
        scenDef =
            Scenarios.getScenarioDefinition model.activeScenario

        sweepPos =
            Sweepbar.normalizeX model.currentTimeMs 800.0

        rhythmStr =
            Arr.rhythmToString model.arrhythmiaClassifier.currentRhythm

        mapVal =
            scenDef.diastolicMmhg + ((scenDef.systolicMmhg - scenDef.diastolicMmhg) / 3.0)
    in
    div
        [ style "display" "grid"
        , style "grid-template-columns" "1fr 180px"
        , style "flex" "1"
        , style "background" Theme.backgroundColor
        ]
        [ -- Left: Multi-channel Sweepbar Oscilloscope Tracks
          div
            [ style "display" "flex"
            , style "flex-direction" "column"
            , style "border-right" ("1px solid " ++ Theme.bezelColor)
            ]
            [ Sweepbar.renderSweepbarChannel
                { title = "ECG"
                , leadLabel = "II"
                , color = Theme.ecgColor
                , sweepPositionX = sweepPos
                , points = model.leadIiPoints
                , minValue = -0.5
                , maxValue = 1.8
                , unitString = "mV"
                , heightPx = 130.0
                }
            , Sweepbar.renderSweepbarChannel
                { title = "ABP"
                , leadLabel = "Arterial Line"
                , color = Theme.abpColor
                , sweepPositionX = sweepPos
                , points = model.abpPoints
                , minValue = 0.0
                , maxValue = 180.0
                , unitString = "mmHg"
                , heightPx = 130.0
                }
            , Sweepbar.renderSweepbarChannel
                { title = "Pleth"
                , leadLabel = "SpO2 Finger Probe"
                , color = Theme.ppgColor
                , sweepPositionX = sweepPos
                , points = model.ppgPoints
                , minValue = 80.0
                , maxValue = 110.0
                , unitString = "Volts"
                , heightPx = 110.0
                }
            , Sweepbar.renderSweepbarChannel
                { title = "Capno"
                , leadLabel = "Microstream CO2"
                , color = Theme.capnoColor
                , sweepPositionX = sweepPos
                , points = model.capnoPoints
                , minValue = 0.0
                , maxValue = 60.0
                , unitString = "mmHg"
                , heightPx = 110.0
                }
            , Sweepbar.renderSweepbarChannel
                { title = "CVP"
                , leadLabel = "Internal Jugular Catheter"
                , color = Theme.cvpColor
                , sweepPositionX = sweepPos
                , points = model.cvpPoints
                , minValue = 0.0
                , maxValue = 25.0
                , unitString = "mmHg"
                , heightPx = 95.0
                }
            ]

        -- Right: Clinical Parameter Numeric Callout Column
        , div
            [ style "display" "flex"
            , style "flex-direction" "column"
            , style "gap" "10px"
            , style "padding" "10px"
            , style "background" "#090d15"
            ]
            [ NumericBlock.renderHeartRateBlock scenDef.heartRateBpm rhythmStr model.isHeartBeating
            , NumericBlock.renderAbpBlock scenDef.systolicMmhg scenDef.diastolicMmhg mapVal
            , NumericBlock.renderSpo2Block scenDef.spo2Percent 2.8
            , NumericBlock.renderCapnoBlock scenDef.etco2Mmhg 14.0
            , NumericBlock.renderCvpBlock scenDef.cvpMmhg
            , NumericBlock.renderTemperatureBlock scenDef.temperatureC
            ]
        ]


{-| Render active modal dialog overlay.
-}
renderActiveModal : Model -> Html Msg
renderActiveModal model =
    case model.activeModal of
        NoModal ->
            div [] []

        Modal12Lead ->
            let
                isStemi =
                    model.activeScenario == AcuteAnteriorStemi
            in
            LeadModal.render12LeadModal
                model.allLeadSnippets
                model.ecgMetrics
                isStemi
                CloseModals

        ModalHemodynamics ->
            let
                scenDef =
                    Scenarios.getScenarioDefinition model.activeScenario
            in
            HemoModal.renderHemodynamicsModal
                model.hemoProfile
                model.oxygenTransport
                scenDef.cvpMmhg
                CloseModals

        ModalInfusionPump ->
            PumpModal.renderInfusionPumpModal
                model.pumpState
                SelectPumpDrug
                SetPumpRate
                TogglePump
                DeliverPumpBolus
                CloseModals


main : Program () Model Msg
main =
    Browser.element
        { init = init
        , view = view
        , update = update
        , subscriptions = subscriptions
        }
