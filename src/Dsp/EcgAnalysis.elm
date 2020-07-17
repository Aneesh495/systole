module Dsp.EcgAnalysis exposing
    ( AxisDeviation(..)
    , EcgMetrics
    , HrvMetrics
    , StDeviation
    , calculateAxis
    , calculateHrv
    , calculateQtcBazett
    , calculateQtcFridericia
    , calculateStDeviation
    , emptyHrvMetrics
    , emptyMetrics
    , isStemiAlert
    , updateEcgMetrics
    )

{-| Advanced clinical electrocardiogram (ECG) morphological analysis engine.
Computes multi-lead ST-segment elevation/depression, corrected QT intervals (Bazett and Fridericia),
frontal plane electrical cardiac axis, and statistical heart rate variability (HRV) metrics
including SDNN, RMSSD, and pNN50.
-}

import Dsp.Types exposing (Lead(..))


{-| Time-domain statistical Heart Rate Variability (HRV) metrics.
-}
type alias HrvMetrics =
    { sdnnMs : Float
    , rmssdMs : Float
    , pnn50Percent : Float
    , meanRrMs : Float
    , sampleCount : Int
    }


{-| Default empty HRV metrics state.
-}
emptyHrvMetrics : HrvMetrics
emptyHrvMetrics =
    { sdnnMs = 0.0
    , rmssdMs = 0.0
    , pnn50Percent = 0.0
    , meanRrMs = 0.0
    , sampleCount = 0
    }


{-| ST-segment deviation measurement for a specific lead.
-}
type alias StDeviation =
    { lead : Lead
    , isoelectricBaselineMv : Float
    , jPointMv : Float
    , st60Mv : Float
    , elevationMv : Float
    }


{-| Frontal plane mean QRS electrical axis quadrant classification.
-}
type AxisDeviation
    = NormalAxis Float
    | LeftAxisDeviation Float
    | RightAxisDeviation Float
    | ExtremeAxisDeviation Float


{-| Comprehensive diagnostic metrics for a cardiac monitoring channel.
-}
type alias EcgMetrics =
    { heartRateBpm : Float
    , rrIntervalMs : Float
    , prIntervalMs : Float
    , qrsDurationMs : Float
    , qtIntervalMs : Float
    , qtcFridericiaMs : Float
    , qtcBazettMs : Float
    , hrv : HrvMetrics
    , stDeviations : List StDeviation
    , electricalAxis : AxisDeviation
    }


{-| Initial neutral ECG diagnostic metrics.
-}
emptyMetrics : EcgMetrics
emptyMetrics =
    { heartRateBpm = 75.0
    , rrIntervalMs = 800.0
    , prIntervalMs = 160.0
    , qrsDurationMs = 88.0
    , qtIntervalMs = 380.0
    , qtcFridericiaMs = 409.0
    , qtcBazettMs = 425.0
    , hrv = emptyHrvMetrics
    , stDeviations = []
    , electricalAxis = NormalAxis 45.0
    }


{-| Calculate Heart Rate Variability metrics from a historical window of R-R intervals (in ms).
-}
calculateHrv : List Float -> HrvMetrics
calculateHrv rrIntervals =
    let
        count =
            List.length rrIntervals
    in
    if count < 2 then
        emptyHrvMetrics

    else
        let
            n =
                toFloat count

            meanRr =
                List.sum rrIntervals / n

            -- SDNN: standard deviation of normal-to-normal intervals
            variance =
                rrIntervals
                    |> List.map (\rr -> (rr - meanRr) * (rr - meanRr))
                    |> List.sum
                    |> (\s -> s / (n - 1.0))

            sdnn =
                sqrt (max 0.0 variance)

            -- Successive differences: (RR[i+1] - RR[i])
            successiveDiffs =
                List.map2 (\curr next -> abs (next - curr))
                    rrIntervals
                    (List.drop 1 rrIntervals)

            diffCount =
                toFloat (List.length successiveDiffs)

            -- RMSSD: root mean square of successive differences
            rmssd =
                if diffCount > 0.0 then
                    successiveDiffs
                        |> List.map (\d -> d * d)
                        |> List.sum
                        |> (\s -> sqrt (s / diffCount))

                else
                    0.0

            -- pNN50: percentage of differences exceeding 50 ms
            nn50Count =
                successiveDiffs
                    |> List.filter (\d -> d > 50.0)
                    |> List.length
                    |> toFloat

            pnn50 =
                if diffCount > 0.0 then
                    (nn50Count / diffCount) * 100.0

                else
                    0.0
        in
        { sdnnMs = sdnn
        , rmssdMs = rmssd
        , pnn50Percent = pnn50
        , meanRrMs = meanRr
        , sampleCount = count
        }


{-| Calculate Fridericia-corrected QT interval (QTc = QT / cbrt(RR_seconds)).
Clinically preferred over Bazett for physiological stability at high and low heart rates.
-}
calculateQtcFridericia : Float -> Float -> Float
calculateQtcFridericia qtMs rrMs =
    let
        rrSec =
            max 0.2 (rrMs / 1000.0)

        cbrtRr =
            rrSec ^ (1.0 / 3.0)
    in
    if cbrtRr > 0.0 then
        qtMs / cbrtRr

    else
        qtMs


{-| Calculate Bazett-corrected QT interval (QTc = QT / sqrt(RR_seconds)).
Standard historical clinical formula.
-}
calculateQtcBazett : Float -> Float -> Float
calculateQtcBazett qtMs rrMs =
    let
        rrSec =
            max 0.2 (rrMs / 1000.0)

        sqrtRr =
            sqrt rrSec
    in
    if sqrtRr > 0.0 then
        qtMs / sqrtRr

    else
        qtMs


{-| Calculate ST-segment deviation at J-point + 60 ms relative to isoelectric PR baseline.
-}
calculateStDeviation : Lead -> Float -> Float -> Float -> StDeviation
calculateStDeviation lead baselineMv jPointMv st60Mv =
    { lead = lead
    , isoelectricBaselineMv = baselineMv
    , jPointMv = jPointMv
    , st60Mv = st60Mv
    , elevationMv = st60Mv - baselineMv
    }


{-| Evaluate whether a set of ST deviations meets criteria for ST-Elevation Myocardial Infarction (STEMI).
Criteria: Elevation >= 0.1 mV in limb leads (I, II, III, aVF, aVL) or >= 0.2 mV in chest leads (V1-V6).
-}
isStemiAlert : List StDeviation -> Bool
isStemiAlert deviations =
    let
        checkLead dev =
            case dev.lead of
                LeadV1 ->
                    dev.elevationMv >= 0.2

                LeadV2 ->
                    dev.elevationMv >= 0.2

                LeadV3 ->
                    dev.elevationMv >= 0.2

                LeadV4 ->
                    dev.elevationMv >= 0.2

                LeadV5 ->
                    dev.elevationMv >= 0.2

                LeadV6 ->
                    dev.elevationMv >= 0.2

                _ ->
                    dev.elevationMv >= 0.1
    in
    List.any checkLead deviations


{-| Calculate frontal plane mean electrical axis from net QRS voltages in Lead I and Lead aVF.
Net voltage = R_peak - S_trough.
-}
calculateAxis : Float -> Float -> AxisDeviation
calculateAxis netLeadI netLeadAvf =
    let
        -- Vector angle in radians: atan2(y, x) where y = Lead aVF (+90 deg down), x = Lead I (0 deg left)
        angleRad =
            atan2 netLeadAvf netLeadI

        angleDeg =
            angleRad * (180.0 / pi)
    in
    if angleDeg >= -30.0 && angleDeg <= 90.0 then
        NormalAxis angleDeg

    else if angleDeg < -30.0 && angleDeg >= -90.0 then
        LeftAxisDeviation angleDeg

    else if angleDeg > 90.0 && angleDeg <= 180.0 then
        RightAxisDeviation angleDeg

    else
        ExtremeAxisDeviation angleDeg


{-| Update aggregate diagnostic metrics with new R-R interval measurement.
-}
updateEcgMetrics : Float -> List Float -> EcgMetrics -> EcgMetrics
updateEcgMetrics newRrMs recentRrList metrics =
    let
        hr =
            if newRrMs > 0.0 then
                60000.0 / newRrMs

            else
                metrics.heartRateBpm

        updatedHrv =
            calculateHrv (newRrMs :: recentRrList)

        qtcFrid =
            calculateQtcFridericia metrics.qtIntervalMs newRrMs

        qtcBaz =
            calculateQtcBazett metrics.qtIntervalMs newRrMs
    in
    { metrics
        | heartRateBpm = hr
        , rrIntervalMs = newRrMs
        , hrv = updatedHrv
        , qtcFridericiaMs = qtcFrid
        , qtcBazettMs = qtcBaz
    }
