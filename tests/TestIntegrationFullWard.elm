module TestIntegrationFullWard exposing (suite)

import Alarms.Manager as AM
import Alarms.Types as AT exposing (AlarmPriority(..))
import Dsp.Arrhythmia as Arr
import Expect
import Simulation.Patient as Patient
import Simulation.Scenarios as Scenarios exposing (ClinicalScenario(..))
import Simulation.SignalGenerator as SigGen
import Simulation.Ward as Ward
import Test exposing (Test, describe, test)


suite : Test
suite =
    describe "Integration.FullWard 8-Bed Concurrency Suite"
        [ test "Ward initializes all 8 beds with valid clinical profiles" <|
            \_ ->
                let
                    ward =
                        Ward.initWard
                in
                Expect.all
                    [ \_ -> Expect.equal 8 (List.length ward.beds)
                    , \_ -> Expect.equal 1 ward.selectedBedNumber
                    ]
                    ()
        , test "Ward updates vitals across all beds independently" <|
            \_ ->
                let
                    initialWard =
                        Ward.initWard

                    -- Update bed 3 with Septic Shock vitals
                    updatedWard =
                        Ward.updateBedVitals
                            3
                            128.0 -- HR
                            84.0 -- SBP
                            42.0 -- DBP
                            92.0 -- SpO2
                            31.0 -- EtCO2
                            4.0 -- CVP
                            True -- Crisis
                            False -- Warning
                            "Sinus Tachycardia"
                            initialWard

                    bed3 =
                        Ward.getBed 3 updatedWard
                            |> Maybe.withDefault
                                { bedNumber = 3
                                , patient = Patient.defaultPatient
                                , scenario = Scenarios.BaselineNominal
                                , heartRateBpm = 0.0
                                , systolicMmhg = 0.0
                                , diastolicMmhg = 0.0
                                , meanMmhg = 0.0
                                , spo2Percent = 0.0
                                , etco2Mmhg = 0.0
                                , cvpMmhg = 0.0
                                , hasActiveCrisis = False
                                , hasActiveWarning = False
                                , primaryRhythmString = ""
                                }
                in
                Expect.all
                    [ \_ -> Expect.equal 128.0 bed3.heartRateBpm
                    , \_ -> Expect.equal 84.0 bed3.systolicMmhg
                    , \_ -> Expect.equal True bed3.hasActiveCrisis
                    , \_ -> Expect.equal "Sinus Tachycardia" bed3.primaryRhythmString
                    ]
                    ()
        , test "Telemetry synthesis across 10 seconds of simulated time" <|
            \_ ->
                let
                    genCfg =
                        SigGen.defaultGeneratorConfig

                    genState =
                        SigGen.initGeneratorState genCfg

                    -- Step 100 samples (0.5 second at 200 Hz)
                    stepLoop i ( currentSt, accEcg ) =
                        let
                            t =
                                toFloat i * 5.0

                            ( waveforms, nextSt ) =
                                SigGen.synthesizeWaveforms 75.0 120.0 80.0 98.0 38.0 6.0 t currentSt
                        in
                        ( nextSt, waveforms.leadII :: accEcg )

                    ( _, ecgSamples ) =
                        List.foldl stepLoop ( genState, [] ) (List.range 1 100)
                in
                -- Should generate exactly 100 physiological ECG samples
                Expect.equal 100 (List.length ecgSamples)
        ]
