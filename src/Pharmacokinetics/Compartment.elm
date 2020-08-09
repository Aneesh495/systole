module Pharmacokinetics.Compartment exposing
    ( CompartmentConcentrations
    , CompartmentParams
    , CompartmentState
    , emptyConcentrations
    , initCompartmentState
    , stepCompartment
    )

{-| Numerical differential equation integrator for linear three-compartment
pharmacokinetic (PK) and effect-site pharmacodynamic (PD) modeling.
Solves inter-compartmental distribution and elimination via discrete forward integration.
-}


{-| Micro-constants and volume parameters defining a three-compartment model.
Volumes in Liters, rate constants in min^-1.
-}
type alias CompartmentParams =
    { v1Liters : Float
    , v2Liters : Float
    , v3Liters : Float
    , k10PerMin : Float
    , k12PerMin : Float
    , k21PerMin : Float
    , k13PerMin : Float
    , k31PerMin : Float
    , ke0PerMin : Float
    }


{-| Instantaneous drug concentration in each physiological compartment (in mcg/mL or ng/mL).
-}
type alias CompartmentConcentrations =
    { centralCp : Float
    , peripheralFastC2 : Float
    , peripheralSlowC3 : Float
    , effectSiteCe : Float
    }


{-| State registers holding total mass of drug (in mcg or mg) in each compartment.
-}
type alias CompartmentState =
    { params : CompartmentParams
    , massCentral : Float
    , massFast : Float
    , massSlow : Float
    , effectSiteConcentration : Float
    }


{-| Neutral empty concentrations.
-}
emptyConcentrations : CompartmentConcentrations
emptyConcentrations =
    { centralCp = 0.0
    , peripheralFastC2 = 0.0
    , peripheralSlowC3 = 0.0
    , effectSiteCe = 0.0
    }


{-| Initialize compartment state with specific model parameters.
-}
initCompartmentState : CompartmentParams -> CompartmentState
initCompartmentState p =
    { params = p
    , massCentral = 0.0
    , massFast = 0.0
    , massSlow = 0.0
    , effectSiteConcentration = 0.0
    }


{-| Advance pharmacokinetic simulation by delta time dtMinutes with constant infusion rate (mcg/min).
Uses Euler integration with sub-stepping for numerical stability.
-}
stepCompartment : Float -> Float -> CompartmentState -> ( CompartmentConcentrations, CompartmentState )
stepCompartment infusionRateMcgMin dtMinutes state =
    let
        p =
            state.params

        -- Sub-step to avoid numerical stiffness when dt > 0.05 min
        numSteps =
            max 1 (ceiling (dtMinutes / 0.01))

        subDt =
            dtMinutes / toFloat numSteps

        integrateStep _ st =
            let
                v1Ml =
                    max 100.0 (p.v1Liters * 1000.0)

                v2Ml =
                    max 100.0 (p.v2Liters * 1000.0)

                v3Ml =
                    max 100.0 (p.v3Liters * 1000.0)

                c1 =
                    st.massCentral / v1Ml

                c2 =
                    st.massFast / v2Ml

                c3 =
                    st.massSlow / v3Ml

                -- Flux rates (mcg/min)
                fluxElimination =
                    p.k10PerMin * st.massCentral

                flux1to2 =
                    p.k12PerMin * st.massCentral

                flux2to1 =
                    p.k21PerMin * st.massFast

                flux1to3 =
                    p.k13PerMin * st.massCentral

                flux3to1 =
                    p.k31PerMin * st.massSlow

                -- Mass differentials
                dMass1 =
                    infusionRateMcgMin - fluxElimination - flux1to2 + flux2to1 - flux1to3 + flux3to1

                dMass2 =
                    flux1to2 - flux2to1

                dMass3 =
                    flux1to3 - flux3to1

                -- Effect-site concentration differential: dCe/dt = ke0 * (Cp - Ce)
                dCe =
                    p.ke0PerMin * (c1 - st.effectSiteConcentration)

                nextMass1 =
                    max 0.0 (st.massCentral + dMass1 * subDt)

                nextMass2 =
                    max 0.0 (st.massFast + dMass2 * subDt)

                nextMass3 =
                    max 0.0 (st.massSlow + dMass3 * subDt)

                nextCe =
                    max 0.0 (st.effectSiteConcentration + dCe * subDt)
            in
            { st
                | massCentral = nextMass1
                , massFast = nextMass2
                , massSlow = nextMass3
                , effectSiteConcentration = nextCe
            }

        finalState =
            List.foldl integrateStep state (List.range 1 numSteps)

        concentrations =
            { centralCp = finalState.massCentral / max 100.0 (p.v1Liters * 1000.0)
            , peripheralFastC2 = finalState.massFast / max 100.0 (p.v2Liters * 1000.0)
            , peripheralSlowC3 = finalState.massSlow / max 100.0 (p.v3Liters * 1000.0)
            , effectSiteCe = finalState.effectSiteConcentration
            }
    in
    ( concentrations, finalState )
