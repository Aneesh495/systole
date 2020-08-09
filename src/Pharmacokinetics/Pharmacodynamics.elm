module Pharmacokinetics.Pharmacodynamics exposing
    ( calculateBispectralIndex
    , calculateDobutamineInotropicBoost
    , calculateFentanylAnalgesia
    , calculateNorepinephrinePressureBoost
    , sigmoidEmax
    )

{-| Pharmacodynamic (PD) response modeling via the Sigmoid Emax (Hill) equation.
Maps biophase effect-site concentrations to clinical physiological observables:
Bispectral Index (BIS) depth of hypnosis, vasopressor MAP vasoconstriction,
and inotropic cardiac contractility augmentation.
-}


{-| Generalized Sigmoid Emax (Hill) equation:
E = E0 + (Emax * Ce^gamma) / (EC50^gamma + Ce^gamma).
-}
sigmoidEmax : Float -> Float -> Float -> Float -> Float -> Float
sigmoidEmax e0 emax ec50 gamma ce =
    if ce <= 0.0 || ec50 <= 0.0 then
        e0

    else
        let
            cePow =
                ce ^ gamma

            ec50Pow =
                ec50 ^ gamma
        in
        e0 + (emax * cePow) / (ec50Pow + cePow)


{-| Predict Bispectral Index (BIS) depth of anesthesia from effect-site Propofol concentration Ce (mcg/mL).
BIS scale: 98 (awake, alert), 40 to 60 (general anesthesia), < 30 (deep burst suppression).
Parameters: E0 = 98.0, Emax = -98.0, EC50 = 3.2 mcg/mL, gamma = 2.4.
-}
calculateBispectralIndex : Float -> Float
calculateBispectralIndex propofolCeMcgMl =
    let
        e0 =
            98.0

        emax =
            -98.0

        ec50 =
            3.2

        gamma =
            2.4

        bis =
            sigmoidEmax e0 emax ec50 gamma propofolCeMcgMl
    in
    clamp 0.0 100.0 bis


{-| Predict increase in Mean Arterial Pressure (Delta MAP in mmHg) from Norepinephrine Ce (ng/mL).
Parameters: E0 = 0.0, Emax = 50.0 mmHg, EC50 = 2.5 ng/mL, gamma = 1.6.
-}
calculateNorepinephrinePressureBoost : Float -> Float
calculateNorepinephrinePressureBoost norepiCeNgMl =
    let
        e0 =
            0.0

        emax =
            50.0

        ec50 =
            2.5

        gamma =
            1.6

        boost =
            sigmoidEmax e0 emax ec50 gamma norepiCeNgMl
    in
    clamp 0.0 60.0 boost


{-| Predict increase in Stroke Volume (Delta SV in mL) from Dobutamine inotropic Ce (ng/mL).
Parameters: E0 = 0.0, Emax = 35.0 mL, EC50 = 25.0 ng/mL, gamma = 1.5.
-}
calculateDobutamineInotropicBoost : Float -> Float
calculateDobutamineInotropicBoost dobutamineCeNgMl =
    let
        e0 =
            0.0

        emax =
            35.0

        ec50 =
            25.0

        gamma =
            1.5

        boost =
            sigmoidEmax e0 emax ec50 gamma dobutamineCeNgMl
    in
    clamp 0.0 40.0 boost


{-| Predict analgesic pain suppression percentage (0 to 100%) from Fentanyl Ce (ng/mL).
Parameters: E0 = 0.0, Emax = 100.0%, EC50 = 1.5 ng/mL, gamma = 2.0.
-}
calculateFentanylAnalgesia : Float -> Float
calculateFentanylAnalgesia fentanylCeNgMl =
    let
        e0 =
            0.0

        emax =
            100.0

        ec50 =
            1.5

        gamma =
            2.0

        pct =
            sigmoidEmax e0 emax ec50 gamma fentanylCeNgMl
    in
    clamp 0.0 100.0 pct
