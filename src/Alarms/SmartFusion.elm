module Alarms.SmartFusion exposing
    ( FusionInput
    , FusionResult
    , SensorSqi
    , defaultSqi
    , fuseAlarms
    , evaluateFalseAlarmProbability
    )

{-| Multi-sensor Bayesian confidence fusion engine.
Cross-correlates multi-channel physiological telemetry streams to verify
alarm validity, compute composite Signal Quality Indices (SQI), and
suppress artifactual false alarms in life-critical environments.
-}

import Alarms.Types exposing (AlarmCondition(..), AlarmPriority(..))


{-| Signal Quality Index (SQI) for each sensor channel (0.0 = total noise, 1.0 = pristine).
-}
type alias SensorSqi =
    { ecgSqi : Float
    , abpSqi : Float
    , ppgSqi : Float
    , co2Sqi : Float
    }


{-| Default high-fidelity sensor quality metrics.
-}
defaultSqi : SensorSqi
defaultSqi =
    { ecgSqi = 0.95
    , abpSqi = 0.95
    , ppgSqi = 0.95
    , co2Sqi = 0.95
    }


{-| Input parameters for multi-sensor cross-correlation.
-}
type alias FusionInput =
    { ecgHeartRate : Float
    , abpPulseRate : Float
    , ppgPulseRate : Float
    , abpPulsePressure : Float
    , ppgPerfusionIndex : Float
    , etco2Value : Float
    , sqi : SensorSqi
    , candidateAlarm : Maybe ( AlarmPriority, AlarmCondition )
    }


{-| Result of multi-sensor Bayesian arbitration.
-}
type alias FusionResult =
    { confirmedAlarm : Maybe ( AlarmPriority, AlarmCondition )
    , confidenceScore : Float
    , falseAlarmSuppressed : Bool
    , suppressionReason : Maybe String
    }


{-| Estimate false alarm probability using cross-channel physiological concordance.
-}
evaluateFalseAlarmProbability : FusionInput -> Float
evaluateFalseAlarmProbability input =
    case input.candidateAlarm of
        Nothing ->
            0.0

        Just ( _, AsystoleCrisis ) ->
            -- If ECG reports Asystole but arterial or plethysmographic pulse is strong
            if input.abpPulsePressure > 25.0 && input.sqi.abpSqi > 0.6 then
                0.99

            else if input.ppgPerfusionIndex > 0.5 && input.sqi.ppgSqi > 0.6 then
                0.95

            else
                0.05

        Just ( _, VentricularTachycardiaCrisis ) ->
            -- If ECG reports V-Tach (>140 bpm) but ABP pulse rate is normal (<100 bpm) and ECG SQI is poor
            let
                rateMismatch =
                    abs (input.ecgHeartRate - input.abpPulseRate)
            in
            if rateMismatch > 30.0 && input.sqi.ecgSqi < 0.4 && input.sqi.abpSqi > 0.7 then
                0.92

            else
                0.1

        Just ( _, CriticalDesaturation _ ) ->
            -- If SpO2 drops but perfusion index is near zero, it may be optical sensor displacement
            if input.ppgPerfusionIndex < 0.1 && input.sqi.ppgSqi < 0.3 then
                0.85

            else
                0.1

        _ ->
            0.05


{-| Multi-sensor Bayesian arbitration rule engine.
-}
fuseAlarms : FusionInput -> FusionResult
fuseAlarms input =
    let
        pFalse =
            evaluateFalseAlarmProbability input
    in
    case input.candidateAlarm of
        Nothing ->
            { confirmedAlarm = Nothing
            , confidenceScore = 1.0
            , falseAlarmSuppressed = False
            , suppressionReason = Nothing
            }

        Just ( priority, condition ) ->
            if pFalse >= 0.8 then
                -- Suppress physiological crisis to technical sensor lead advisory
                case condition of
                    AsystoleCrisis ->
                        { confirmedAlarm = Just ( TechnicalFailure, EcgLeadOff )
                        , confidenceScore = 0.98
                        , falseAlarmSuppressed = True
                        , suppressionReason = Just "ECG flatline suppressed: active pulsatile arterial pressure confirmed"
                        }

                    VentricularTachycardiaCrisis ->
                        { confirmedAlarm = Just ( AdvisoryLowPriority, EcgLeadOff )
                        , confidenceScore = 0.92
                        , falseAlarmSuppressed = True
                        , suppressionReason = Just "ECG V-Tach suppressed: stable hemodynamics and motion artifact detected"
                        }

                    CriticalDesaturation _ ->
                        { confirmedAlarm = Just ( TechnicalFailure, PpgProbeOffFinger )
                        , confidenceScore = 0.88
                        , falseAlarmSuppressed = True
                        , suppressionReason = Just "Hypoxemia suppressed: plethysmograph optical decoupling detected"
                        }

                    _ ->
                        { confirmedAlarm = Nothing
                        , confidenceScore = 0.85
                        , falseAlarmSuppressed = True
                        , suppressionReason = Just "Low multi-sensor cross-channel concordance"
                        }

            else
                { confirmedAlarm = Just ( priority, condition )
                , confidenceScore = 1.0 - pFalse
                , falseAlarmSuppressed = False
                , suppressionReason = Nothing
                }
