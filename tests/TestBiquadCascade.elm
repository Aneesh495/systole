module TestBiquadCascade exposing (suite)

import Dsp.BiquadCascade as Cascade
import Expect
import Test exposing (Test, describe, test)


suite : Test
suite =
    describe "Dsp.BiquadCascade Test Suite"
        [ test "Diagnostic filter initializes with 3 stages" <|
            \_ ->
                let
                    filter =
                        Cascade.diagnosticEcgFilter 200.0
                in
                List.length filter.stages
                    |> Expect.equal 3
        , test "Monitoring filter initializes with MonitoringMode" <|
            \_ ->
                let
                    filter =
                        Cascade.monitoringEcgFilter 200.0
                in
                Expect.equal filter.mode Cascade.MonitoringMode
        , test "Surgical ESU filter attenuates high frequency noise" <|
            \_ ->
                let
                    filter =
                        Cascade.surgicalEsuFilter 200.0

                    -- 50 Hz sine wave: inside stopband for surgical filter (cutoff 20 Hz)
                    generateTone freq n =
                        List.range 0 (n - 1)
                            |> List.map (\i -> sin (2.0 * pi * freq * toFloat i / 200.0))

                    samples =
                        generateTone 50.0 200

                    ( filtered, _ ) =
                        Cascade.filterList samples filter

                    -- Measure amplitude over the second half after transient settles
                    lateSamples =
                        List.drop 100 filtered

                    maxLateAbs =
                        List.foldl (\x acc -> max acc (abs x)) 0.0 lateSamples
                in
                -- Expect attenuation: 50 Hz signal with unit amplitude should be attenuated below 0.35
                Expect.equal True (maxLateAbs < 0.35)
        , test "DC offset rejection in monitoring filter" <|
            \_ ->
                let
                    filter =
                        Cascade.monitoringEcgFilter 200.0

                    -- Constant DC offset input of 2.0 mV
                    dcSamples =
                        List.repeat 300 2.0

                    ( filtered, _ ) =
                        Cascade.filterList dcSamples filter

                    lastSample =
                        List.drop 280 filtered
                            |> List.head
                            |> Maybe.withDefault 99.0
                in
                -- The highpass filter should drive DC offset toward 0.0
                Expect.equal True (abs lastSample < 0.1)
        , test "Reset cascade zeroes out biquad state variables" <|
            \_ ->
                let
                    filter =
                        Cascade.monitoringEcgFilter 200.0

                    ( _, activeFilter ) =
                        Cascade.filterList (List.repeat 50 1.0) filter

                    resetFilter =
                        Cascade.resetCascade activeFilter

                    allZeroed =
                        List.all (\( _, state ) -> state.w1 == 0.0 && state.w2 == 0.0) resetFilter.stages
                in
                Expect.equal True allZeroed
        ]
