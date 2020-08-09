module Pharmacokinetics.Models exposing
    ( DrugType(..)
    , PatientCovariates
    , calculateLeanBodyMass
    , dobutamineParams
    , fentanylParams
    , marshPropofolParams
    , norepinephrineParams
    , schniderPropofolParams
    )

{-| Clinically validated pharmacokinetic multicompartment parameter sets.
Includes Marsh and Schnider covariate-adjusted models for Propofol,
single-compartment vasoactive clearance for Norepinephrine and Dobutamine,
and three-compartment opioid dynamics for Fentanyl.
-}

import Pharmacokinetics.Compartment exposing (CompartmentParams)


{-| Standard clinical drugs supported for target-controlled infusion and modeling.
-}
type DrugType
    = PropofolMarsh
    | PropofolSchnider
    | Norepinephrine
    | Dobutamine
    | Fentanyl


{-| Patient physiological covariates required for parameter scaling.
-}
type alias PatientCovariates =
    { ageYears : Float
    , weightKg : Float
    , heightCm : Float
    , isMale : Bool
    }


{-| Calculate Lean Body Mass (LBM) in kg using the validated James formula.
-}
calculateLeanBodyMass : PatientCovariates -> Float
calculateLeanBodyMass cov =
    let
        bmiRatio =
            cov.weightKg / cov.heightCm
    in
    if cov.isMale then
        max 25.0 (1.1 * cov.weightKg - 128.0 * (bmiRatio * bmiRatio))

    else
        max 20.0 (1.07 * cov.weightKg - 148.0 * (bmiRatio * bmiRatio))


{-| Marsh model for Propofol: volumes scale directly with total patient body weight.
-}
marshPropofolParams : PatientCovariates -> CompartmentParams
marshPropofolParams cov =
    let
        w =
            max 30.0 cov.weightKg
    in
    { v1Liters = 0.228 * w
    , v2Liters = 0.463 * w
    , v3Liters = 2.893 * w
    , k10PerMin = 0.119
    , k12PerMin = 0.112
    , k21PerMin = 0.055
    , k13PerMin = 0.0033
    , k31PerMin = 0.0019
    , ke0PerMin = 0.26
    }


{-| Schnider model for Propofol: incorporates age, height, weight, and lean body mass.
Central volume V1 is fixed at 4.27 L; peripheral clearances adjust with age and LBM.
-}
schniderPropofolParams : PatientCovariates -> CompartmentParams
schniderPropofolParams cov =
    let
        lbm =
            calculateLeanBodyMass cov

        age =
            clamp 18.0 95.0 cov.ageYears

        w =
            cov.weightKg

        h =
            cov.heightCm

        v1 =
            4.27

        v2 =
            max 5.0 (18.9 - 0.391 * (age - 53.0))

        v3 =
            238.0

        -- Clearances in L/min
        cl1 =
            max 0.5 (1.89 + 0.0456 * (w - 77.0) - 0.0681 * (lbm - 59.0) + 0.0264 * (h - 177.0))

        cl2 =
            max 0.2 (1.29 - 0.024 * (age - 53.0))

        cl3 =
            0.836

        -- Micro-constants: k = Cl / V
        k10 =
            cl1 / v1

        k12 =
            cl2 / v1

        k21 =
            cl2 / v2

        k13 =
            cl3 / v1

        k31 =
            cl3 / v3
    in
    { v1Liters = v1
    , v2Liters = v2
    , v3Liters = v3
    , k10PerMin = k10
    , k12PerMin = k12
    , k21PerMin = k21
    , k13PerMin = k13
    , k31PerMin = k31
    , ke0PerMin = 0.456
    }


{-| Norepinephrine vasopressor model.
Fast elimination (half-life ~2.5 min), volume of distribution 0.2 L/kg.
Rate constant k10 = ln(2) / 2.5 = 0.277 min^-1.
-}
norepinephrineParams : PatientCovariates -> CompartmentParams
norepinephrineParams cov =
    let
        vd =
            max 5.0 (0.2 * cov.weightKg)
    in
    { v1Liters = vd
    , v2Liters = vd * 0.5
    , v3Liters = vd * 0.5
    , k10PerMin = 0.277
    , k12PerMin = 0.05
    , k21PerMin = 0.05
    , k13PerMin = 0.01
    , k31PerMin = 0.01
    , ke0PerMin = 0.693
    }


{-| Dobutamine inotropic model.
Elimination half-life ~2.0 min, volume of distribution 0.25 L/kg.
Rate constant k10 = ln(2) / 2.0 = 0.346 min^-1.
-}
dobutamineParams : PatientCovariates -> CompartmentParams
dobutamineParams cov =
    let
        vd =
            max 6.0 (0.25 * cov.weightKg)
    in
    { v1Liters = vd
    , v2Liters = vd * 0.5
    , v3Liters = vd * 0.5
    , k10PerMin = 0.346
    , k12PerMin = 0.06
    , k21PerMin = 0.06
    , k13PerMin = 0.01
    , k31PerMin = 0.01
    , ke0PerMin = 0.693
    }


{-| Fentanyl synthetic opioid analgesic model (Scott et al. parameters).
Rapid distribution and extensive peripheral tissue storage.
-}
fentanylParams : PatientCovariates -> CompartmentParams
fentanylParams cov =
    let
        w =
            max 30.0 cov.weightKg

        scale =
            w / 70.0
    in
    { v1Liters = 13.0 * scale
    , v2Liters = 45.0 * scale
    , v3Liters = 275.0 * scale
    , k10PerMin = 0.062
    , k12PerMin = 0.315
    , k21PerMin = 0.083
    , k13PerMin = 0.038
    , k31PerMin = 0.003
    , ke0PerMin = 0.147
    }
