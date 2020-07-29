module Dsp.Plethysmograph exposing
    ( CalibrationCoeffs
    , PlethState
    , PpgFeature
    , defaultCalibration
    , emptyPlethState
    , estimateSpo2
    , processPpgSample
    )

{-| Photoplethysmography (PPG) and dual-wavelength pulse oximetry signal processing.
Extracts pulsatile AC and static DC optical extinction across 660 nm (red) and 940 nm (infrared)
transillumination channels. Computes the modulation ratio of ratios (R), empirical SpO2 percentage,
Perfusion Index (PI), and Pleth Variability Index (PVI) for non-invasive hemodynamic monitoring.
-}

import Dsp.Types exposing (CircularBuffer, Timestamp, emptyBuffer, pushBuffer)


{-| Empirical quadratic calibration coefficients mapping ratio of ratios R to SpO2 percentage.
Standard form: SpO2 = a*R^2 + b*R + c.
-}
type alias CalibrationCoeffs =
    { a : Float
    , b : Float
    , c : Float
    }


{-| Clinical standard empiric calibration for commercial oximeter sensors.
Matches calibration curves validated on human desaturation protocols down to 70% SpO2.
-}
defaultCalibration : CalibrationCoeffs
defaultCalibration =
    { a = -1.6
    , b = -23.5
    , c = 109.8
    }


{-| Extracted optical features and vital sign metrics for a completed PPG cardiac cycle.
-}
type alias PpgFeature =
    { spo2Percent : Float
    , perfusionIndexPercent : Float
    , ratioOfRatios : Float
    , pulseRateBpm : Float
    , plethVariabilityIndexPercent : Float
    , timestamp : Timestamp
    }


{-| Internal record for plethysmograph cycle detection step.
-}
type alias PlethStep =
    { nextMinIr : Float
    , nextMaxIr : Float
    , nextMinRed : Float
    , nextMaxRed : Float
    , maybeFeature : Maybe PpgFeature
    , nextSampleCount : Int
    }


{-| State registers for dual-channel PPG tracking.
-}
type alias PlethState =
    { irBuffer : CircularBuffer
    , redBuffer : CircularBuffer
    , calibration : CalibrationCoeffs
    , minIr : Float
    , maxIr : Float
    , minRed : Float
    , maxRed : Float
    , sampleCount : Int
    , recentPi : List Float
    , lastTroughTimestamp : Timestamp
    }


{-| Initial idle pleth state.
-}
emptyPlethState : PlethState
emptyPlethState =
    { irBuffer = emptyBuffer 6
    , redBuffer = emptyBuffer 6
    , calibration = defaultCalibration
    , minIr = 1000.0
    , maxIr = 0.0
    , minRed = 1000.0
    , maxRed = 0.0
    , sampleCount = 0
    , recentPi = []
    , lastTroughTimestamp = 0.0
    }


{-| Compute functional oxygen saturation percentage (SpO2) from optical ratio of ratios R.
Clamped to physiological boundary [50.0%, 100.0%].
-}
estimateSpo2 : Float -> CalibrationCoeffs -> Float
estimateSpo2 r coeffs =
    let
        raw =
            coeffs.a * r * r + coeffs.b * r + coeffs.c
    in
    clamp 50.0 100.0 raw


{-| Process synchronized dual-wavelength optical samples (Red 660 nm and IR 940 nm photodiode readings).
Assumes normalized analog intensity values (typically 0.1 to 5.0 Volts).
-}
processPpgSample : Float -> Float -> Timestamp -> PlethState -> ( Maybe PpgFeature, PlethState )
processPpgSample redSample irSample timestamp state =
    let
        nextIrBuf =
            pushBuffer irSample state.irBuffer

        nextRedBuf =
            pushBuffer redSample state.redBuffer

        -- Slope of IR signal to detect systolic upstroke and diastolic trough
        irSlope =
            case nextIrBuf.values of
                s0 :: _ :: s2 :: _ ->
                    (s0 - s2) / 2.0

                _ ->
                    0.0

        isTrough =
            irSlope > 0.02 && state.sampleCount > 25

        step : PlethStep
        step =
            if isTrough then
                let
                    acIr =
                        max 0.001 (state.maxIr - state.minIr)

                    dcIr =
                        max 0.01 state.minIr

                    acRed =
                        max 0.001 (state.maxRed - state.minRed)

                    dcRed =
                        max 0.01 state.minRed

                    r =
                        (acRed / dcRed) / (acIr / dcIr)

                    spo2 =
                        estimateSpo2 r state.calibration

                    pi =
                        (acIr / dcIr) * 100.0

                    dtMs =
                        max 300.0 (timestamp - state.lastTroughTimestamp)

                    pr =
                        60000.0 / dtMs

                    -- PVI calculation over rolling window of perfusion indices
                    updatedPiList =
                        List.take 16 (pi :: state.recentPi)

                    pvi =
                        case ( List.maximum updatedPiList, List.minimum updatedPiList ) of
                            ( Just maxP, Just minP ) ->
                                if maxP > 0.0 then
                                    ((maxP - minP) / maxP) * 100.0

                                else
                                    0.0

                            _ ->
                                0.0

                    feature =
                        { spo2Percent = spo2
                        , perfusionIndexPercent = pi
                        , ratioOfRatios = r
                        , pulseRateBpm = pr
                        , plethVariabilityIndexPercent = pvi
                        , timestamp = timestamp
                        }
                in
                { nextMinIr = irSample
                , nextMaxIr = irSample
                , nextMinRed = redSample
                , nextMaxRed = redSample
                , maybeFeature = Just feature
                , nextSampleCount = 0
                }

            else
                { nextMinIr = min state.minIr irSample
                , nextMaxIr = max state.maxIr irSample
                , nextMinRed = min state.minRed redSample
                , nextMaxRed = max state.maxRed redSample
                , maybeFeature = Nothing
                , nextSampleCount = state.sampleCount + 1
                }

        nextRecentPi =
            case step.maybeFeature of
                Just f ->
                    List.take 16 (f.perfusionIndexPercent :: state.recentPi)

                Nothing ->
                    state.recentPi

        nextTroughTs =
            case step.maybeFeature of
                Just _ ->
                    timestamp

                Nothing ->
                    state.lastTroughTimestamp

        nextState =
            { state
                | irBuffer = nextIrBuf
                , redBuffer = nextRedBuf
                , minIr = step.nextMinIr
                , maxIr = step.nextMaxIr
                , minRed = step.nextMinRed
                , maxRed = step.nextMaxRed
                , sampleCount = step.nextSampleCount
                , recentPi = nextRecentPi
                , lastTroughTimestamp = nextTroughTs
            }
    in
    ( step.maybeFeature, nextState )
