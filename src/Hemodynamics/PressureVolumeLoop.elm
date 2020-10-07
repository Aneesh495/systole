module Hemodynamics.PressureVolumeLoop exposing
    ( PvCoordinates
    , PvLoopModel
    , PvLoopMetrics
    , defaultPvModel
    , computePvMetrics
    , generateLoopTrajectory
    , evaluateEspvr
    , evaluateEdpvr
    )

{-| Left Ventricular Pressure-Volume (PV) loop mathematical modeling.
Implements Suga and Sagawa time-varying elastance, End-Systolic Pressure-Volume
Relationship (ESPVR), End-Diastolic Pressure-Volume Relationship (EDPVR),
arterial elastance (Ea), and ventriculo-arterial coupling (Ea/Ees).
-}


{-| 2D coordinate point on the pressure-volume plane (Volume in mL, Pressure in mmHg).
-}
type alias PvCoordinates =
    { volumeMl : Float
    , pressureMmHg : Float
    }


{-| Physical parameters defining left ventricular and arterial loading conditions.
-}
type alias PvLoopModel =
    { eesMmHgPerMl : Float
    -- End-systolic elastance (inotropic contractility index)
    , v0Ml : Float
    -- Volume axis intercept of ESPVR
    , edpvrAlpha : Float
    -- Diastolic stiffness curvature coefficient
    , edpvrBeta : Float
    -- Diastolic scaling coefficient
    , targetEdvMl : Float
    -- End-diastolic volume (preload)
    , meanArterialPressureMmHg : Float
    -- Arterial afterload pressure
    , heartRateBpm : Float
    }


{-| Hemodynamic indices derived from the PV loop geometry.
-}
type alias PvLoopMetrics =
    { endDiastolicVolumeMl : Float
    , endSystolicVolumeMl : Float
    , strokeVolumeMl : Float
    , ejectionFractionPercent : Float
    , endSystolicPressureMmHg : Float
    , endDiastolicPressureMmHg : Float
    , arterialElastanceEa : Float
    , endSystolicElastanceEes : Float
    , ventriculoArterialCoupling : Float
    , strokeWorkMmhgMl : Float
    , potentialEnergyMmhgMl : Float
    , pressureVolumeArea : Float
    , mechanicalEfficiencyPercent : Float
    }


{-| Default resting human left ventricle model.
-}
defaultPvModel : PvLoopModel
defaultPvModel =
    { eesMmHgPerMl = 2.2
    , v0Ml = 10.0
    , edpvrAlpha = 0.025
    , edpvrBeta = 1.0
    , targetEdvMl = 120.0
    , meanArterialPressureMmHg = 90.0
    , heartRateBpm = 75.0
    }


{-| Evaluate End-Systolic Pressure-Volume Relationship: Pes = Ees * (V - V0).
-}
evaluateEspvr : PvLoopModel -> Float -> Float
evaluateEspvr model volume =
    max 0.0 (model.eesMmHgPerMl * (volume - model.v0Ml))


{-| Evaluate End-Diastolic Pressure-Volume Relationship: Ped = Beta * (e^(Alpha * V) - 1).
-}
evaluateEdpvr : PvLoopModel -> Float -> Float
evaluateEdpvr model volume =
    let
        exponent =
            clamp -10.0 10.0 (model.edpvrAlpha * volume)
    in
    max 0.0 (model.edpvrBeta * ((e ^ exponent) - 1.0))


{-| Compute derived PV loop metrics and energetic indices.
-}
computePvMetrics : PvLoopModel -> PvLoopMetrics
computePvMetrics model =
    let
        edv =
            model.targetEdvMl

        edp =
            evaluateEdpvr model edv

        -- End-systolic pressure approximated from mean arterial pressure (~ 0.9 * MAP + 0.1 * systolic)
        esp =
            model.meanArterialPressureMmHg * 1.05

        -- ESV derived from ESPVR: ESV = V0 + (ESP / Ees)
        esv =
            clamp (model.v0Ml + 5.0) (edv - 5.0) (model.v0Ml + (esp / model.eesMmHgPerMl))

        sv =
            max 1.0 (edv - esv)

        ef =
            (sv / edv) * 100.0

        -- Arterial elastance: Ea = ESP / SV
        ea =
            esp / sv

        ees =
            model.eesMmHgPerMl

        vac =
            ea / ees

        -- Stroke Work (area inside the PV loop)
        strokeWork =
            sv * (esp - edp) * 0.9

        -- Potential Energy: PE = 0.5 * ESP * (ESV - V0)
        potentialEnergy =
            0.5 * esp * max 0.0 (esv - model.v0Ml)

        pva =
            strokeWork + potentialEnergy

        efficiency =
            if pva > 1.0e-3 then
                (strokeWork / pva) * 100.0

            else
                0.0
    in
    { endDiastolicVolumeMl = edv
    , endSystolicVolumeMl = esv
    , strokeVolumeMl = sv
    , ejectionFractionPercent = ef
    , endSystolicPressureMmHg = esp
    , endDiastolicPressureMmHg = edp
    , arterialElastanceEa = ea
    , endSystolicElastanceEes = ees
    , ventriculoArterialCoupling = vac
    , strokeWorkMmhgMl = strokeWork
    , potentialEnergyMmhgMl = potentialEnergy
    , pressureVolumeArea = pva
    , mechanicalEfficiencyPercent = efficiency
    }


{-| Generate an ordered list of 2D points outlining the four phases of the cardiac cycle:
1. Isovolumetric contraction (EDV, EDP -> EDV, ESP)
2. Ejection (EDV, ESP -> ESV, ESP)
3. Isovolumetric relaxation (ESV, ESP -> ESV, EDP)
4. Diastolic filling (ESV, EDP -> EDV, EDP)
-}
generateLoopTrajectory : PvLoopModel -> Int -> List PvCoordinates
generateLoopTrajectory model samplesPerPhase =
    let
        metrics =
            computePvMetrics model

        nFloat =
            toFloat samplesPerPhase

        -- Phase 1: Isovolumetric contraction
        phase1 =
            List.range 0 samplesPerPhase
                |> List.map
                    (\i ->
                        let
                            alpha =
                                toFloat i / nFloat

                            p =
                                metrics.endDiastolicPressureMmHg + alpha * (metrics.endSystolicPressureMmHg - metrics.endDiastolicPressureMmHg)
                        in
                        { volumeMl = metrics.endDiastolicVolumeMl, pressureMmHg = p }
                    )

        -- Phase 2: Systolic ejection
        phase2 =
            List.range 0 samplesPerPhase
                |> List.map
                    (\i ->
                        let
                            alpha =
                                toFloat i / nFloat

                            v =
                                metrics.endDiastolicVolumeMl - alpha * (metrics.endDiastolicVolumeMl - metrics.endSystolicVolumeMl)

                            -- Rounded aortic crest during mid-ejection
                            crest =
                                sin (alpha * pi) * 10.0

                            p =
                                metrics.endSystolicPressureMmHg + crest
                        in
                        { volumeMl = v, pressureMmHg = p }
                    )

        -- Phase 3: Isovolumetric relaxation
        phase3 =
            List.range 0 samplesPerPhase
                |> List.map
                    (\i ->
                        let
                            alpha =
                                toFloat i / nFloat

                            p =
                                metrics.endSystolicPressureMmHg - alpha * (metrics.endSystolicPressureMmHg - metrics.endDiastolicPressureMmHg * 0.5)
                        in
                        { volumeMl = metrics.endSystolicVolumeMl, pressureMmHg = p }
                    )

        -- Phase 4: Diastolic filling
        phase4 =
            List.range 0 samplesPerPhase
                |> List.map
                    (\i ->
                        let
                            alpha =
                                toFloat i / nFloat

                            v =
                                metrics.endSystolicVolumeMl + alpha * (metrics.endDiastolicVolumeMl - metrics.endSystolicVolumeMl)

                            p =
                                evaluateEdpvr model v
                        in
                        { volumeMl = v, pressureMmHg = p }
                    )
    in
    List.concat [ phase1, phase2, phase3, phase4 ]
