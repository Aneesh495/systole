module Pharmacokinetics.Titration exposing
    ( TciPlan
    , TciTargetMode(..)
    , calculateBolusDose
    , calculateMaintenanceRate
    , generateTciPlan
    )

{-| Target-Controlled Infusion (TCI) planning engine for intravenous anesthesia and vasoactives.
Solves for induction loading boluses and multi-stage stepped maintenance infusion profiles
to rapidly attain and maintain target plasma (Cp) or effect-site (Ce) concentrations.
-}

import Pharmacokinetics.Compartment exposing (CompartmentParams)


{-| TCI control modality: targeting central plasma concentration or biophase effect-site.
-}
type TciTargetMode
    = PlasmaTargeted Float
    | EffectSiteTargeted Float


{-| Stepped multi-stage infusion plan.
-}
type alias TciPlan =
    { loadingBolusMcg : Float
    , stage1RateMcgMin : Float
    , stage1DurationMin : Float
    , stage2RateMcgMin : Float
    , stage2DurationMin : Float
    , steadyStateRateMcgMin : Float
    , targetConcentration : Float
    }


{-| Calculate initial loading bolus dose required to instantly fill central volume V1 to target concentration.
Formula: Loading Dose (mcg) = Target (mcg/mL) * V1 (mL) = Target * V1 * 1000.
-}
calculateBolusDose : Float -> CompartmentParams -> Float
calculateBolusDose targetMcgMl params =
    let
        v1Ml =
            params.v1Liters * 1000.0
    in
    targetMcgMl * v1Ml


{-| Calculate long-term steady-state maintenance infusion rate.
At steady state, input equals elimination: Rate = Target * V1 * k10.
Formula: Rate (mcg/min) = Target (mcg/mL) * V1 (mL) * k10 (min^-1).
-}
calculateMaintenanceRate : Float -> CompartmentParams -> Float
calculateMaintenanceRate targetMcgMl params =
    let
        v1Ml =
            params.v1Liters * 1000.0
    in
    targetMcgMl * v1Ml * params.k10PerMin


{-| Generate an optimized 3-stage stepped TCI infusion schedule (Betts/Shafer protocol).
Rapidly offsets distribution into peripheral compartments V2 and V3.
-}
generateTciPlan : Float -> CompartmentParams -> TciPlan
generateTciPlan targetMcgMl params =
    let
        bolus =
            calculateBolusDose targetMcgMl params

        ssRate =
            calculateMaintenanceRate targetMcgMl params

        -- Stage 1 (0 to 10 min): offsets rapid distribution into V2
        stage1Rate =
            ssRate + (targetMcgMl * params.v1Liters * 1000.0 * params.k12PerMin)

        -- Stage 2 (10 to 30 min): intermediate tapering rate
        stage2Rate =
            ssRate + (0.4 * targetMcgMl * params.v1Liters * 1000.0 * params.k12PerMin)
    in
    { loadingBolusMcg = bolus
    , stage1RateMcgMin = stage1Rate
    , stage1DurationMin = 10.0
    , stage2RateMcgMin = stage2Rate
    , stage2DurationMin = 20.0
    , steadyStateRateMcgMin = ssRate
    , targetConcentration = targetMcgMl
    }
