module TestFilter exposing (suite)

{-| Verification test suite for digital filters.
Validates frequency responses, numerical stability, and direct form II step response.
-}

import Dsp.Filter as Filter
import Dsp.Types exposing (BiquadCoeffs, BiquadState)
import Expect
import Test exposing (Test, describe, test)


suite : Test
suite =
    describe "Dsp.Filter Verification Suite"
        [ test "Lowpass filter attenuates high-frequency sinusoid" <|
            \_ ->
                let
                    fs =
                        200.0

                    fc =
                        15.0

                    coeffs =
                        Filter.lowpass fs fc

                    -- Feed 100 samples of 80 Hz sinusoid (well above 15 Hz cutoff)
                    samples =
                        List.range 0 100
                            |> List.map (\n -> sin (2.0 * pi * 80.0 * toFloat n / fs))

                    filtered =
                        List.foldl
                            (\s ( acc, st ) ->
                                let
                                    ( out, nextSt ) =
                                        Filter.applyBiquad coeffs s st
                                in
                                ( out :: acc, nextSt )
                            )
                            ( [], Filter.initBiquadState )
                            samples
                            |> Tuple.first
                            |> List.take 20
                            |> List.map abs
                            |> List.maximum
                            |> Maybe.withDefault 1.0
                in
                -- Maximum amplitude of high-frequency tone should be attenuated below 0.35
                Expect.lessThan 0.35 filtered
        , test "Highpass filter blocks DC offset" <|
            \_ ->
                let
                    fs =
                        200.0

                    fc =
                        0.5

                    coeffs =
                        Filter.highpass fs fc

                    -- Step input of 5.0 mV DC offset for 500 samples
                    samples =
                        List.repeat 500 5.0

                    finalOutput =
                        List.foldl
                            (\s ( _, st ) ->
                                Filter.applyBiquad coeffs s st
                            )
                            ( 0.0, Filter.initBiquadState )
                            samples
                            |> Tuple.first
                in
                -- DC step response should settle to near zero (< 0.05 mV)
                Expect.lessThan 0.05 (abs finalOutput)
        , test "Notch filter suppresses mains interference frequency" <|
            \_ ->
                let
                    fs =
                        200.0

                    fNotch =
                        50.0

                    q =
                        10.0

                    coeffs =
                        Filter.notch fs fNotch q

                    -- 50 Hz pure sinusoid input
                    samples =
                        List.range 0 200
                            |> List.map (\n -> sin (2.0 * pi * fNotch * toFloat n / fs))

                    finalOutput =
                        List.foldl
                            (\s ( acc, st ) ->
                                let
                                    ( out, nextSt ) =
                                        Filter.applyBiquad coeffs s st
                                in
                                ( out :: acc, nextSt )
                            )
                            ( [], Filter.initBiquadState )
                            samples
                            |> Tuple.first
                            |> List.take 30
                            |> List.map abs
                            |> List.maximum
                            |> Maybe.withDefault 1.0
                in
                -- Output at notch frequency should be attenuated below 0.15
                Expect.lessThan 0.15 finalOutput
        , test "Baseline wander estimator settles towards mean" <|
            \_ ->
                let
                    init =
                        { estimate = 0.0, alpha = 0.95 }

                    samples =
                        List.repeat 100 2.0

                    finalState =
                        List.foldl
                            (\s ( _, st ) ->
                                Filter.removeBaselineWander s st
                            )
                            ( 0.0, init )
                            samples
                            |> Tuple.second
                in
                -- Estimate should converge close to 2.0
                Expect.greaterThan 1.95 finalState.estimate
        ]
