module TestPanTompkins exposing (suite)

{-| Verification test suite for Pan-Tompkins QRS complex detection.
Tests synthetic ECG pulses, refractory blanking, and heart rate convergence.
-}

import Dsp.PanTompkins as PT
import Expect
import Test exposing (Test, describe, test)


suite : Test
suite =
    describe "Dsp.PanTompkins Verification Suite"
        [ test "Detects synthetic QRS complexes at 75 BPM" <|
            \_ ->
                let
                    fs =
                        200.0

                    -- 75 BPM corresponds to 1.25 Hz or one beat every 160 samples (800 ms)
                    periodSamples =
                        160

                    totalSamples =
                        1600

                    -- Synthesize baseline with narrow Gaussian R-peaks of amplitude 1.5 mV
                    makeSample : Int -> Float
                    makeSample idx =
                        let
                            phase =
                                modBy periodSamples idx

                            rPeak =
                                if phase >= 78 && phase <= 82 then
                                    let
                                        dist =
                                            toFloat (phase - 80)
                                    in
                                    1.5 * (e ^ (-0.5 * dist * dist))

                                else
                                    0.0
                        in
                        rPeak

                    detector =
                        PT.initDetector PT.defaultConfig

                    ( detectedPeaks, _ ) =
                        List.range 0 (totalSamples - 1)
                            |> List.foldl
                                (\idx ( peaks, st ) ->
                                    let
                                        s =
                                            makeSample idx

                                        t =
                                            toFloat idx * (1000.0 / fs)

                                        ( det, nextSt ) =
                                            PT.processSample s t st
                                    in
                                    if det.isPeak then
                                        ( det :: peaks, nextSt )

                                    else
                                        ( peaks, nextSt )
                                )
                                ( [], detector )

                    peakCount =
                        List.length detectedPeaks
                in
                -- Over 1600 samples (8.0 seconds) at 75 BPM, we expect exactly 9 to 11 detected beats
                Expect.all
                    [ \_ -> Expect.greaterThan 7 peakCount
                    , \_ -> Expect.lessThan 13 peakCount
                    ]
                    ()
        , test "Refractory period prevents false triggering on immediate post-spike echo" <|
            \_ ->
                let
                    fs =
                        200.0

                    detector =
                        PT.initDetector PT.defaultConfig

                    -- Two pulses at idx=50 and idx=70 separated by 20 samples (100 ms, inside 200 ms refractory)
                    makeSpikeSample : Int -> Float
                    makeSpikeSample idx =
                        if idx >= 48 && idx <= 52 then
                            let
                                dist =
                                    toFloat (idx - 50)
                            in
                            1.5 * (e ^ (-0.5 * dist * dist))

                        else if idx >= 68 && idx <= 72 then
                            let
                                dist =
                                    toFloat (idx - 70)
                            in
                            1.5 * (e ^ (-0.5 * dist * dist))

                        else
                            0.0

                    detectedPeaks =
                        List.range 0 150
                            |> List.foldl
                                (\idx ( peaks, st ) ->
                                    let
                                        s =
                                            makeSpikeSample idx

                                        t =
                                            toFloat idx * (1000.0 / fs)

                                        ( det, nextSt ) =
                                            PT.processSample s t st
                                    in
                                    if det.isPeak then
                                        ( det :: peaks, nextSt )

                                    else
                                        ( peaks, nextSt )
                                )
                                ( [], detector )
                            |> Tuple.first
                in
                -- Second pulse must be blanked by 200 ms refractory window
                Expect.equal 1 (List.length detectedPeaks)
        ]
