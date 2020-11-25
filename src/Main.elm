module Main exposing (main)

{-| Systole: Deterministic life-critical ICU physiological telemetry,
multimodal hemodynamic monitoring, and clinical decision support workstation.
Built from first principles in pure Elm with zero runtime exceptions.
-}

import Alarms.EarlyWarning as EW
import Alarms.Manager as AM
import Alarms.SmartFusion as SmartFusion exposing (SensorSqi)
import Alarms.Types as AT exposing (AlarmPriority(..))
import Browser
import Browser.Events
import Dsp.Arrhythmia as Arr exposing (ArrhythmiaType(..))
import Dsp.BiquadCascade as Cascade exposing (CascadeFilter)
import Dsp.Capnography as Capno
import Dsp.EcgAnalysis as EcgAnalysis exposing (EcgMetrics)
import Dsp.PanTompkins as PT
import Dsp.Plethysmograph as Pleth
import Dsp.PulseContour as PulseContour
import Dsp.Respiration as Resp exposing (RespirationState)
import Dsp.Spectrum as Spectrum exposing (HrvFrequencyMetrics)
import Dsp.Types exposing (Lead(..), WaveformPoint, allLeads)
import Dsp.Wavelet as Wavelet
import Hemodynamics.Calculations as Hemo exposing (HemodynamicProfile, OxygenTransport)
import Hemodynamics.PressureVolumeLoop as Pv exposing (PvLoopModel)
import Hemodynamics.Targets as Targets
import Html exposing (Html, div, span, text)
import Html.Attributes exposing (style)
import Json.Decode as Decode
import Json.Encode as Encode
import Pharmacokinetics.Compartment as PK exposing (CompartmentConcentrations)
import Pharmacokinetics.Eleveld as Eleveld
import Pharmacokinetics.Models as Models exposing (DrugType(..))
import Pharmacokinetics.Pharmacodynamics as PD
import Pharmacokinetics.Titration as TCI
import Ports
import Simulation.Patient exposing (PatientProfile, defaultPatient)
import Simulation.Scenarios as Scenarios exposing (ClinicalScenario(..))
import Simulation.SignalGenerator as SigGen exposing (GeneratedSamples)
import Simulation.Ventilator as Vent exposing (VentilatorMechanics, VentilatorScalars, VentilatorSettings, VentilatorState)
import Simulation.Ward as Ward exposing (WardState)
import Time
import Ui.AlarmBanner as AlarmBanner
import Ui.Controls as Controls exposing (ToolbarActions)
import Ui.EhrExportModal as EhrModal exposing (ExportFormat(..))
import Ui.HemodynamicsModal as HemoModal
import Ui.InfusionPumpModal as PumpModal exposing (InfusionPumpState)
import Ui.LeadModal as LeadModal exposing (LeadSnippet)
import Ui.NumericBlock as NumericBlock
import Ui.PvLoopModal as PvModal
import Ui.SpectrumModal as SpectrumModal
import Ui.Sweepbar as Sweepbar exposing (SweepbarChannel)
import Ui.Theme as Theme
import Ui.TrendsView as TrendsView exposing (TrendInterval(..), TrendRecord)
import Ui.VentilatorView as VentView
import Ui.WardOverview as WardOverview


{-| Active modal overlay dialog.
-}
type ActiveModal
    = NoModal
    | Modal12Lead
    | ModalHemodynamics
    | ModalInfusionPump
    | ModalPvLoop
    | ModalVentilator
    | ModalTrends
    | ModalSpectrum
    | ModalEhrExport


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
    , respirationState : Resp.RespirationState
    , sensorSqi : SensorSqi

    -- Mechanical Ventilator State
    , ventSettings : Vent.VentilatorSettings
    , ventMechanics : Vent.VentilatorMechanics
    , ventState : Vent.VentilatorState
    , ventScalars : Vent.VentilatorScalars
    , pawHistory : List Float
    , flowHistory : List Float
    , volHistory : List Float

    -- Pressure Volume Loop Model
    , pvModel : Pv.PvLoopModel

    -- Retrospective Trends and Spectral Analysis
    , trendRecords : List TrendRecord
    , trendInterval : TrendInterval
    , lastTrendRecordTimeMs : Float
    , hrvMetrics : HrvFrequencyMetrics
    , psdPoints : List ( Float, Float )
    , rrHistoryMs : List Float

    -- Telemetry Metrics
    , ecgMetrics : EcgMetrics
    , hemoProfile : HemodynamicProfile
    , oxygenTransport : OxygenTransport
    , alarmManager : AM.AlarmManager
    , ehrFormat : ExportFormat

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
    | PvModalMsg PvModal.Msg
    | VentViewMsg VentView.Msg
    | TrendsViewMsg TrendsView.Msg
    | SpectrumModalMsg SpectrumModal.Msg
    | EhrModalMsg EhrModal.Msg


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

        initVent =
            Vent.initVentilatorState 200.0

        ( initialVentScalars, _ ) =
            Vent.stepVentilator Vent.defaultSettings Vent.defaultMechanics initVent

        defaultHrv =
            { vlfPowerMs2 = 250.0
            , lfPowerMs2 = 600.0
            , hfPowerMs2 = 450.0
            , totalPowerMs2 = 1300.0
            , lfHfRatio = 1.33
            , lfNormalized = 57.1
            , hfNormalized = 42.9
            }

        initialTrend =
            { timestampSec = 0.0
            , heartRateBpm = 75.0
            , abpSystolicMmHg = 120.0
            , abpDiastolicMmHg = 80.0
            , abpMeanMmHg = 93.3
            , spO2Percent = 98.0
            , etco2MmHg = 38.0
            , respiratoryRateBpm = 14.0
            , temperatureCelsius = 37.0
            }
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
      , respirationState = Resp.initRespirationState 200.0
      , sensorSqi = SmartFusion.defaultSqi
      , ventSettings = Vent.defaultSettings
      , ventMechanics = Vent.defaultMechanics
      , ventState = initVent
      , ventScalars = initialVentScalars
      , pawHistory = List.repeat 60 8.0
      , flowHistory = List.repeat 60 0.0
      , volHistory = List.repeat 60 0.0
      , pvModel = Pv.defaultPvModel
      , trendRecords = [ initialTrend ]
      , trendInterval = Interval1Hour
      , lastTrendRecordTimeMs = 0.0
      , hrvMetrics = defaultHrv
      , psdPoints = [ ( 0.05, 50.0 ), ( 0.1, 120.0 ), ( 0.25, 80.0 ) ]
      , rrHistoryMs = [ 800.0, 810.0, 795.0, 805.0, 800.0 ]
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
      , ehrFormat = FhirJsonFormat
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


{-| Central Elm Architecture event loop update handler.
-}
update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        FrameTick elapsedMs ->
            if model.isPaused then
                ( model, Cmd.none )

            else
                stepSimulation elapsedMs model

        TogglePause ->
            ( { model | isPaused = not model.isPaused }, Cmd.none )

        SetSpeed spd ->
            ( { model | simSpeed = spd }, Cmd.none )

        SelectScenario scen ->
            let
                scenDef =
                    Scenarios.getScenarioDefinition scen

                genCfg =
                    model.generatorState.config

                updatedGenCfg =
                    { genCfg | stElevationMv = scenDef.stElevationMv }

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
            let
                w =
                    model.ward

                updatedWard =
                    { w | selectedBedNumber = bedNum }
            in
            ( { model | ward = updatedWard, isWardView = False }, Cmd.none )

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
            let
                mgr =
                    model.alarmManager
            in
            ( { model | alarmManager = { mgr | activeAlarms = [] } }, Cmd.none )

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
            ( { model | pumpState = { pState | currentRateMcgMin = Basics.max 0.0 rate } }, Cmd.none )

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

        PvModalMsg pvMsg ->
            case pvMsg of
                PvModal.ClosePvModal ->
                    ( { model | activeModal = NoModal }, Cmd.none )

                PvModal.AdjustContractility ees ->
                    let
                        m =
                            model.pvModel
                    in
                    ( { model | pvModel = { m | eesMmHgPerMl = ees } }, Cmd.none )

                PvModal.AdjustPreload edv ->
                    let
                        m =
                            model.pvModel
                    in
                    ( { model | pvModel = { m | targetEdvMl = edv } }, Cmd.none )

                PvModal.AdjustAfterload mapPress ->
                    let
                        m =
                            model.pvModel
                    in
                    ( { model | pvModel = { m | meanArterialPressureMmHg = mapPress } }, Cmd.none )

        VentViewMsg vMsg ->
            case vMsg of
                VentView.CloseVentilatorView ->
                    ( { model | activeModal = NoModal }, Cmd.none )

                VentView.SetVentMode mode ->
                    let
                        st =
                            model.ventSettings
                    in
                    ( { model | ventSettings = { st | mode = mode } }, Cmd.none )

                VentView.AdjustVentRate rate ->
                    let
                        st =
                            model.ventSettings
                    in
                    ( { model | ventSettings = { st | respiratoryRateBpm = rate } }, Cmd.none )

                VentView.AdjustVentPeep peep ->
                    let
                        st =
                            model.ventSettings
                    in
                    ( { model | ventSettings = { st | peepCmH2o = peep } }, Cmd.none )

                VentView.AdjustVentTidalVolume vt ->
                    let
                        st =
                            model.ventSettings
                    in
                    ( { model | ventSettings = { st | tidalVolumeTargetMl = vt } }, Cmd.none )

        TrendsViewMsg tMsg ->
            case tMsg of
                TrendsView.CloseTrendsView ->
                    ( { model | activeModal = NoModal }, Cmd.none )

                TrendsView.SelectInterval interval ->
                    ( { model | trendInterval = interval }, Cmd.none )

        SpectrumModalMsg sMsg ->
            case sMsg of
                SpectrumModal.CloseSpectrumModal ->
                    ( { model | activeModal = NoModal }, Cmd.none )

        EhrModalMsg eMsg ->
            case eMsg of
                EhrModal.CloseEhrModal ->
                    ( { model | activeModal = NoModal }, Cmd.none )

                EhrModal.SelectFormat fmt ->
                    ( { model | ehrFormat = fmt }, Cmd.none )

                EhrModal.CopyExportPayload payload ->
                    ( model, Ports.exportEhr (Encode.string payload) )


{-| Step physiological simulation and signal processing by deltaMs.
Executes discrete 5 ms sub-steps (200 Hz DSP frequency) for fidelity.
-}
stepSimulation : Float -> Model -> ( Model, Cmd Msg )
stepSimulation elapsedMs model =
    let
        effectiveElapsedMs =
            Basics.min 100.0 (elapsedMs * model.simSpeed)

        subStepDtMs =
            5.0

        numSubSteps =
            Basics.max 1 (round (effectiveElapsedMs / subStepDtMs))

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

        -- Step mechanical ventilator
        ( newVentScalars, nextVentSt ) =
            Vent.stepVentilator model.ventSettings model.ventMechanics model.ventState

        newPawHistory =
            List.take 60 (newVentScalars.airwayPressureCmH2o :: model.pawHistory)

        newFlowHistory =
            List.take 60 (newVentScalars.flowLitersPerMin :: model.flowHistory)

        newVolHistory =
            List.take 60 (newVentScalars.deliveredVolumeMl :: model.volHistory)

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

                -- Respiration Impedance
                ( respMetrics, nextRespSt ) =
                    Resp.stepRespiration (500.0 + raw.capnoMmhg * 0.5) m.respirationState

                -- Sweepbar buffer management (keep recent 750 points)
                maxPts =
                    750

                addPt val isPk buf =
                    { timestamp = t, value = val, isRPeak = isPk } :: List.take (maxPts - 1) buf

                newLeadIi =
                    addPt raw.leadII qrsDet.isPeak m.leadIiPoints

                newAbp =
                    addPt raw.abpMmhg False m.abpPoints

                newPpg =
                    addPt (raw.ppgIr * 40.0) False m.ppgPoints

                newCapno =
                    addPt raw.capnoMmhg False m.capnoPoints

                newCvp =
                    addPt raw.cvpMmhg False m.cvpPoints

                -- Heartbeat blip timer
                newBeating =
                    if qrsDet.isPeak then
                        True

                    else if m.heartBeatTimerMs > 120.0 then
                        False

                    else
                        m.isHeartBeating

                newTimer =
                    if qrsDet.isPeak then
                        0.0

                    else
                        m.heartBeatTimerMs + subStepDtMs

                -- RR history for HRV
                updatedRr =
                    if qrsDet.isPeak then
                        let
                            rr =
                                Maybe.withDefault (60000.0 / scenDef.heartRateBpm) qrsDet.rrIntervalMs
                        in
                        List.take 30 (rr :: m.rrHistoryMs)

                    else
                        m.rrHistoryMs
            in
            ( { m
                | generatorState = nextGenSt
                , ptDetector = nextPtSt
                , arrhythmiaClassifier = nextArrCl
                , pulseContourState = nextContourSt
                , plethState = nextPlethSt
                , capnoState = nextCapnoSt
                , respirationState = nextRespSt
                , leadIiPoints = newLeadIi
                , abpPoints = newAbp
                , ppgPoints = newPpg
                , capnoPoints = newCapno
                , cvpPoints = newCvp
                , isHeartBeating = newBeating
                , heartBeatTimerMs = newTimer
                , rrHistoryMs = updatedRr
              }
            , t
            )

        ( finalModel, finalTime ) =
            List.foldl executeSubStep ( model, model.currentTimeMs ) (List.range 1 numSubSteps)

        -- Evaluate Alarm Conditions
        rhythm =
            finalModel.arrhythmiaClassifier.currentRhythm

        mapVal =
            scenDef.diastolicMmhg + ((scenDef.systolicMmhg - scenDef.diastolicMmhg) / 3.0)

        updatedAlarmMgr =
            AM.evaluateVitals
                rhythm
                scenDef.heartRateBpm
                scenDef.systolicMmhg
                scenDef.diastolicMmhg
                scenDef.spo2Percent
                scenDef.etco2Mmhg
                scenDef.temperatureC
                (finalModel.activeScenario == AcuteAnteriorStemi)
                finalTime
                finalModel.alarmManager

        -- Hemodynamics calculation
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

        -- Retrospective trend logging every 2000 ms (2 seconds)
        shouldRecordTrend =
            (finalTime - finalModel.lastTrendRecordTimeMs) >= 2000.0

        updatedTrends =
            if shouldRecordTrend then
                let
                    newRec =
                        { timestampSec = finalTime / 1000.0
                        , heartRateBpm = scenDef.heartRateBpm
                        , abpSystolicMmHg = scenDef.systolicMmhg
                        , abpDiastolicMmHg = scenDef.diastolicMmhg
                        , abpMeanMmHg = mapVal
                        , spO2Percent = scenDef.spo2Percent
                        , etco2MmHg = scenDef.etco2Mmhg
                        , respiratoryRateBpm = 14.0
                        , temperatureCelsius = scenDef.temperatureC
                        }
                in
                List.take 50 (newRec :: finalModel.trendRecords)

            else
                finalModel.trendRecords

        nextTrendTime =
            if shouldRecordTrend then
                finalTime

            else
                finalModel.lastTrendRecordTimeMs
    in
    ( { finalModel
        | currentTimeMs = finalTime
        , alarmManager = updatedAlarmMgr
        , hemoProfile = updatedHemo
        , pumpState = nextPumpState
        , ward = updatedWard
        , ventScalars = newVentScalars
        , ventState = nextVentSt
        , pawHistory = newPawHistory
        , flowHistory = newFlowHistory
        , volHistory = newVolHistory
        , trendRecords = updatedTrends
        , lastTrendRecordTimeMs = nextTrendTime
      }
    , Cmd.none
    )


{-| Top-level view router.
-}
view : Model -> Html Msg
view model =
    let
        toolbarActions =
            { togglePause = TogglePause
            , setSpeed = SetSpeed
            , selectScenario = SelectScenario
            , open12Lead = OpenModal Modal12Lead
            , openHemo = OpenModal ModalHemodynamics
            , openPump = OpenModal ModalInfusionPump
            , openPvLoop = OpenModal ModalPvLoop
            , openVentilator = OpenModal ModalVentilator
            , openTrends = OpenModal ModalTrends
            , openSpectrum = OpenModal ModalSpectrum
            , openEhr = OpenModal ModalEhrExport
            , toggleWard = ToggleWardView
            , triggerVfib = TriggerEmergencyVfib
            , triggerAsystole = TriggerEmergencyAsystole
            , resetNominal = ResetNominal
            }
    in
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

        -- 2. Patient Demographics and Bed Header Ticker
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

        -- 4. Bottom Controls and Simulation Toolbar
        , Controls.renderControlToolbar
            model.isPaused
            model.simSpeed
            model.activeScenario
            model.isWardView
            toolbarActions

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
                [ text ("Diagnosis: " ++ p.primaryDiagnosis) ]
            ]
        , div
            [ style "display" "flex"
            , style "gap" "16px"
            , style "font-family" "monospace"
            , style "font-size" "13px"
            ]
            [ div []
                [ span [ style "color" Theme.textMutedColor ] [ text "NEWS2: " ]
                , span [ style "color" Theme.warningColor, style "font-weight" "bold" ] [ text "2 (Low Risk)" ]
                ]
            , div []
                [ span [ style "color" Theme.textMutedColor ] [ text "SOFA: " ]
                , span [ style "color" Theme.textPrimaryColor, style "font-weight" "bold" ] [ text "1" ]
                ]
            , div []
                [ span [ style "color" Theme.textMutedColor ] [ text "SIM TIME: " ]
                , span [ style "color" Theme.ecgColor, style "font-weight" "bold" ] [ text (formatSimTime model.currentTimeMs) ]
                ]
            ]
        ]


{-| Bedside sweepbar oscilloscope workspace with numeric vitals callout column.
-}
renderBedsideWorkspace : Model -> Html Msg
renderBedsideWorkspace model =
    let
        sweepPos =
            Sweepbar.normalizeX model.currentTimeMs 800.0

        scenDef =
            Scenarios.getScenarioDefinition model.activeScenario

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

        ModalPvLoop ->
            Html.map PvModalMsg (PvModal.viewPvModal model.pvModel)

        ModalVentilator ->
            Html.map VentViewMsg
                (VentView.viewVentilatorScreen
                    model.ventSettings
                    model.ventMechanics
                    model.ventScalars
                    model.pawHistory
                    model.flowHistory
                    model.volHistory
                )

        ModalTrends ->
            Html.map TrendsViewMsg
                (TrendsView.viewTrendsScreen
                    model.trendInterval
                    model.trendRecords
                )

        ModalSpectrum ->
            Html.map SpectrumModalMsg
                (SpectrumModal.viewSpectrumModal
                    model.hrvMetrics
                    model.psdPoints
                )

        ModalEhrExport ->
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
            in
            Html.map EhrModalMsg
                (EhrModal.viewEhrModal
                    model.ehrFormat
                    activeBed.patient
                    model.currentTimeMs
                )


formatSimTime : Float -> String
formatSimTime ms =
    let
        totalSec =
            round (ms / 1000.0)

        m =
            modBy 60 (totalSec // 60)

        s =
            modBy 60 totalSec

        pad n =
            if n < 10 then
                "0" ++ String.fromInt n

            else
                String.fromInt n
    in
    pad m ++ ":" ++ pad s


{-| Application subscriptions: 60 FPS animation frame tick and keyboard shortcuts.
-}
subscriptions : Model -> Sub Msg
subscriptions _ =
    Sub.batch
        [ Browser.Events.onAnimationFrameDelta FrameTick
        , Browser.Events.onKeyDown (Decode.map handleKeyDown (Decode.field "key" Decode.string))
        , Ports.streamIn InboundTelemetry
        ]


handleKeyDown : String -> Msg
handleKeyDown key =
    case key of
        " " ->
            TogglePause

        "Escape" ->
            CloseModals

        "1" ->
            OpenModal Modal12Lead

        "2" ->
            OpenModal ModalHemodynamics

        "3" ->
            OpenModal ModalInfusionPump

        "4" ->
            OpenModal ModalPvLoop

        "5" ->
            OpenModal ModalVentilator

        "6" ->
            OpenModal ModalTrends

        "7" ->
            OpenModal ModalSpectrum

        "8" ->
            OpenModal ModalEhrExport

        "w" ->
            ToggleWardView

        "W" ->
            ToggleWardView

        _ ->
            FrameTick 0.0


main : Program () Model Msg
main =
    Browser.element
        { init = init
        , view = view
        , update = update
        , subscriptions = subscriptions
        }
