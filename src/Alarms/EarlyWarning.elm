module Alarms.EarlyWarning exposing
    ( Consciousness(..)
    , News2Score
    , calculateNews2
    , calculateSofaCardiovascular
    , calculateSofaRespiratory
    , news2RiskTier
    )

{-| National Early Warning Score 2 (NEWS2) and Sequential Organ Failure Assessment (SOFA).
Scores physiological parameters to detect clinical deterioration, septic shock, and organ failure.
-}


{-| AVPU responsiveness scale for neurological assessment.
-}
type Consciousness
    = Alert
    | VoiceResponsive
    | PainResponsive
    | Unresponsive


{-| Complete NEWS2 clinical composite score.
-}
type alias News2Score =
    { totalScore : Int
    , respiratoryScore : Int
    , spo2Score : Int
    , supplementalOxygenScore : Int
    , systolicBpScore : Int
    , pulseRateScore : Int
    , consciousnessScore : Int
    , temperatureScore : Int
    }


{-| Clinical risk tier according to Royal College of Physicians guidelines.
-}
news2RiskTier : Int -> String
news2RiskTier score =
    if score >= 7 then
        "High Risk: Urgent Critical Care Outreach Response"

    else if score >= 5 then
        "Medium Risk: Urgent Ward Review"

    else
        "Low Risk: Standard Routine Monitoring"


{-| Calculate National Early Warning Score 2 (NEWS2) from bedside vitals.
-}
calculateNews2 :
    Float
    -> Float
    -> Bool
    -> Float
    -> Float
    -> Consciousness
    -> Float
    -> News2Score
calculateNews2 rr spo2 isAir sbp hr avpu tempC =
    let
        -- Respiratory Rate (breaths/min)
        rrScore =
            if rr <= 8.0 then
                3

            else if rr <= 11.0 then
                1

            else if rr <= 20.0 then
                0

            else if rr <= 24.0 then
                2

            else
                3

        -- SpO2 Scale 1 (%)
        spo2Score =
            if spo2 <= 91.0 then
                3

            else if spo2 <= 93.0 then
                2

            else if spo2 <= 95.0 then
                1

            else
                0

        -- Supplemental Oxygen (Air = 0, O2 = 2)
        o2Score =
            if isAir then
                0

            else
                2

        -- Systolic Blood Pressure (mmHg)
        sbpScore =
            if sbp <= 90.0 then
                3

            else if sbp <= 100.0 then
                2

            else if sbp <= 110.0 then
                1

            else if sbp <= 219.0 then
                0

            else
                3

        -- Pulse Rate (BPM)
        hrScore =
            if hr <= 40.0 then
                3

            else if hr <= 50.0 then
                1

            else if hr <= 90.0 then
                0

            else if hr <= 110.0 then
                1

            else if hr <= 130.0 then
                2

            else
                3

        -- Level of Consciousness (Alert = 0, New Confusion/V/P/U = 3)
        avpuScore =
            case avpu of
                Alert ->
                    0

                _ ->
                    3

        -- Temperature (C)
        tempScore =
            if tempC <= 35.0 then
                3

            else if tempC <= 36.0 then
                1

            else if tempC <= 38.0 then
                0

            else if tempC <= 39.0 then
                1

            else
                2

        total =
            rrScore + spo2Score + o2Score + sbpScore + hrScore + avpuScore + tempScore
    in
    { totalScore = total
    , respiratoryScore = rrScore
    , spo2Score = spo2Score
    , supplementalOxygenScore = o2Score
    , systolicBpScore = sbpScore
    , pulseRateScore = hrScore
    , consciousnessScore = avpuScore
    , temperatureScore = tempScore
    }


{-| Calculate SOFA cardiovascular component score (0 to 4 points).
Evaluates MAP and vasopressor requirements (doses in mcg/kg/min).
-}
calculateSofaCardiovascular : Float -> Float -> Float -> Float -> Int
calculateSofaCardiovascular map dopamineDose epiDose norepiDose =
    if norepiDose > 0.1 || epiDose > 0.1 then
        4

    else if dopamineDose > 5.0 || norepiDose > 0.0 || epiDose > 0.0 then
        3

    else if dopamineDose > 0.0 then
        2

    else if map < 70.0 then
        1

    else
        0


{-| Calculate SOFA respiratory component score from PaO2 / FiO2 ratio (P/F ratio).
-}
calculateSofaRespiratory : Float -> Float -> Bool -> Int
calculateSofaRespiratory paO2 fiO2 isMechanicallyVentilated =
    let
        safeFiO2 =
            max 0.21 (fiO2 / 100.0)

        pfRatio =
            paO2 / safeFiO2
    in
    if pfRatio < 100.0 && isMechanicallyVentilated then
        4

    else if pfRatio < 200.0 && isMechanicallyVentilated then
        3

    else if pfRatio < 300.0 then
        2

    else if pfRatio < 400.0 then
        1

    else
        0
