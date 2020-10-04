module TestWavelet exposing (suite)

import Dsp.Wavelet as Wavelet
import Expect
import Test exposing (Test, describe, test)


suite : Test
suite =
    describe "Dsp.Wavelet Test Suite"
        [ test "Haar decomposition halves length for both approx and detail" <|
            \_ ->
                let
                    signal =
                        [ 1.0, 1.0, 2.0, 2.0, 3.0, 3.0, 4.0, 4.0 ]

                    ( approx, detail ) =
                        Wavelet.decompose1D Wavelet.Haar signal
                in
                Expect.all
                    [ \_ -> Expect.equal 4 (List.length approx)
                    , \_ -> Expect.equal 4 (List.length detail)
                    ]
                    ()
        , test "Daubechies4 multi-level decomposition produces 3 detail levels" <|
            \_ ->
                let
                    signal =
                        List.repeat 64 1.0

                    decomp =
                        Wavelet.decomposeMultiLevel 3 Wavelet.Daubechies4 signal
                in
                Expect.equal 3 (List.length decomp.details)
        , test "Hard thresholding sets small values to zero" <|
            \_ ->
                let
                    coeffs =
                        [ -0.5, 0.2, 1.5, -2.0, 0.05 ]

                    thresholded =
                        Wavelet.hardThreshold 0.3 coeffs
                in
                thresholded
                    |> Expect.equal [ -0.5, 0.0, 1.5, -2.0, 0.0 ]
        , test "Soft thresholding shrinks magnitude by lambda" <|
            \_ ->
                let
                    coeffs =
                        [ 2.0, -2.0, 0.2 ]

                    thresholded =
                        Wavelet.softThreshold 0.5 coeffs

                    firstVal =
                        List.head thresholded |> Maybe.withDefault 0.0

                    secondVal =
                        List.drop 1 thresholded |> List.head |> Maybe.withDefault 0.0

                    thirdVal =
                        List.drop 2 thresholded |> List.head |> Maybe.withDefault 99.0
                in
                Expect.all
                    [ \_ -> Expect.within (Expect.Absolute 1.0e-5) 1.5 firstVal
                    , \_ -> Expect.within (Expect.Absolute 1.0e-5) -1.5 secondVal
                    , \_ -> Expect.within (Expect.Absolute 1.0e-5) 0.0 thirdVal
                    ]
                    ()
        , test "QRS wavelet peak detector identifies synthetic spike" <|
            \_ ->
                let
                    -- 64 samples with sharp peak at index 32
                    signal =
                        List.range 0 63
                            |> List.map
                                (\i ->
                                    if i == 32 then
                                        5.0

                                    else
                                        0.0
                                )

                    peaks =
                        Wavelet.detectQrsWaveletPeaks 0.5 signal
                in
                -- Should find peak near sample 32
                Expect.equal True (List.length peaks > 0)
        ]
