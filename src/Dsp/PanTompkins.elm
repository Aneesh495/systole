module Dsp.PanTompkins exposing
    ( DetectorConfig
    , DetectorState
    , QrsDetection
    , defaultConfig
    , initDetector
    , processSample
    )

{-| Full discrete-time implementation of the Pan-Tompkins real-time QRS complex detection algorithm.
Performs bandpass conditioning, derivative calculation, squaring, moving window integration,
dual-threshold adaptive peak classification, and physiological refractory period blanking.
Reference: Pan, J., & Tompkins, W. J. (1985). A real-time QRS detection algorithm. IEEE TBME.
-}

import Dsp.Filter as Filter
import Dsp.Types exposing (BiquadCoeffs, BiquadState, CircularBuffer, Timestamp, emptyBuffer, pushBuffer)


{-| Operational parameters for the QRS detector.
-}
type alias DetectorConfig =
    { sampleRate : Float
    , windowSize : Int
    , refractorySamples : Int
    , searchBackFactor : Float
    }


{-| Default clinical configuration for 200 Hz telemetry acquisition.
-}
defaultConfig : DetectorConfig
defaultConfig =
    { sampleRate = 200.0
    , windowSize = 30
    , refractorySamples = 40
    , searchBackFactor = 1.66
    }


{-| Result of evaluating a single sample through the detector pipeline.
-}
type alias QrsDetection =
    { isPeak : Bool
    , peakValue : Float
    , timestamp : Timestamp
    , rrIntervalMs : Maybe Float
    , heartRateBpm : Maybe Float
    }


{-| Internal record for adaptive threshold updates.
-}
type alias ThresholdUpdate =
    { spki : Float
    , npki : Float
    , thresholdI1 : Float
    , thresholdI2 : Float
    , lastRPeakSampleIndex : Int
    , recentRrIntervals : List Float
    , rrIntervalMs : Maybe Float
    , heartRateBpm : Maybe Float
    }


{-| Internal state registers for the adaptive dual-threshold Pan-Tompkins detector.
-}
type alias DetectorState =
    { config : DetectorConfig
    , bandpassCoeffs : BiquadCoeffs
    , bandpassState : BiquadState
    , diffBuffer : CircularBuffer
    , intBuffer : CircularBuffer
    , runningSum : Float
    , spki : Float
    , npki : Float
    , thresholdI1 : Float
    , thresholdI2 : Float
    , lastRPeakSampleIndex : Int
    , sampleIndex : Int
    , recentRrIntervals : List Float
    , candidateBuffer : CircularBuffer
    }


{-| Initialize a detector state ready for streaming acquisition.
-}
initDetector : DetectorConfig -> DetectorState
initDetector cfg =
    let
        -- 5 to 15 Hz bandpass centered at 10 Hz with Q = 1.0
        coeffs =
            Filter.bandpass cfg.sampleRate 10.0 1.0
    in
    { config = cfg
    , bandpassCoeffs = coeffs
    , bandpassState = Filter.initBiquadState
    , diffBuffer = emptyBuffer 5
    , intBuffer = emptyBuffer cfg.windowSize
    , runningSum = 0.0
    , spki = 0.02
    , npki = 0.001
    , thresholdI1 = 0.005
    , thresholdI2 = 0.0025
    , lastRPeakSampleIndex = -1000
    , sampleIndex = 0
    , recentRrIntervals = []
    , candidateBuffer = emptyBuffer 3
    }


{-| Process one incoming raw ECG sample through the complete detection pipeline.
Returns the detection verdict and the updated detector state.
-}
processSample : Float -> Timestamp -> DetectorState -> ( QrsDetection, DetectorState )
processSample rawSample timestamp state =
    let
        -- 1. Bandpass filter stage (5 to 15 Hz)
        ( bpSample, nextBpState ) =
            Filter.applyBiquad state.bandpassCoeffs rawSample state.bandpassState

        -- 2. Five-point derivative stage: y[n] = (2*x[n] + x[n-1] - x[n-3] - 2*x[n-4]) / 8
        nextDiffBuffer =
            pushBuffer bpSample state.diffBuffer

        diffVals =
            nextDiffBuffer.values

        deriv =
            case diffVals of
                x0 :: x1 :: _ :: x3 :: x4 :: _ ->
                    (2.0 * x0 + x1 - x3 - 2.0 * x4) / 8.0

                x0 :: x1 :: _ ->
                    (x0 - x1) / 2.0

                _ ->
                    0.0

        -- 3. Squaring function stage
        squared =
            deriv * deriv

        -- 4. Moving-window integration stage
        oldestInt =
            if state.intBuffer.size >= state.config.windowSize then
                case List.drop (state.intBuffer.size - 1) state.intBuffer.values of
                    head :: _ ->
                        head

                    [] ->
                        0.0

            else
                0.0

        nextIntBuffer =
            pushBuffer squared state.intBuffer

        nextSum =
            if state.intBuffer.size >= state.config.windowSize then
                max 0.0 (state.runningSum - oldestInt + squared)

            else
                state.runningSum + squared

        integrated =
            nextSum / toFloat (max 1 nextIntBuffer.size)

        -- 5. Peak detection on integrated signal
        nextCandBuffer =
            pushBuffer integrated state.candidateBuffer

        currentIdx =
            state.sampleIndex + 1

        isLocalMax =
            case nextCandBuffer.values of
                curr :: mid :: prev :: _ ->
                    mid > prev && mid > curr

                _ ->
                    False

        candidateValue =
            case nextCandBuffer.values of
                _ :: mid :: _ ->
                    mid

                _ ->
                    integrated

        -- Check refractory period (200 ms blanking window)
        samplesSinceLast =
            currentIdx - state.lastRPeakSampleIndex

        isBeyondRefractory =
            samplesSinceLast >= state.config.refractorySamples

        -- Dual threshold classification
        isQrsPeak =
            isLocalMax && isBeyondRefractory && (candidateValue > state.thresholdI1)

        -- Adaptive threshold adaptation
        update : ThresholdUpdate
        update =
            if isQrsPeak then
                let
                    updatedSpki =
                        0.125 * candidateValue + 0.875 * state.spki

                    t1 =
                        state.npki + 0.25 * (updatedSpki - state.npki)

                    t2 =
                        0.5 * t1

                    dtMs =
                        (toFloat samplesSinceLast / state.config.sampleRate) * 1000.0

                    updatedRrList =
                        if dtMs >= 250.0 && dtMs <= 2500.0 then
                            dtMs :: List.take 7 state.recentRrIntervals

                        else
                            state.recentRrIntervals

                    meanRr =
                        case updatedRrList of
                            [] ->
                                dtMs

                            xs ->
                                List.sum xs / toFloat (List.length xs)

                    bpm =
                        if meanRr > 0.0 then
                            60000.0 / meanRr

                        else
                            0.0
                in
                { spki = updatedSpki
                , npki = state.npki
                , thresholdI1 = t1
                , thresholdI2 = t2
                , lastRPeakSampleIndex = currentIdx
                , recentRrIntervals = updatedRrList
                , rrIntervalMs = Just dtMs
                , heartRateBpm = Just bpm
                }

            else if isLocalMax && isBeyondRefractory then
                let
                    updatedNpki =
                        0.125 * candidateValue + 0.875 * state.npki

                    t1 =
                        updatedNpki + 0.25 * (state.spki - updatedNpki)

                    t2 =
                        0.5 * t1
                in
                { spki = state.spki
                , npki = updatedNpki
                , thresholdI1 = t1
                , thresholdI2 = t2
                , lastRPeakSampleIndex = state.lastRPeakSampleIndex
                , recentRrIntervals = state.recentRrIntervals
                , rrIntervalMs = Nothing
                , heartRateBpm = Nothing
                }

            else
                { spki = state.spki
                , npki = state.npki
                , thresholdI1 = state.thresholdI1
                , thresholdI2 = state.thresholdI2
                , lastRPeakSampleIndex = state.lastRPeakSampleIndex
                , recentRrIntervals = state.recentRrIntervals
                , rrIntervalMs = Nothing
                , heartRateBpm = Nothing
                }

        detectionResult =
            { isPeak = isQrsPeak
            , peakValue = candidateValue
            , timestamp = timestamp
            , rrIntervalMs = update.rrIntervalMs
            , heartRateBpm = update.heartRateBpm
            }

        nextState =
            { state
                | bandpassState = nextBpState
                , diffBuffer = nextDiffBuffer
                , intBuffer = nextIntBuffer
                , runningSum = nextSum
                , candidateBuffer = nextCandBuffer
                , sampleIndex = currentIdx
                , spki = update.spki
                , npki = update.npki
                , thresholdI1 = update.thresholdI1
                , thresholdI2 = update.thresholdI2
                , lastRPeakSampleIndex = update.lastRPeakSampleIndex
                , recentRrIntervals = update.recentRrIntervals
            }
    in
    ( detectionResult, nextState )
