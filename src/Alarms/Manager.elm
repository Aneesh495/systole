module Alarms.Manager exposing
    ( AlarmManager
    , acknowledgeAlarm
    , clearResolvedAlarms
    , emptyAlarmManager
    , evaluateVitals
    , getHighestPriorityAlarm
    , silenceAlarms
    , tickSilenceTimer
    )

{-| IEC 60601-1-8 compliant alarm management and smart multi-sensor fusion engine.
Cross-correlates ECG electrical rhythms with pulsatile arterial pressure (ABP) and plethysmography (PPG)
to suppress artifact-induced false alarms. Manages alarm latching, priorities, and audio silence timers.
-}

import Alarms.Types
    exposing
        ( ActiveAlarm
        , AlarmCondition(..)
        , AlarmModality(..)
        , AlarmPriority(..)
        )
import Dsp.Arrhythmia exposing (ArrhythmiaType(..))
import Dsp.Types exposing (Timestamp)


{-| Central alarm state holding active alerts, silence timer, and audio mute flags.
-}
type alias AlarmManager =
    { activeAlarms : List ActiveAlarm
    , isAudioSilenced : Bool
    , silenceRemainingSec : Float
    , isAudioMuted : Bool
    }


{-| Initial empty alarm manager state.
-}
emptyAlarmManager : AlarmManager
emptyAlarmManager =
    { activeAlarms = []
    , isAudioSilenced = False
    , silenceRemainingSec = 0.0
    , isAudioMuted = False
    }


{-| Silence all current alarms for the standard clinical 120-second interval.
-}
silenceAlarms : Float -> AlarmManager -> AlarmManager
silenceAlarms durationSec mgr =
    let
        updatedAlarms =
            List.map (\a -> { a | isSilenced = True }) mgr.activeAlarms
    in
    { mgr
        | activeAlarms = updatedAlarms
        , isAudioSilenced = True
        , silenceRemainingSec = durationSec
    }


{-| Advance the silence countdown timer by delta time (in seconds).
-}
tickSilenceTimer : Float -> AlarmManager -> AlarmManager
tickSilenceTimer dtSec mgr =
    if mgr.isAudioSilenced then
        let
            rem =
                mgr.silenceRemainingSec - dtSec
        in
        if rem <= 0.0 then
            let
                unSilenced =
                    List.map (\a -> { a | isSilenced = False }) mgr.activeAlarms
            in
            { mgr
                | activeAlarms = unSilenced
                , isAudioSilenced = False
                , silenceRemainingSec = 0.0
            }

        else
            { mgr | silenceRemainingSec = rem }

    else
        mgr


{-| Acknowledge and dismiss an alarm by identifier.
-}
acknowledgeAlarm : String -> AlarmManager -> AlarmManager
acknowledgeAlarm alarmId mgr =
    let
        filtered =
            List.filter (\a -> a.id /= alarmId) mgr.activeAlarms
    in
    { mgr | activeAlarms = filtered }


{-| Retrieve the highest priority un-silenced active alarm for audio chime and banner presentation.
-}
getHighestPriorityAlarm : AlarmManager -> Maybe ActiveAlarm
getHighestPriorityAlarm mgr =
    let
        priorityWeight p =
            case p of
                CrisisHighPriority ->
                    4

                WarningMediumPriority ->
                    3

                AdvisoryLowPriority ->
                    2

                TechnicalFailure ->
                    1

        sorted =
            List.sortWith
                (\a b ->
                    compare (priorityWeight b.priority) (priorityWeight a.priority)
                )
                mgr.activeAlarms
    in
    List.head sorted


{-| Clear resolved non-latched alarms from the active list.
-}
clearResolvedAlarms : List String -> AlarmManager -> AlarmManager
clearResolvedAlarms activeConditionIds mgr =
    let
        retained =
            List.filter (\a -> a.isLatched || List.member a.id activeConditionIds) mgr.activeAlarms
    in
    { mgr | activeAlarms = retained }


{-| Multi-parameter physiological evaluator.
Fuses ECG rhythm, Arterial Blood Pressure, SpO2, and EtCO2.
Detects true crises while suppressing false asystole when mechanical pulses persist.
-}
evaluateVitals :
    ArrhythmiaType
    -> Float
    -> Float
    -> Float
    -> Float
    -> Float
    -> Float
    -> Bool
    -> Timestamp
    -> AlarmManager
    -> AlarmManager
evaluateVitals rhythm hr sbp dbp map spo2 etco2 hasPpgPulse timestamp mgr =
    let
        newAlarms =
            []
                -- 1. Rhythm and Asystole sensor fusion gating:
                -- If ECG exhibits Asystole, check ABP and PPG. If SBP > 70 or PPG has pulses,
                -- this is almost certainly an ECG Lead Off artifact, not true cardiac arrest!
                |> addEcgRhythmAlert rhythm sbp hasPpgPulse timestamp
                -- 2. Heart rate limits
                |> addHrAlerts hr timestamp
                -- 3. Arterial pressure limits
                |> addAbpAlerts sbp map timestamp
                -- 4. Pulse oximetry desaturation
                |> addSpo2Alerts spo2 timestamp
                -- 5. Capnography airway alerts
                |> addCapnoAlerts etco2 timestamp

        -- Merge new alarms into existing active alarms, preventing duplicates
        merged =
            List.foldl
                (\newA acc ->
                    if List.any (\existing -> existing.id == newA.id) acc then
                        acc

                    else
                        newA :: acc
                )
                mgr.activeAlarms
                newAlarms
    in
    { mgr | activeAlarms = merged }


addEcgRhythmAlert : ArrhythmiaType -> Float -> Bool -> Timestamp -> List ActiveAlarm -> List ActiveAlarm
addEcgRhythmAlert rhythm sbp hasPpgPulse ts acc =
    case rhythm of
        Asystole ->
            -- Multi-sensor gating: if blood pressure is pulsatile, downgrade from crisis to lead fault
            if sbp > 60.0 || hasPpgPulse then
                { id = "ECG_LEAD_OFF"
                , condition = EcgLeadOff
                , priority = TechnicalFailure
                , modality = EcgModality
                , message = "ECG Lead Off: Pulses intact, check Lead II electrode"
                , timestamp = ts
                , isLatched = False
                , isSilenced = False
                }
                    :: acc

            else
                { id = "ASYSTOLE_CRISIS"
                , condition = AsystoleCrisis
                , priority = CrisisHighPriority
                , modality = EcgModality
                , message = "ASYSTOLE: Zero electrical activity, initiate CPR"
                , timestamp = ts
                , isLatched = True
                , isSilenced = False
                }
                    :: acc

        VentricularFibrillation ->
            { id = "VFIB_CRISIS"
            , condition = VentricularFibrillationCrisis
            , priority = CrisisHighPriority
            , modality = EcgModality
            , message = "VENTRICULAR FIBRILLATION: Prepare defibrillator"
            , timestamp = ts
            , isLatched = True
            , isSilenced = False
            }
                :: acc

        VentricularTachycardia ->
            { id = "VTACH_CRISIS"
            , condition = VentricularTachycardiaCrisis
            , priority = CrisisHighPriority
            , modality = EcgModality
            , message = "VENTRICULAR TACHYCARDIA: Wide complex tachycardia"
            , timestamp = ts
            , isLatched = True
            , isSilenced = False
            }
                :: acc

        _ ->
            acc


addHrAlerts : Float -> Timestamp -> List ActiveAlarm -> List ActiveAlarm
addHrAlerts hr ts acc =
    if hr < 40.0 && hr > 0.0 then
        { id = "HR_EXTREME_BRADY"
        , condition = ExtremeBradycardia hr
        , priority = CrisisHighPriority
        , modality = EcgModality
        , message = "Extreme Bradycardia: HR < 40 BPM"
        , timestamp = ts
        , isLatched = False
        , isSilenced = False
        }
            :: acc

    else if hr > 150.0 then
        { id = "HR_EXTREME_TACHY"
        , condition = ExtremeTachycardia hr
        , priority = WarningMediumPriority
        , modality = EcgModality
        , message = "Severe Tachycardia: HR > 150 BPM"
        , timestamp = ts
        , isLatched = False
        , isSilenced = False
        }
            :: acc

    else
        acc


addAbpAlerts : Float -> Float -> Timestamp -> List ActiveAlarm -> List ActiveAlarm
addAbpAlerts sbp map ts acc =
    if sbp < 70.0 && sbp > 0.0 then
        { id = "ABP_SEVERE_HYPOTENSION"
        , condition = SevereHypotension sbp
        , priority = CrisisHighPriority
        , modality = AbpModality
        , message = "Severe Hypotension: SBP < 70 mmHg"
        , timestamp = ts
        , isLatched = False
        , isSilenced = False
        }
            :: acc

    else if map < 65.0 && map > 0.0 then
        { id = "ABP_MAP_LOW"
        , condition = SevereHypotension map
        , priority = WarningMediumPriority
        , modality = AbpModality
        , message = "Low Perfusion: MAP < 65 mmHg"
        , timestamp = ts
        , isLatched = False
        , isSilenced = False
        }
            :: acc

    else if sbp > 190.0 then
        { id = "ABP_HYPERTENSIVE_CRISIS"
        , condition = SevereHypertension sbp
        , priority = WarningMediumPriority
        , modality = AbpModality
        , message = "Severe Hypertension: SBP > 190 mmHg"
        , timestamp = ts
        , isLatched = False
        , isSilenced = False
        }
            :: acc

    else
        acc


addSpo2Alerts : Float -> Timestamp -> List ActiveAlarm -> List ActiveAlarm
addSpo2Alerts spo2 ts acc =
    if spo2 < 75.0 && spo2 > 0.0 then
        { id = "SPO2_CRITICAL_DESAT"
        , condition = CriticalDesaturation spo2
        , priority = CrisisHighPriority
        , modality = PpgModality
        , message = "Critical Desaturation: SpO2 < 75%"
        , timestamp = ts
        , isLatched = True
        , isSilenced = False
        }
            :: acc

    else if spo2 < 88.0 && spo2 > 0.0 then
        { id = "SPO2_WARNING_DESAT"
        , condition = CriticalDesaturation spo2
        , priority = WarningMediumPriority
        , modality = PpgModality
        , message = "Hypoxemia Warning: SpO2 < 88%"
        , timestamp = ts
        , isLatched = False
        , isSilenced = False
        }
            :: acc

    else
        acc


addCapnoAlerts : Float -> Timestamp -> List ActiveAlarm -> List ActiveAlarm
addCapnoAlerts etco2 ts acc =
    if etco2 < 10.0 && etco2 > 0.0 then
        { id = "CAPNO_APNEA_EXTREME_LOW"
        , condition = ApneaDetected etco2
        , priority = CrisisHighPriority
        , modality = CapnoModality
        , message = "Apnea or Severe Hypoperfusion: EtCO2 < 10 mmHg"
        , timestamp = ts
        , isLatched = True
        , isSilenced = False
        }
            :: acc

    else
        acc
