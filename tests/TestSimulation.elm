module TestSimulation exposing (suite)

{-| Verification test suite for physiological signal simulation and multi-bed ward state.
Validates multi-lead ECG synthesis, arterial pressure waveforms, and ward telemetry updates.
-}

import Expect
import Simulation.Patient as Patient
import Simulation.Scenarios as Scenarios
import Simulation.SignalGenerator as SigGen
import Simulation.Ward as Ward
import Test exposing (Test, describe, test)


suite : Test
suite =
    describe "Simulation & Synthetic Patient Verification Suite"
        [ test "Waveform generator produces valid multi-lead ECG and pulsatile pressures" <|
            \_ ->
                let
                    config =
                        SigGen.defaultGeneratorConfig

                    st =
                        SigGen.initGeneratorState config

                    -- Advance 200 samples (1.0 second at 200 Hz, 75 BPM)
                    ( allSamples, _ ) =
                        List.range 0 199
                            |> List.foldl
                                (\idx ( acc, currentSt ) ->
                                    let
                                        t =
                                            toFloat idx * 5.0

                                        ( s, nextSt ) =
                                            SigGen.synthesizeWaveforms 75.0 120.0 80.0 98.0 38.0 6.0 t currentSt
                                    in
                                    ( s :: acc, nextSt )
                                )
                                ( [], st )

                    maxLeadII =
                        allSamples
                            |> List.map .leadII
                            |> List.maximum
                            |> Maybe.withDefault 0.0

                    maxAbp =
                        allSamples
                            |> List.map .abpMmhg
                            |> List.maximum
                            |> Maybe.withDefault 0.0

                    minAbp =
                        allSamples
                            |> List.map .abpMmhg
                            |> List.minimum
                            |> Maybe.withDefault 0.0
                in
                Expect.all
                    [ -- R-peak amplitude in Lead II should exceed 1.0 mV
                      \_ -> Expect.greaterThan 1.0 maxLeadII
                      -- ABP systolic peak should reach ~120 mmHg (+/- 8 mmHg with resp swing)
                    , \_ -> Expect.greaterThan 115.0 maxAbp
                    , \_ -> Expect.lessThan 128.0 maxAbp
                      -- ABP diastolic trough should drop to ~80 mmHg (+/- 8 mmHg)
                    , \_ -> Expect.greaterThan 72.0 minAbp
                    , \_ -> Expect.lessThan 85.0 minAbp
                    ]
                    ()
        , test "Ward state initializes exactly 8 beds with unique identifiers" <|
            \_ ->
                let
                    ward =
                        Ward.initWard

                    bedCount =
                        List.length ward.beds

                    uniqueIds =
                        ward.beds
                            |> List.map (.id << .patient)
                            |> List.foldl
                                (\id acc ->
                                    if List.member id acc then
                                        acc

                                    else
                                        id :: acc
                                )
                                []
                            |> List.length
                in
                Expect.all
                    [ \_ -> Expect.equal 8 bedCount
                    , \_ -> Expect.equal 8 uniqueIds
                    , \_ -> Expect.equal 1 ward.selectedBedNumber
                    ]
                    ()
        , test "Updating bed vitals updates mean arterial pressure and alarm flags" <|
            \_ ->
                let
                    ward =
                        Ward.initWard

                    -- Update Bed 2 with septic hypotension (SBP 80, DBP 40 -> MAP = 40 + 40/3 = 53.3 mmHg)
                    updated =
                        Ward.updateBedVitals 2 130.0 80.0 40.0 91.0 28.0 3.0 False True "Sinus Tachycardia" ward

                    bed2 =
                        Ward.getBed 2 updated
                in
                case bed2 of
                    Just b ->
                        Expect.all
                            [ \_ -> Expect.within (Expect.Absolute 0.5) 53.3 b.meanMmhg
                            , \_ -> Expect.equal True b.hasActiveWarning
                            , \_ -> Expect.equal "Sinus Tachycardia" b.primaryRhythmString
                            ]
                            ()

                    Nothing ->
                        Expect.fail "Expected Bed 2 to exist in ward"
        , test "Acute anterior STEMI scenario specifies marked precordial ST elevation" <|
            \_ ->
                let
                    def =
                        Scenarios.getScenarioDefinition Scenarios.AcuteAnteriorStemi
                in
                Expect.all
                    [ \_ -> Expect.greaterThan 0.2 def.stElevationMv
                    , \_ -> Expect.greaterThan 100.0 def.heartRateBpm
                    ]
                    ()
        ]
