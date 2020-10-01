module Dsp.Spectrum exposing
    ( Complex
    , HrvFrequencyMetrics
    , WindowFunction(..)
    , applyWindow
    , computeDft
    , computePsd
    , computeHrvFrequencyMetrics
    , complexMagnitude
    )

{-| Discrete Fourier Transform (DFT) and power spectral density estimation
for clinical Heart Rate Variability (HRV) frequency-domain analysis.

HRV frequency bands conform to Task Force of The European Society of Cardiology
and The North American Society of Pacing and Electrophysiology standards:
- Very Low Frequency (VLF): 0.0033 Hz to 0.04 Hz
- Low Frequency (LF): 0.04 Hz to 0.15 Hz (sympathetic and baroreflex activity)
- High Frequency (HF): 0.15 Hz to 0.40 Hz (parasympathetic vagal modulation)
-}


{-| Complex number representation: real and imaginary components.
-}
type alias Complex =
    { re : Float
    , im : Float
    }


{-| Supported spectral windowing functions.
-}
type WindowFunction
    = Rectangular
    | Hann
    | Hamming


{-| Standard HRV frequency domain metrics.
-}
type alias HrvFrequencyMetrics =
    { vlfPowerMs2 : Float
    , lfPowerMs2 : Float
    , hfPowerMs2 : Float
    , totalPowerMs2 : Float
    , lfHfRatio : Float
    , lfNormalized : Float
    , hfNormalized : Float
    }


{-| Compute the absolute magnitude of a complex number.
-}
complexMagnitude : Complex -> Float
complexMagnitude c =
    sqrt (c.re * c.re + c.im * c.im)


{-| Apply window function to an array of samples.
-}
applyWindow : WindowFunction -> List Float -> List Float
applyWindow window samples =
    let
        n =
            List.length samples

        nFloat =
            toFloat n

        windowCoeff i =
            case window of
                Rectangular ->
                    1.0

                Hann ->
                    0.5 * (1.0 - cos (2.0 * pi * toFloat i / (nFloat - 1.0)))

                Hamming ->
                    0.54 - 0.46 * cos (2.0 * pi * toFloat i / (nFloat - 1.0))
    in
    List.indexedMap (\i x -> x * windowCoeff i) samples


{-| Compute discrete Fourier transform (DFT) bin at frequency index k.
-}
computeDftBin : Int -> Int -> List Float -> Complex
computeDftBin k n samples =
    let
        nFloat =
            toFloat n

        folder ( i, x ) acc =
            let
                angle =
                    2.0 * pi * toFloat (k * i) / nFloat
            in
            { re = acc.re + x * cos angle
            , im = acc.im - x * sin angle
            }
    in
    List.foldl folder { re = 0.0, im = 0.0 } (List.indexedMap (\i x -> ( i, x )) samples)


{-| Compute one-sided discrete Fourier transform across frequencies up to Nyquist.
-}
computeDft : List Float -> List ( Float, Complex )
computeDft samples =
    let
        n =
            List.length samples

        numBins =
            (n // 2) + 1
    in
    List.range 0 (numBins - 1)
        |> List.map
            (\k ->
                ( toFloat k / toFloat n
                , computeDftBin k n samples
                )
            )


{-| Compute one-sided power spectral density (PSD) with frequency bins in Hertz.
-}
computePsd : Float -> WindowFunction -> List Float -> List ( Float, Float )
computePsd sampleRate window samples =
    let
        windowed =
            applyWindow window samples

        n =
            List.length samples

        nFloat =
            toFloat n

        dftBins =
            computeDft windowed
    in
    List.map
        (\( normalizedFreq, c ) ->
            let
                freqHz =
                    normalizedFreq * sampleRate

                mag =
                    complexMagnitude c

                -- Power scaled by sample count
                power =
                    (mag * mag) / (nFloat * sampleRate)
            in
            ( freqHz, power )
        )
        dftBins


{-| Integrate power spectral density across a specified frequency interval [fLow, fHigh].
-}
integrateBandPower : Float -> Float -> List ( Float, Float ) -> Float
integrateBandPower fLow fHigh psd =
    let
        inBand ( freq, _ ) =
            freq >= fLow && freq <= fHigh

        bandPoints =
            List.filter inBand psd
    in
    case bandPoints of
        [] ->
            0.0

        _ ->
            -- Approximate trapezoidal/sum integral
            List.foldl (\( _, p ) acc -> acc + p) 0.0 bandPoints


{-| Compute standard HRV frequency domain metrics from uniformly resampled RR intervals.
-}
computeHrvFrequencyMetrics : Float -> List Float -> HrvFrequencyMetrics
computeHrvFrequencyMetrics resampleRate rrSeries =
    let
        psd =
            computePsd resampleRate Hann rrSeries

        vlf =
            integrateBandPower 0.0033 0.04 psd

        lf =
            integrateBandPower 0.04 0.15 psd

        hf =
            integrateBandPower 0.15 0.40 psd

        total =
            vlf + lf + hf

        ratio =
            if hf > 1.0e-6 then
                lf / hf

            else
                0.0

        denom =
            total - vlf

        ( lfNorm, hfNorm ) =
            if denom > 1.0e-6 then
                ( (lf / denom) * 100.0, (hf / denom) * 100.0 )

            else
                ( 50.0, 50.0 )
    in
    { vlfPowerMs2 = vlf
    , lfPowerMs2 = lf
    , hfPowerMs2 = hf
    , totalPowerMs2 = total
    , lfHfRatio = ratio
    , lfNormalized = lfNorm
    , hfNormalized = hfNorm
    }
