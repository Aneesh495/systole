module TestSpectrum exposing (suite)

import Dsp.Spectrum as Spectrum
import Expect
import Test exposing (Test, describe, test)


suite : Test
suite =
    describe "Dsp.Spectrum Test Suite"
        [ test "Complex magnitude calculation" <|
            \_ ->
                let
                    c =
                        { re = 3.0, im = 4.0 }
                in
                Spectrum.complexMagnitude c
                    |> Expect.within (Expect.Absolute 1.0e-5) 5.0
        , test "Hann window coefficients are symmetric and taper to zero" <|
            \_ ->
                let
                    samples =
                        List.repeat 16 1.0

                    windowed =
                        Spectrum.applyWindow Spectrum.Hann samples

                    firstVal =
                        List.head windowed |> Maybe.withDefault 99.0

                    lastVal =
                        List.reverse windowed |> List.head |> Maybe.withDefault 99.0

                    midVal =
                        List.drop 8 windowed |> List.head |> Maybe.withDefault 0.0
                in
                Expect.all
                    [ \_ -> Expect.within (Expect.Absolute 0.01) 0.0 firstVal
                    , \_ -> Expect.within (Expect.Absolute 0.01) 0.0 lastVal
                    , \_ -> Expect.within (Expect.Absolute 0.05) 1.0 midVal
                    ]
                    ()
        , test "DFT detects dominant single frequency tone" <|
            \_ ->
                let
                    fs =
                        64.0

                    n =
                        64

                    -- 8 Hz sine tone: 8 cycles in 64 samples at 64 Hz
                    tone =
                        List.range 0 (n - 1)
                            |> List.map (\i -> sin (2.0 * pi * 8.0 * toFloat i / fs))

                    psd =
                        Spectrum.computePsd fs Spectrum.Rectangular tone

                    -- Peak should be located at 8.0 Hz (bin k=8)
                    peakBin =
                        List.foldl
                            (\( f, p ) ( maxF, maxP ) ->
                                if p > maxP then
                                    ( f, p )

                                else
                                    ( maxF, maxP )
                            )
                            ( 0.0, 0.0 )
                            psd
                in
                Tuple.first peakBin
                    |> Expect.within (Expect.Absolute 0.5) 8.0
        , test "HRV frequency metrics calculate LF/HF ratio" <|
            \_ ->
                let
                    fs =
                        4.0

                    -- Resampled RR series (4 Hz) with combined 0.1 Hz (LF) and 0.25 Hz (HF) oscillation
                    rrSeries =
                        List.range 0 127
                            |> List.map
                                (\i ->
                                    let
                                        t =
                                            toFloat i / fs
                                    in
                                    800.0 + 50.0 * sin (2.0 * pi * 0.1 * t) + 25.0 * sin (2.0 * pi * 0.25 * t)
                                )

                    metrics =
                        Spectrum.computeHrvFrequencyMetrics fs rrSeries
                in
                Expect.all
                    [ \_ -> Expect.equal True (metrics.lfPowerMs2 > 0.0)
                    , \_ -> Expect.equal True (metrics.hfPowerMs2 > 0.0)
                    , \_ -> Expect.equal True (metrics.lfHfRatio > 1.0)
                    ]
                    ()
        ]
