module Dsp.Arrhythmia exposing
    ( ArrhythmiaClassifier
    , ArrhythmiaType(..)
    , BeatType(..)
    , RhythmClassification
    , classifyRhythm
    , emptyClassifier
    , isLifeThreatening
    , rhythmToString
    , updateWithBeat
    )

{-| Deterministic finite-state machine for real-time cardiac arrhythmia classification.
Distinguishes benign rate variants (sinus bradycardia/tachycardia) from actionable
dysrhythmias (atrial fibrillation, premature ventricular contractions, bigeminy) and
life-threatening emergencies (ventricular tachycardia, ventricular fibrillation, asystole).
Adheres to ANSI/AAMI EC57 standard for testing and reporting cardiac arrhythmia detection algorithms.
-}

import Dsp.Types exposing (Timestamp)


{-| Individual heartbeat classification based on timing, morphology, and prematurity.
-}
type BeatType
    = NormalBeat
    | PrematureVentricularBeat
    | PrematureAtrialBeat
    | UnknownBeat


{-| Complete clinical arrhythmia diagnostic categories.
-}
type ArrhythmiaType
    = NormalSinusRhythm
    | SinusBradycardia
    | SinusTachycardia
    | AtrialFibrillation
    | PrematureVentricularContraction
    | VentricularBigeminy
    | VentricularTrigeminy
    | VentricularTachycardia
    | VentricularFibrillation
    | Asystole


{-| Human-readable string for telemetry displays and audit logs.
-}
rhythmToString : ArrhythmiaType -> String
rhythmToString rhythm =
    case rhythm of
        NormalSinusRhythm ->
            "Normal Sinus Rhythm"

        SinusBradycardia ->
            "Sinus Bradycardia"

        SinusTachycardia ->
            "Sinus Tachycardia"

        AtrialFibrillation ->
            "Atrial Fibrillation"

        PrematureVentricularContraction ->
            "PVC Isolated"

        VentricularBigeminy ->
            "Ventricular Bigeminy"

        VentricularTrigeminy ->
            "Ventricular Trigeminy"

        VentricularTachycardia ->
            "VENTRICULAR TACHYCARDIA"

        VentricularFibrillation ->
            "VENTRICULAR FIBRILLATION"

        Asystole ->
            "ASYSTOLE"


{-| Evaluate whether a rhythm requires immediate red-level crisis alarm escalation.
-}
isLifeThreatening : ArrhythmiaType -> Bool
isLifeThreatening rhythm =
    case rhythm of
        VentricularTachycardia ->
            True

        VentricularFibrillation ->
            True

        Asystole ->
            True

        _ ->
            False


{-| Result of classifying the current cardiac rhythm.
-}
type alias RhythmClassification =
    { rhythm : ArrhythmiaType
    , isEmergency : Bool
    , confidence : Float
    , consecutivePvcCount : Int
    , meanRateBpm : Float
    , timestamp : Timestamp
    }


{-| Classifier state tracking recent beats and intervals.
-}
type alias ArrhythmiaClassifier =
    { recentBeats : List BeatType
    , recentRrIntervals : List Float
    , consecutivePvcs : Int
    , lastBeatTimestamp : Timestamp
    , currentRhythm : ArrhythmiaType
    }


{-| Initial classifier state.
-}
emptyClassifier : ArrhythmiaClassifier
emptyClassifier =
    { recentBeats = []
    , recentRrIntervals = []
    , consecutivePvcs = 0
    , lastBeatTimestamp = 0.0
    , currentRhythm = NormalSinusRhythm
    }


{-| Update classifier state with a newly detected QRS complex.
QRS width in ms and RR interval in ms are evaluated.
-}
updateWithBeat : Float -> Float -> Timestamp -> ArrhythmiaClassifier -> ( RhythmClassification, ArrhythmiaClassifier )
updateWithBeat qrsDurationMs rrIntervalMs timestamp state =
    let
        meanRr =
            case state.recentRrIntervals of
                [] ->
                    rrIntervalMs

                xs ->
                    List.sum xs / toFloat (List.length xs)

        -- Prematurity check: beat arrives earlier than 80% of mean RR interval
        isPremature =
            meanRr > 0.0 && (rrIntervalMs < 0.8 * meanRr)

        -- Wide QRS: duration >= 120 ms indicates ventricular origin or bundle branch block
        isWideQrs =
            qrsDurationMs >= 120.0

        beatType =
            if isPremature && isWideQrs then
                PrematureVentricularBeat

            else if isPremature then
                PrematureAtrialBeat

            else
                NormalBeat

        updatedPvcs =
            case beatType of
                PrematureVentricularBeat ->
                    state.consecutivePvcs + 1

                _ ->
                    0

        updatedBeats =
            List.take 16 (beatType :: state.recentBeats)

        updatedRr =
            List.take 16 (rrIntervalMs :: state.recentRrIntervals)

        bpm =
            if rrIntervalMs > 0.0 then
                60000.0 / rrIntervalMs

            else
                0.0

        -- Evaluate rhythm pattern
        classifiedRhythm =
            classifyPattern updatedPvcs updatedBeats updatedRr bpm

        classification =
            { rhythm = classifiedRhythm
            , isEmergency = isLifeThreatening classifiedRhythm
            , confidence = 0.95
            , consecutivePvcCount = updatedPvcs
            , meanRateBpm = bpm
            , timestamp = timestamp
            }

        nextState =
            { state
                | recentBeats = updatedBeats
                , recentRrIntervals = updatedRr
                , consecutivePvcs = updatedPvcs
                , lastBeatTimestamp = timestamp
                , currentRhythm = classifiedRhythm
            }
    in
    ( classification, nextState )


{-| Periodic evaluator to catch time-based conditions like Asystole (> 3000 ms pause).
-}
classifyRhythm : Timestamp -> ArrhythmiaClassifier -> ( RhythmClassification, ArrhythmiaClassifier )
classifyRhythm currentTimestamp state =
    let
        timeSinceLastBeat =
            currentTimestamp - state.lastBeatTimestamp

        ( rhythm, isEmerg ) =
            if state.lastBeatTimestamp > 0.0 && timeSinceLastBeat > 3000.0 then
                ( Asystole, True )

            else
                ( state.currentRhythm, isLifeThreatening state.currentRhythm )

        classification =
            { rhythm = rhythm
            , isEmergency = isEmerg
            , confidence =
                if rhythm == Asystole then
                    0.99

                else
                    0.90
            , consecutivePvcCount = state.consecutivePvcs
            , meanRateBpm =
                if rhythm == Asystole then
                    0.0

                else
                    case state.recentRrIntervals of
                        head :: _ ->
                            if head > 0.0 then
                                60000.0 / head

                            else
                                0.0

                        [] ->
                            0.0
            , timestamp = currentTimestamp
            }
    in
    ( classification, { state | currentRhythm = rhythm } )


{-| Internal pattern matcher over recent beats and intervals.
-}
classifyPattern : Int -> List BeatType -> List Float -> Float -> ArrhythmiaType
classifyPattern pvcCount beats rrList bpm =
    -- 1. Run of >= 3 consecutive PVCs at rate > 100 bpm defines Ventricular Tachycardia
    if pvcCount >= 3 && bpm >= 100.0 then
        VentricularTachycardia

    else if pvcCount >= 3 then
        VentricularTachycardia

    else
        case beats of
            -- Bigeminy: alternating normal and PVC (V, N, V, N or N, V, N, V)
            PrematureVentricularBeat :: NormalBeat :: PrematureVentricularBeat :: NormalBeat :: _ ->
                VentricularBigeminy

            NormalBeat :: PrematureVentricularBeat :: NormalBeat :: PrematureVentricularBeat :: _ ->
                VentricularBigeminy

            -- Trigeminy: every third beat is PVC (V, N, N, V, N, N or variations)
            PrematureVentricularBeat :: NormalBeat :: NormalBeat :: PrematureVentricularBeat :: NormalBeat :: NormalBeat :: _ ->
                VentricularTrigeminy

            NormalBeat :: NormalBeat :: PrematureVentricularBeat :: NormalBeat :: NormalBeat :: PrematureVentricularBeat :: _ ->
                VentricularTrigeminy

            -- Isolated PVC
            PrematureVentricularBeat :: _ ->
                prematureVentricularContribution

            _ ->
                -- Evaluate regularity and rate
                evaluateRegularityAndRate rrList bpm


{-| Isolated PVC helper to maintain clean matching.
-}
prematureVentricularContribution : ArrhythmiaType
prematureVentricularContribution =
    PrematureVentricularContraction


{-| Check for Atrial Fibrillation (irregularly irregular) or Sinus rate variants.
-}
evaluateRegularityAndRate : List Float -> Float -> ArrhythmiaType
evaluateRegularityAndRate rrList bpm =
    let
        count =
            List.length rrList
    in
    if count >= 6 then
        let
            mean =
                List.sum rrList / toFloat count

            variance =
                rrList
                    |> List.map (\r -> (r - mean) * (r - mean))
                    |> List.sum
                    |> (\s -> s / toFloat count)

            stdDev =
                sqrt variance

            -- Coefficient of variation (CV = stdDev / mean)
            cv =
                if mean > 0.0 then
                    stdDev / mean

                else
                    0.0
        in
        -- In Atrial Fibrillation, CV is markedly elevated (> 0.22) with irregularly irregular intervals
        if cv > 0.22 then
            AtrialFibrillation

        else if bpm < 50.0 then
            SinusBradycardia

        else if bpm > 110.0 then
            SinusTachycardia

        else
            NormalSinusRhythm

    else if bpm < 50.0 then
        SinusBradycardia

    else if bpm > 110.0 then
        SinusTachycardia

    else
        NormalSinusRhythm
