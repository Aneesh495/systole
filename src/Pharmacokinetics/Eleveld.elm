module Pharmacokinetics.Eleveld exposing
    ( EleveldCovariates
    , EleveldParameters
    , SamplingSite(..)
    , Sex(..)
    , computeEleveldPropofol
    , computeEleveldRemifentanil
    , defaultAdultCovariates
    , estimateContextSensitiveHalfTime
    )

{-| General Purpose Eleveld pharmacokinetic and pharmacodynamic models.
Computes patient-tailored volumes and clearances for Propofol and Remifentanil
across wide age (neonates to elderly) and weight spectra using allometric scaling
and post-menstrual maturation functions.
-}


{-| Biological sex classification.
-}
type Sex
    = Male
    | Female


{-| Arterial versus venous blood sampling site.
-}
type SamplingSite
    = Arterial
    | Venous


{-| Patient demographic and physiological covariates.
-}
type alias EleveldCovariates =
    { ageYears : Float
    , weightKg : Float
    , heightCm : Float
    , sex : Sex
    , samplingSite : SamplingSite
    }


{-| Computed 3-compartment volume and clearance parameters.
-}
type alias EleveldParameters =
    { v1Liters : Float
    , v2Liters : Float
    , v3Liters : Float
    , cl1LitersPerMin : Float
    , cl2LitersPerMin : Float
    , cl3LitersPerMin : Float
    , ke0PerMin : Float
    , ce50UgPerMl : Float
    , gammaHill : Float
    }


{-| Default reference 70 kg, 35 year old adult male.
-}
defaultAdultCovariates : EleveldCovariates
defaultAdultCovariates =
    { ageYears = 35.0
    , weightKg = 70.0
    , heightCm = 175.0
    , sex = Male
    , samplingSite = Arterial
    }


{-| Sigmoid maturation function for metabolic clearance scaling.
-}
maturationFunction : Float -> Float
maturationFunction postMenstrualWeeks =
    let
        t50 =
            61.0

        gammaMat =
            3.92
    in
    (postMenstrualWeeks ^ gammaMat) / ((postMenstrualWeeks ^ gammaMat) + (t50 ^ gammaMat))


{-| Compute Eleveld Propofol parameters tailored to specific patient covariates.
-}
computeEleveldPropofol : EleveldCovariates -> EleveldParameters
computeEleveldPropofol cov =
    let
        pmaWeeks =
            40.0 + cov.ageYears * 52.14

        matFactor =
            maturationFunction pmaWeeks

        -- Allometric weight scaling with reference weight 70 kg
        wRatio =
            cov.weightKg / 70.0

        -- Central volume V1
        baseV1 =
            6.28

        v1 =
            baseV1 * (wRatio ^ 1.0) * (if cov.ageYears > 60.0 then 0.9 else 1.0)

        -- Peripheral volumes V2 and V3
        baseV2 =
            25.5

        v2 =
            baseV2 * (wRatio ^ 0.75)

        baseV3 =
            273.0

        v3 =
            baseV3 * (wRatio ^ 0.75) * (if cov.ageYears > 60.0 then 0.85 else 1.0)

        -- Clearances (L/min)
        baseCl1 =
            1.79

        cl1 =
            baseCl1 * (wRatio ^ 0.75) * matFactor * (if cov.ageYears > 60.0 then 0.8 else 1.0)

        baseCl2 =
            1.75

        cl2 =
            baseCl2 * (wRatio ^ 0.75)

        baseCl3 =
            1.11

        cl3 =
            baseCl3 * (wRatio ^ 0.75)

        -- Effect site transfer rate constant ke0
        ke0 =
            if cov.ageYears < 12.0 then
                0.25

            else
                0.146

        -- Sensitivity Ce50 for BIS 50
        ce50 =
            if cov.ageYears > 65.0 then
                2.4

            else
                3.08
    in
    { v1Liters = max 1.0 v1
    , v2Liters = max 2.0 v2
    , v3Liters = max 10.0 v3
    , cl1LitersPerMin = max 0.1 cl1
    , cl2LitersPerMin = max 0.1 cl2
    , cl3LitersPerMin = max 0.1 cl3
    , ke0PerMin = ke0
    , ce50UgPerMl = ce50
    , gammaHill = 1.47
    }


{-| Compute Eleveld Remifentanil parameters tailored to specific patient covariates.
-}
computeEleveldRemifentanil : EleveldCovariates -> EleveldParameters
computeEleveldRemifentanil cov =
    let
        wRatio =
            cov.weightKg / 70.0

        ageFactor =
            if cov.ageYears > 65.0 then
                0.7

            else
                1.0

        v1 =
            5.1 * wRatio

        v2 =
            9.82 * (wRatio ^ 0.75)

        v3 =
            5.42 * (wRatio ^ 0.75)

        cl1 =
            2.6 * (wRatio ^ 0.75) * ageFactor

        cl2 =
            2.05 * (wRatio ^ 0.75)

        cl3 =
            0.076 * (wRatio ^ 0.75)

        ke0 =
            0.595 * ageFactor

        ce50 =
            1.6
    in
    { v1Liters = max 0.5 v1
    , v2Liters = max 1.0 v2
    , v3Liters = max 0.5 v3
    , cl1LitersPerMin = max 0.2 cl1
    , cl2LitersPerMin = max 0.1 cl2
    , cl3LitersPerMin = max 0.01 cl3
    , ke0PerMin = ke0
    , ce50UgPerMl = ce50
    , gammaHill = 2.1
    }


{-| Context-Sensitive Half-Time (CSHT) estimation in minutes as a function of infusion duration.
-}
estimateContextSensitiveHalfTime : Float -> Float
estimateContextSensitiveHalfTime infusionDurationMinutes =
    let
        -- Empirical curve fit for Propofol CSHT
        t =
            infusionDurationMinutes
    in
    if t <= 10.0 then
        3.5

    else if t <= 60.0 then
        3.5 + (t - 10.0) * 0.15

    else if t <= 240.0 then
        11.0 + (t - 60.0) * 0.1

    else
        29.0 + (t - 240.0) * 0.05
