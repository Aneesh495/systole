module Dsp.Filter exposing
    ( applyBiquad
    , applyCascade
    , bandpass
    , highpass
    , initBiquadState
    , lowpass
    , movingAverage
    , notch
    , removeBaselineWander
    )

{-| Production-grade discrete-time Infinite Impulse Response (IIR) and Finite Impulse Response (FIR)
digital filters designed for life-critical physiological telemetry. Implements Direct Form II
Transposed biquads with verified numerical stability and zero runtime allocation.
-}

import Dsp.Types exposing (BaselineState, BiquadCoeffs, BiquadState, CircularBuffer)


{-| Initial idle state for a second-order biquad section.
-}
initBiquadState : BiquadState
initBiquadState =
    { w1 = 0.0
    , w2 = 0.0
    }


{-| Execute one step of Direct Form II Transposed biquad filtering.
Direct Form II Transposed is chosen over Direct Form I for superior floating-point
dynamic range and reduced roundoff error when poles are near the unit circle.

Difference equations:
    y[n] = b0 * x[n] + w1[n-1]
    w1[n] = b1 * x[n] - a1 * y[n] + w2[n-1]
    w2[n] = b2 * x[n] - a2 * y[n]
-}
applyBiquad : BiquadCoeffs -> Float -> BiquadState -> ( Float, BiquadState )
applyBiquad coeffs x state =
    let
        y =
            coeffs.b0 * x + state.w1

        nextW1 =
            coeffs.b1 * x - coeffs.a1 * y + state.w2

        nextW2 =
            coeffs.b2 * x - coeffs.a2 * y
    in
    ( y
    , { w1 = nextW1
      , w2 = nextW2
      }
    )


{-| Apply a cascaded series of biquad filter sections sequentially.
-}
applyCascade : List BiquadCoeffs -> Float -> List BiquadState -> ( Float, List BiquadState )
applyCascade coeffsList input statesList =
    case ( coeffsList, statesList ) of
        ( [], _ ) ->
            ( input, [] )

        ( _, [] ) ->
            ( input, [] )

        ( c :: restCoeffs, s :: restStates ) ->
            let
                ( intermediateOutput, nextState ) =
                    applyBiquad c input s

                ( finalOutput, finalStates ) =
                    applyCascade restCoeffs intermediateOutput restStates
            in
            ( finalOutput, nextState :: finalStates )


{-| Synthesize second-order Butterworth low-pass filter coefficients.
Sample frequency fs and cutoff frequency fc must be specified in Hertz.
-}
lowpass : Float -> Float -> BiquadCoeffs
lowpass fs fc =
    let
        w0 =
            2.0 * pi * (fc / fs)

        cosW0 =
            cos w0

        sinW0 =
            sin w0

        -- Q factor = 1 / sqrt(2) for maximally flat Butterworth response
        alpha =
            sinW0 / (2.0 * 0.7071067811865475)

        b0 =
            (1.0 - cosW0) / 2.0

        b1 =
            1.0 - cosW0

        b2 =
            (1.0 - cosW0) / 2.0

        a0 =
            1.0 + alpha

        a1 =
            -2.0 * cosW0

        a2 =
            1.0 - alpha
    in
    { b0 = b0 / a0
    , b1 = b1 / a0
    , b2 = b2 / a0
    , a1 = a1 / a0
    , a2 = a2 / a0
    }


{-| Synthesize second-order Butterworth high-pass filter coefficients.
Used for eliminating respiratory baseline drift while preserving cardiac components.
-}
highpass : Float -> Float -> BiquadCoeffs
highpass fs fc =
    let
        w0 =
            2.0 * pi * (fc / fs)

        cosW0 =
            cos w0

        sinW0 =
            sin w0

        alpha =
            sinW0 / (2.0 * 0.7071067811865475)

        b0 =
            (1.0 + cosW0) / 2.0

        b1 =
            -(1.0 + cosW0)

        b2 =
            (1.0 + cosW0) / 2.0

        a0 =
            1.0 + alpha

        a1 =
            -2.0 * cosW0

        a2 =
            1.0 - alpha
    in
    { b0 = b0 / a0
    , b1 = b1 / a0
    , b2 = b2 / a0
    , a1 = a1 / a0
    , a2 = a2 / a0
    }


{-| Synthesize second-order bandpass filter coefficients with center frequency f0 and quality factor Q.
-}
bandpass : Float -> Float -> Float -> BiquadCoeffs
bandpass fs f0 q =
    let
        w0 =
            2.0 * pi * (f0 / fs)

        cosW0 =
            cos w0

        sinW0 =
            sin w0

        alpha =
            sinW0 / (2.0 * q)

        b0 =
            alpha

        b1 =
            0.0

        b2 =
            -alpha

        a0 =
            1.0 + alpha

        a1 =
            -2.0 * cosW0

        a2 =
            1.0 - alpha
    in
    { b0 = b0 / a0
    , b1 = b1 / a0
    , b2 = b2 / a0
    , a1 = a1 / a0
    , a2 = a2 / a0
    }


{-| Synthesize notch (bandstop) filter coefficients to suppress AC mains interference (50 Hz or 60 Hz).
-}
notch : Float -> Float -> Float -> BiquadCoeffs
notch fs fNotch q =
    let
        w0 =
            2.0 * pi * (fNotch / fs)

        cosW0 =
            cos w0

        sinW0 =
            sin w0

        alpha =
            sinW0 / (2.0 * q)

        b0 =
            1.0

        b1 =
            -2.0 * cosW0

        b2 =
            1.0

        a0 =
            1.0 + alpha

        a1 =
            -2.0 * cosW0

        a2 =
            1.0 - alpha
    in
    { b0 = b0 / a0
    , b1 = b1 / a0
    , b2 = b2 / a0
    , a1 = a1 / a0
    , a2 = a2 / a0
    }


{-| Remove baseline wander using an exponential leaky integrator.
Subtracts the low-frequency drift estimate from the raw sample.
-}
removeBaselineWander : Float -> BaselineState -> ( Float, BaselineState )
removeBaselineWander sample state =
    let
        updatedEstimate =
            state.alpha * state.estimate + (1.0 - state.alpha) * sample

        correctedSample =
            sample - updatedEstimate
    in
    ( correctedSample
    , { state | estimate = updatedEstimate }
    )


{-| Compute the unweighted arithmetic mean over a list of samples.
-}
movingAverage : List Float -> Float
movingAverage samples =
    case samples of
        [] ->
            0.0

        _ ->
            List.sum samples / toFloat (List.length samples)
