module Dsp.BiquadCascade exposing
    ( CascadeFilter
    , CascadeMode(..)
    , createCascade
    , diagnosticEcgFilter
    , monitoringEcgFilter
    , surgicalEsuFilter
    , resetCascade
    , stepCascade
    , filterList
    )

{-| Multi-stage IIR filter cascade presets for clinical electrocardiography
and physiological signal conditioning.

Conforms to standard clinical bandwidth definitions:
- Diagnostic Mode: 0.05 Hz to 150 Hz with 50/60 Hz notch filter
- Monitoring Mode: 0.5 Hz to 40 Hz with 50/60 Hz notch filter
- Surgical (ESU) Mode: 1.0 Hz to 20 Hz rejection filter for electrocautery noise suppression
-}

import Dsp.Filter as Filter exposing (initBiquadState)
import Dsp.Types exposing (BiquadCoeffs, BiquadState)


{-| Clinical filter bandwidth operating modes.
-}
type CascadeMode
    = DiagnosticMode
    | MonitoringMode
    | SurgicalMode
    | CustomMode


{-| A multi-stage cascade filter with ordered biquad sections.
-}
type alias CascadeFilter =
    { mode : CascadeMode
    , sampleRate : Float
    , stages : List ( BiquadCoeffs, BiquadState )
    }


{-| Create an arbitrary cascade of biquad sections from coefficients.
-}
createCascade : CascadeMode -> Float -> List BiquadCoeffs -> CascadeFilter
createCascade mode sampleRate coeffsList =
    { mode = mode
    , sampleRate = sampleRate
    , stages = List.map (\c -> ( c, initBiquadState )) coeffsList
    }


{-| Diagnostic ECG filter: 0.05 Hz Highpass, 150 Hz Lowpass, and 60 Hz Notch.
Preserves full ST-segment morphology and high-frequency notch features.
-}
diagnosticEcgFilter : Float -> CascadeFilter
diagnosticEcgFilter sampleRate =
    let
        hpCoeffs =
            Filter.highpass sampleRate 0.05

        -- If sampleRate is 200 Hz, Nyquist is 100 Hz, so clamp lowpass to below Nyquist (e.g. 0.45 * fs)
        actualLp =
            min 150.0 (sampleRate * 0.45)

        lpCoeffs =
            Filter.lowpass sampleRate actualLp

        notchCoeffs =
            Filter.notch sampleRate 60.0 10.0
    in
    createCascade DiagnosticMode sampleRate [ hpCoeffs, lpCoeffs, notchCoeffs ]


{-| Monitoring ECG filter: 0.5 Hz Highpass, 40 Hz Lowpass, and 60 Hz Notch.
Suppresses respiratory baseline wander and skeletal muscle tremor artifact.
-}
monitoringEcgFilter : Float -> CascadeFilter
monitoringEcgFilter sampleRate =
    let
        hpCoeffs =
            Filter.highpass sampleRate 0.5

        lpCoeffs =
            Filter.lowpass sampleRate 40.0

        notchCoeffs =
            Filter.notch sampleRate 60.0 10.0
    in
    createCascade MonitoringMode sampleRate [ hpCoeffs, lpCoeffs, notchCoeffs ]


{-| Surgical ESU filter: 1.0 Hz Highpass, 20 Hz Lowpass, and 60 Hz Notch.
Aggressive filtering for high-frequency electrocautery noise in the operating theater.
-}
surgicalEsuFilter : Float -> CascadeFilter
surgicalEsuFilter sampleRate =
    let
        hpCoeffs =
            Filter.highpass sampleRate 1.0

        lpCoeffs =
            Filter.lowpass sampleRate 20.0

        notchCoeffs =
            Filter.notch sampleRate 60.0 8.0
    in
    createCascade SurgicalMode sampleRate [ hpCoeffs, lpCoeffs, notchCoeffs ]


{-| Reset internal states of all biquad stages in the cascade to zero.
-}
resetCascade : CascadeFilter -> CascadeFilter
resetCascade cascade =
    { cascade
        | stages = List.map (\( coeffs, _ ) -> ( coeffs, initBiquadState )) cascade.stages
    }


{-| Process a single sample through each stage in the cascade sequentially.
-}
stepCascade : Float -> CascadeFilter -> ( Float, CascadeFilter )
stepCascade input cascade =
    let
        stepStage ( coeffs, state ) ( currentSample, updatedStages ) =
            let
                ( nextSample, nextState ) =
                    Filter.applyBiquad coeffs currentSample state
            in
            ( nextSample, ( coeffs, nextState ) :: updatedStages )

        ( finalOutput, reversedStages ) =
            List.foldl stepStage ( input, [] ) cascade.stages
    in
    ( finalOutput, { cascade | stages = List.reverse reversedStages } )


{-| Filter a list of samples in forward sequence.
-}
filterList : List Float -> CascadeFilter -> ( List Float, CascadeFilter )
filterList samples cascade =
    let
        folder sample ( outputs, currentCascade ) =
            let
                ( out, nextCascade ) =
                    stepCascade sample currentCascade
            in
            ( out :: outputs, nextCascade )

        ( reversedOutputs, finalCascade ) =
            List.foldl folder ( [], cascade ) samples
    in
    ( List.reverse reversedOutputs, finalCascade )
