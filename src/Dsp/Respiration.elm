module Dsp.Respiration exposing
    ( ApneaStatus(..)
    , BreathPhase(..)
    , RespirationMetrics
    , RespirationState
    , initRespirationState
    , stepRespiration
    , computeRsbi
    )

{-| Transthoracic impedance pneumography (IP) digital signal processing.
Extracts respiratory rate, detects apnea events, tracks baseline impedance,
and computes clinical metrics such as the Rapid Shallow Breathing Index (RSBI).
-}

import Dsp.Filter as Filter
import Dsp.Types exposing (BiquadCoeffs, BiquadState)


{-| Phase of the respiratory cycle.
-}
type BreathPhase
    = Inspiration
    | Expiration
    | PausePhase


{-| Apnea classification status.
-}
type ApneaStatus
    = BreathingNormal
    | ApneaWarning Float -- duration in seconds without a breath
    | ApneaCrisis Float


{-| Comprehensive respiration metrics record.
-}
type alias RespirationMetrics =
    { respiratoryRateBpm : Float
    , tidalVolumeEstimateMl : Float
    , currentPhase : BreathPhase
    , apneaStatus : ApneaStatus
    , baselineImpedanceOhms : Float
    }


{-| Internal state for the impedance pneumography processor.
-}
type alias RespirationState =
    { sampleRate : Float
    , bandpassCoeffs : BiquadCoeffs
    , bandpassState : BiquadState
    , baselineZ0 : Float
    , lastSample : Float
    , currentPhase : BreathPhase
    , breathIntervalsSec : List Float
    , timeSinceLastBreathSec : Float
    , breathCount : Int
    , estimatedTidalVolume : Float
    }


{-| Initialize the respiration state machine.
Impedance pneumography respiratory frequencies typically fall between 0.1 Hz and 1.5 Hz
(corresponding to 6 to 90 breaths per minute).
-}
initRespirationState : Float -> RespirationState
initRespirationState sampleRate =
    let
        -- 0.3 Hz center frequency with Q = 0.8 for breath waveform extraction
        bpCoeffs =
            Filter.bandpass sampleRate 0.3 0.8
    in
    { sampleRate = sampleRate
    , bandpassCoeffs = bpCoeffs
    , bandpassState = Filter.initBiquadState
    , baselineZ0 = 500.0 -- typical resting thoracic impedance ~ 500 Ohms
    , lastSample = 0.0
    , currentPhase = PausePhase
    , breathIntervalsSec = [ 4.0, 4.0, 4.0 ] -- default 15 bpm (60 / 4)
    , timeSinceLastBreathSec = 0.0
    , breathCount = 0
    , estimatedTidalVolume = 500.0 -- typical resting tidal volume 500 mL
    }


{-| Process a single impedance sample through the pneumography engine.
-}
stepRespiration : Float -> RespirationState -> ( RespirationMetrics, RespirationState )
stepRespiration rawImpedance state =
    let
        dt =
            1.0 / state.sampleRate

        -- Update slowly adapting thoracic baseline Z0 (alpha = 0.0005)
        newZ0 =
            state.baselineZ0 + 0.0005 * (rawImpedance - state.baselineZ0)

        acImpedance =
            rawImpedance - newZ0

        ( filteredSample, newBpState ) =
            Filter.applyBiquad state.bandpassCoeffs acImpedance state.bandpassState

        newTimeSinceLastBreath =
            state.timeSinceLastBreathSec + dt

        -- Detect positive-going zero crossing (onset of inspiration)
        isPositiveZeroCrossing =
            (state.lastSample <= 0.0) && (filteredSample > 0.0) && (newTimeSinceLastBreath > 1.2)

        transition =
            if isPositiveZeroCrossing then
                let
                    trimmedIntervals =
                        List.take 5 (newTimeSinceLastBreath :: state.breathIntervalsSec)
                in
                { nextPhase = Inspiration
                , updatedIntervals = trimmedIntervals
                , resetTime = 0.0
                , nextCount = state.breathCount + 1
                }

            else if filteredSample < -0.05 then
                { nextPhase = Expiration
                , updatedIntervals = state.breathIntervalsSec
                , resetTime = newTimeSinceLastBreath
                , nextCount = state.breathCount
                }

            else
                { nextPhase = state.currentPhase
                , updatedIntervals = state.breathIntervalsSec
                , resetTime = newTimeSinceLastBreath
                , nextCount = state.breathCount
                }

        -- Estimate respiratory rate from mean breath interval
        meanInterval =
            case transition.updatedIntervals of
                [] ->
                    4.0

                _ ->
                    List.sum transition.updatedIntervals / toFloat (List.length transition.updatedIntervals)

        respiratoryRate =
            if meanInterval > 0.1 then
                clamp 0.0 120.0 (60.0 / meanInterval)

            else
                0.0

        -- Apnea classification based on elapsed time without an inspiratory transition
        apnea =
            if transition.resetTime >= 20.0 then
                ApneaCrisis transition.resetTime

            else if transition.resetTime >= 12.0 then
                ApneaWarning transition.resetTime

            else
                BreathingNormal

        nextState =
            { state
                | bandpassState = newBpState
                , baselineZ0 = newZ0
                , lastSample = filteredSample
                , currentPhase = transition.nextPhase
                , breathIntervalsSec = transition.updatedIntervals
                , timeSinceLastBreathSec = transition.resetTime
                , breathCount = transition.nextCount
            }

        metrics =
            { respiratoryRateBpm = respiratoryRate
            , tidalVolumeEstimateMl = state.estimatedTidalVolume
            , currentPhase = transition.nextPhase
            , apneaStatus = apnea
            , baselineImpedanceOhms = newZ0
            }
    in
    ( metrics, nextState )


{-| Rapid Shallow Breathing Index (RSBI = f / Vt).
f = respiratory rate in breaths per minute.
Vt = tidal volume in Liters.
RSBI > 105 breaths/min/L indicates weaning failure and respiratory distress.
-}
computeRsbi : Float -> Float -> Float
computeRsbi rateBpm tidalVolumeMl =
    let
        volumeLiters =
            tidalVolumeMl / 1000.0
    in
    if volumeLiters > 0.05 then
        rateBpm / volumeLiters

    else
        0.0
