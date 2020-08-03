module Hemodynamics.Targets exposing
    ( ClinicalState(..)
    , FrankStarlingPosition(..)
    , TargetRange
    , VasoactiveDoses
    , calculateVis
    , classifyHemodynamicState
    , estimateFrankStarlingPosition
    , isWithinTarget
    , standardTargets
    )

{-| Physiological target ranges, Frank-Starling ventricular function curves,
and Vasoactive-Inotropic Score (VIS) computation for critical care decision support.
-}

import Hemodynamics.Calculations exposing (HemodynamicProfile)


{-| Clinical hemodynamic diagnostic state.
-}
type ClinicalState
    = EuvolemicNominal
    | HypovolemicShock
    | CardiogenicShock
    | DistributiveSepticShock
    | ObstructiveShock


{-| Position along the Frank-Starling ventricular performance curve.
Preload (CVP in mmHg) versus contractility / performance (Stroke Volume Index in mL/m^2).
-}
type FrankStarlingPosition
    = PreloadResponsive Float Float
    | PlateauOptimal Float Float
    | OverloadedDecompensated Float Float


{-| Acceptable clinical target interval [min, max].
-}
type alias TargetRange =
    { min : Float
    , max : Float
    , unit : String
    }


{-| Bedside infusion rates of inotropes and vasopressors for calculating the Vasoactive-Inotropic Score (VIS).
Rates in mcg/kg/min (or units/kg/min for vasopressin).
-}
type alias VasoactiveDoses =
    { dopamineMcgKgMin : Float
    , dobutamineMcgKgMin : Float
    , epinephrineMcgKgMin : Float
    , norepinephrineMcgKgMin : Float
    , milrinoneMcgKgMin : Float
    , vasopressinUnitsKgMin : Float
    }


{-| Standard normal adult reference ranges for hemodynamic parameters.
-}
standardTargets :
    { meanArterialPressure : TargetRange
    , cardiacIndex : TargetRange
    , strokeVolumeIndex : TargetRange
    , systemicVascularResistance : TargetRange
    , centralVenousPressure : TargetRange
    , shockIndex : TargetRange
    }
standardTargets =
    { meanArterialPressure = { min = 65.0, max = 100.0, unit = "mmHg" }
    , cardiacIndex = { min = 2.5, max = 4.0, unit = "L/min/m^2" }
    , strokeVolumeIndex = { min = 35.0, max = 50.0, unit = "mL/m^2" }
    , systemicVascularResistance = { min = 800.0, max = 1200.0, unit = "dyn*s/cm^5" }
    , centralVenousPressure = { min = 4.0, max = 10.0, unit = "mmHg" }
    , shockIndex = { min = 0.5, max = 0.7, unit = "ratio" }
    }


{-| Check whether a measured parameter is within its target clinical interval.
-}
isWithinTarget : Float -> TargetRange -> Bool
isWithinTarget value target =
    value >= target.min && value <= target.max


{-| Calculate Vasoactive-Inotropic Score (VIS).
Validated predictor of clinical outcomes and mortality in critical care.
Formula:
VIS = Dopamine + Dobutamine + 100*Epi + 100*Norepi + 10*Milrinone + 10000*Vasopressin.
-}
calculateVis : VasoactiveDoses -> Float
calculateVis doses =
    doses.dopamineMcgKgMin
        + doses.dobutamineMcgKgMin
        + (100.0 * doses.epinephrineMcgKgMin)
        + (100.0 * doses.norepinephrineMcgKgMin)
        + (10.0 * doses.milrinoneMcgKgMin)
        + (10000.0 * doses.vasopressinUnitsKgMin)


{-| Classify patient position on the Frank-Starling myocardial performance curve.
Preload represented by CVP (mmHg), performance by Stroke Volume Index (mL/m^2).
-}
estimateFrankStarlingPosition : Float -> Float -> FrankStarlingPosition
estimateFrankStarlingPosition cvp svi =
    if cvp < 6.0 && svi < 35.0 then
        -- Steep ascending limb: volume responsive
        PreloadResponsive cvp svi

    else if cvp <= 12.0 && svi >= 35.0 then
        -- Plateau: optimal ventricular performance
        PlateauOptimal cvp svi

    else
        -- Excessive filling pressures with sub-optimal ejection
        OverloadedDecompensated cvp svi


{-| Classify clinical shock archetype from full hemodynamic profile and CVP.
-}
classifyHemodynamicState : HemodynamicProfile -> Float -> ClinicalState
classifyHemodynamicState prof cvp =
    if prof.shockIndex > 0.9 then
        if prof.cardiacIndexLpmM2 < 2.2 && cvp > 12.0 && prof.systemicVascularResistanceDyns > 1400.0 then
            CardiogenicShock

        else if prof.cardiacIndexLpmM2 < 2.2 && cvp < 5.0 then
            HypovolemicShock

        else if prof.cardiacIndexLpmM2 > 4.0 && prof.systemicVascularResistanceDyns < 700.0 then
            DistributiveSepticShock

        else if cvp > 14.0 && prof.cardiacIndexLpmM2 < 2.0 then
            ObstructiveShock

        else
            HypovolemicShock

    else if prof.systemicVascularResistanceDyns < 650.0 && prof.cardiacIndexLpmM2 > 3.8 then
        DistributiveSepticShock

    else
        EuvolemicNominal
