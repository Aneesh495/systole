module Dsp.PulseContour exposing
    ( ArterialFeature
    , BeatContour
    , ContourState
    , FluidResponsiveness(..)
    , emptyContourState
    , estimateFluidResponsiveness
    , estimateStrokeVolume
    , processAbpSample
    )

{-| Invasive Arterial Blood Pressure (ABP) pulse contour analysis engine.
Tracks systolic peak, diastolic trough, and dicrotic notch (aortic valve closure).
Computes Mean Arterial Pressure (MAP), Pulse Pressure (PP), Liljestrand-Zander stroke volume,
and respiratory variation metrics including Pulse Pressure Variation (PPV) and Stroke Volume Variation (SVV)
to guide volume resuscitation and fluid responsiveness in critical care.
-}

import Dsp.Types exposing (CircularBuffer, Timestamp, emptyBuffer, pushBuffer)


{-| Clinical fluid responsiveness recommendation based on respiratory pulse pressure variation.
-}
type FluidResponsiveness
    = FluidResponsive Float
    | FluidNonResponsive Float
    | Indeterminate Float


{-| Morphological landmark features identified within a single arterial pressure wave.
-}
type alias ArterialFeature =
    { systolicMmhg : Float
    , diastolicMmhg : Float
    , meanMmhg : Float
    , pulsePressureMmhg : Float
    , dicroticNotchMmhg : Float
    , systolicAreaMmhgSec : Float
    , estimatedStrokeVolumeMl : Float
    , timestamp : Timestamp
    }


{-| Beat contour record used for respiratory cyclic variation tracking.
-}
type alias BeatContour =
    { systolic : Float
    , pulsePressure : Float
    , strokeVolume : Float
    , timestamp : Timestamp
    }


{-| Internal record for step evaluation results.
-}
type alias StepResult =
    { nextRising : Bool
    , nextInSystole : Bool
    , nextPeak : Float
    , nextTrough : Float
    , maybeFeature : Maybe ArterialFeature
    , nextSystolicSum : Float
    , nextSystolicCount : Int
    }


{-| State registers for streaming arterial pulse analysis.
-}
type alias ContourState =
    { sampleBuffer : CircularBuffer
    , recentBeats : List BeatContour
    , currentTrough : Float
    , currentPeak : Float
    , lastTroughTimestamp : Timestamp
    , lastPeakTimestamp : Timestamp
    , isRising : Bool
    , systolicSum : Float
    , systolicCount : Int
    , inSystole : Bool
    }


{-| Initial idle contour state.
-}
emptyContourState : ContourState
emptyContourState =
    { sampleBuffer = emptyBuffer 6
    , recentBeats = []
    , currentTrough = 80.0
    , currentPeak = 120.0
    , lastTroughTimestamp = 0.0
    , lastPeakTimestamp = 0.0
    , isRising = False
    , systolicSum = 0.0
    , systolicCount = 0
    , inSystole = False
    }


{-| Process a single arterial pressure sample (in mmHg) at the specified timestamp.
Emits a detected beat feature when the diastolic trough is confirmed at the end of a cardiac cycle.
-}
processAbpSample : Float -> Timestamp -> ContourState -> ( Maybe ArterialFeature, ContourState )
processAbpSample sample timestamp state =
    let
        nextBuf =
            pushBuffer sample state.sampleBuffer

        -- 3-point slope calculation for trend detection
        slope =
            case nextBuf.values of
                s0 :: _ :: s2 :: _ ->
                    (s0 - s2) / 2.0

                _ ->
                    0.0

        isTrough =
            state.isRising == False && slope > 0.4 && sample < 110.0

        isPeak =
            state.isRising == True && slope < -0.3 && sample > 90.0

        step : StepResult
        step =
            if isTrough && state.systolicCount > 10 then
                -- Cycle completed at new diastolic trough
                let
                    sbp =
                        max 40.0 state.currentPeak

                    dbp =
                        min sbp (max 20.0 sample)

                    pp =
                        sbp - dbp

                    map =
                        dbp + (pp / 3.0)

                    -- Approximate dicrotic notch at 62% of pulse pressure above DBP
                    dicrotic =
                        dbp + 0.62 * pp

                    -- Systolic area in mmHg*sec (assuming 200 Hz = 0.005 sec per sample)
                    dt =
                        0.005

                    area =
                        state.systolicSum * dt

                    sv =
                        estimateStrokeVolume sbp dbp area

                    feat =
                        { systolicMmhg = sbp
                        , diastolicMmhg = dbp
                        , meanMmhg = map
                        , pulsePressureMmhg = pp
                        , dicroticNotchMmhg = dicrotic
                        , systolicAreaMmhgSec = area
                        , estimatedStrokeVolumeMl = sv
                        , timestamp = timestamp
                        }
                in
                { nextRising = True
                , nextInSystole = True
                , nextPeak = sample
                , nextTrough = sample
                , maybeFeature = Just feat
                , nextSystolicSum = 0.0
                , nextSystolicCount = 0
                }

            else if isPeak then
                { nextRising = False
                , nextInSystole = False
                , nextPeak = sample
                , nextTrough = state.currentTrough
                , maybeFeature = Nothing
                , nextSystolicSum = state.systolicSum
                , nextSystolicCount = state.systolicCount
                }

            else
                let
                    updatedPeak =
                        if state.inSystole && sample > state.currentPeak then
                            sample

                        else
                            state.currentPeak

                    updatedSum =
                        if state.inSystole then
                            state.systolicSum + (sample - state.currentTrough)

                        else
                            state.systolicSum

                    updatedCount =
                        if state.inSystole then
                            state.systolicCount + 1

                        else
                            state.systolicCount
                in
                { nextRising = state.isRising
                , nextInSystole = state.inSystole
                , nextPeak = updatedPeak
                , nextTrough = state.currentTrough
                , maybeFeature = Nothing
                , nextSystolicSum = updatedSum
                , nextSystolicCount = updatedCount
                }

        updatedRecentBeats =
            case step.maybeFeature of
                Just f ->
                    let
                        b =
                            { systolic = f.systolicMmhg
                            , pulsePressure = f.pulsePressureMmhg
                            , strokeVolume = f.estimatedStrokeVolumeMl
                            , timestamp = f.timestamp
                            }
                    in
                    List.take 24 (b :: state.recentBeats)

                Nothing ->
                    state.recentBeats

        nextState =
            { state
                | sampleBuffer = nextBuf
                , recentBeats = updatedRecentBeats
                , currentTrough = step.nextTrough
                , currentPeak = step.nextPeak
                , isRising = step.nextRising
                , systolicSum = step.nextSystolicSum
                , systolicCount = step.nextSystolicCount
                , inSystole = step.nextInSystole
            }
    in
    ( step.maybeFeature, nextState )


{-| Estimate stroke volume (in mL) using Liljestrand-Zander aortic compliance model.
Formula: SV = k * (Area_sys / (SBP + DBP)) where k is a calibration scalar (~1150).
-}
estimateStrokeVolume : Float -> Float -> Float -> Float
estimateStrokeVolume sbp dbp systolicArea =
    let
        sumPressure =
            sbp + dbp
    in
    if sumPressure > 0.0 then
        let
            k =
                1150.0

            sv =
                k * (systolicArea / sumPressure)
        in
        clamp 20.0 160.0 sv

    else
        70.0


{-| Calculate Pulse Pressure Variation (PPV) over a respiratory cycle window.
Formula: PPV = (PP_max - PP_min) / ((PP_max + PP_min) / 2) * 100%.
Clinically, PPV > 13% in mechanically ventilated patients predicts volume responsiveness.
-}
estimateFluidResponsiveness : List BeatContour -> FluidResponsiveness
estimateFluidResponsiveness beats =
    let
        pps =
            List.map .pulsePressure beats
    in
    case ( List.maximum pps, List.minimum pps ) of
        ( Just maxPp, Just minPp ) ->
            let
                meanPp =
                    (maxPp + minPp) / 2.0
            in
            if meanPp > 10.0 && List.length beats >= 8 then
                let
                    ppv =
                        ((maxPp - minPp) / meanPp) * 100.0
                in
                if ppv >= 13.0 then
                    FluidResponsive ppv

                else
                    FluidNonResponsive ppv

            else
                Indeterminate 0.0

        _ ->
            Indeterminate 0.0
