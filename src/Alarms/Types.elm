module Alarms.Types exposing
    ( ActiveAlarm
    , AlarmCondition(..)
    , AlarmModality(..)
    , AlarmPriority(..)
    , alarmColor
    , priorityToString
    )

{-| IEC 60601-1-8 medical alarm system data types and priority classifications.
Defines priority levels, source sensor modalities, and audible/visual indicator schemes.
-}

import Dsp.Types exposing (Timestamp)


{-| IEC 60601-1-8 standard alarm priority hierarchy.
-}
type AlarmPriority
    = CrisisHighPriority
    | WarningMediumPriority
    | AdvisoryLowPriority
    | TechnicalFailure


{-| Clinical sensor modality or subsystem generating the alarm.
-}
type AlarmModality
    = EcgModality
    | AbpModality
    | PpgModality
    | CapnoModality
    | InfusionModality
    | SystemModality


{-| Specific physiological threshold or dysrhythmia trigger condition.
-}
type AlarmCondition
    = AsystoleCrisis
    | VentricularFibrillationCrisis
    | VentricularTachycardiaCrisis
    | ExtremeBradycardia Float
    | ExtremeTachycardia Float
    | SevereHypotension Float
    | SevereHypertension Float
    | CriticalDesaturation Float
    | ApneaDetected Float
    | StemiElevationAlert Float
    | EcgLeadOff
    | AbpTransducerDisconnected
    | PpgProbeOffFinger
    | CapnoLineOccluded


{-| Active alarm instance tracked by the bedside monitor.
-}
type alias ActiveAlarm =
    { id : String
    , condition : AlarmCondition
    , priority : AlarmPriority
    , modality : AlarmModality
    , message : String
    , timestamp : Timestamp
    , isLatched : Bool
    , isSilenced : Bool
    }


{-| Clinical string representation of the priority tier.
-}
priorityToString : AlarmPriority -> String
priorityToString p =
    case p of
        CrisisHighPriority ->
            "CRISIS"

        WarningMediumPriority ->
            "WARNING"

        AdvisoryLowPriority ->
            "ADVISORY"

        TechnicalFailure ->
            "TECHNICAL"


{-| Standard clinical alarm banner color for display.
High priority: emergency red (#ff0033).
Medium priority: caution yellow (#ffcc00).
Low/technical: notification cyan (#00e5ff).
-}
alarmColor : AlarmPriority -> String
alarmColor p =
    case p of
        CrisisHighPriority ->
            "#ff0033"

        WarningMediumPriority ->
            "#ffcc00"

        AdvisoryLowPriority ->
            "#00e5ff"

        TechnicalFailure ->
            "#00b0ff"
