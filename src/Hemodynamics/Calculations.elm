module Hemodynamics.Calculations exposing
    ( HemodynamicProfile
    , OxygenTransport
    , calculateBsaDubois
    , calculateBsaMosteller
    , calculateHemodynamics
    , calculateOxygenTransport
    , calculateShockIndex
    , defaultProfile
    )

{-| Advanced clinical hemodynamics calculation engine.
Computes cardiac indices, vascular resistances (systemic and pulmonary), left/right ventricular
stroke work, and oxygen transport dynamics (DO2, VO2, O2ER) according to standard critical care formulas.
-}


{-| Full hemodynamic profile encompassing preload, afterload, contractility, and tissue perfusion.
-}
type alias HemodynamicProfile =
    { bsaM2 : Float
    , cardiacOutputLpm : Float
    , cardiacIndexLpmM2 : Float
    , strokeVolumeMl : Float
    , strokeVolumeIndexMlM2 : Float
    , systemicVascularResistanceDyns : Float
    , systemicVascularResistanceIndexDyns : Float
    , pulmonaryVascularResistanceDyns : Float
    , pulmonaryVascularResistanceIndexDyns : Float
    , leftVentricularStrokeWorkIndexGm : Float
    , shockIndex : Float
    , modifiedShockIndex : Float
    }


{-| Oxygen delivery, consumption, and tissue extraction metrics.
-}
type alias OxygenTransport =
    { arterialOxygenContentMlDl : Float
    , venousOxygenContentMlDl : Float
    , oxygenDeliveryLpm : Float
    , oxygenDeliveryIndexLpmM2 : Float
    , oxygenConsumptionLpm : Float
    , oxygenExtractionRatioPercent : Float
    }


{-| Initial resting normal hemodynamic profile.
-}
defaultProfile : HemodynamicProfile
defaultProfile =
    { bsaM2 = 1.85
    , cardiacOutputLpm = 5.2
    , cardiacIndexLpmM2 = 2.81
    , strokeVolumeMl = 70.0
    , strokeVolumeIndexMlM2 = 37.8
    , systemicVascularResistanceDyns = 1100.0
    , systemicVascularResistanceIndexDyns = 2035.0
    , pulmonaryVascularResistanceDyns = 120.0
    , pulmonaryVascularResistanceIndexDyns = 222.0
    , leftVentricularStrokeWorkIndexGm = 52.0
    , shockIndex = 0.62
    , modifiedShockIndex = 0.81
    }


{-| Body Surface Area (BSA) via the classic DuBois and DuBois formula:
BSA = 0.007184 * Weight^0.425 * Height^0.725 (Weight in kg, Height in cm).
-}
calculateBsaDubois : Float -> Float -> Float
calculateBsaDubois weightKg heightCm =
    if weightKg > 0.0 && heightCm > 0.0 then
        0.007184 * (weightKg ^ 0.425) * (heightCm ^ 0.725)

    else
        1.85


{-| Body Surface Area (BSA) via the Mosteller formula:
BSA = sqrt((Weight * Height) / 3600).
-}
calculateBsaMosteller : Float -> Float -> Float
calculateBsaMosteller weightKg heightCm =
    if weightKg > 0.0 && heightCm > 0.0 then
        sqrt ((weightKg * heightCm) / 3600.0)

    else
        1.85


{-| Compute comprehensive hemodynamic profile from bedside pressures and flow parameters.
Requires Heart Rate (BPM), Mean Arterial Pressure (mmHg), Central Venous Pressure (mmHg),
Systolic Blood Pressure (mmHg), Mean Pulmonary Artery Pressure (mmHg), Pulmonary Capillary
Wedge Pressure (mmHg), Stroke Volume (mL), and Body Surface Area (m^2).
-}
calculateHemodynamics :
    Float
    -> Float
    -> Float
    -> Float
    -> Float
    -> Float
    -> Float
    -> Float
    -> HemodynamicProfile
calculateHemodynamics hr map cvp sbp mpap pcwp sv bsa =
    let
        safeBsa =
            max 0.5 bsa

        safeHr =
            max 10.0 hr

        -- Cardiac Output (L/min) = (HR * SV) / 1000
        co =
            (safeHr * sv) / 1000.0

        safeCo =
            max 0.1 co

        -- Cardiac Index (L/min/m^2)
        ci =
            co / safeBsa

        -- Stroke Volume Index (mL/m^2)
        svi =
            sv / safeBsa

        -- Systemic Vascular Resistance (dyn*s/cm^5) = ((MAP - CVP) / CO) * 80
        svr =
            max 100.0 (((map - cvp) / safeCo) * 80.0)

        -- Systemic Vascular Resistance Index (dyn*s*m^2/cm^5)
        svri =
            svr * safeBsa

        -- Pulmonary Vascular Resistance (dyn*s/cm^5) = ((MPAP - PCWP) / CO) * 80
        pvr =
            max 20.0 (((mpap - pcwp) / safeCo) * 80.0)

        -- Pulmonary Vascular Resistance Index
        pvri =
            pvr * safeBsa

        -- Left Ventricular Stroke Work Index (g*m/m^2) = 0.0136 * SVI * (MAP - PCWP)
        lvswi =
            max 0.0 (0.0136 * svi * (map - pcwp))

        -- Shock Index = HR / SBP
        safeSbp =
            max 10.0 sbp

        si =
            hr / safeSbp

        -- Modified Shock Index = HR / MAP
        safeMap =
            max 10.0 map

        msi =
            hr / safeMap
    in
    { bsaM2 = safeBsa
    , cardiacOutputLpm = co
    , cardiacIndexLpmM2 = ci
    , strokeVolumeMl = sv
    , strokeVolumeIndexMlM2 = svi
    , systemicVascularResistanceDyns = svr
    , systemicVascularResistanceIndexDyns = svri
    , pulmonaryVascularResistanceDyns = pvr
    , pulmonaryVascularResistanceIndexDyns = pvri
    , leftVentricularStrokeWorkIndexGm = lvswi
    , shockIndex = si
    , modifiedShockIndex = msi
    }


{-| Calculate clinical shock index (SI = HR / SBP).
Values > 0.9 indicate occult shock and impending hypoperfusion.
-}
calculateShockIndex : Float -> Float -> Float
calculateShockIndex hr sbp =
    if sbp > 0.0 then
        hr / sbp

    else
        0.0


{-| Compute oxygen transport metrics using Fick principle.
Hemoglobin (g/dL), arterial oxygen saturation SaO2 (%), mixed venous saturation SvO2 (%),
arterial PaO2 (mmHg), venous PvO2 (mmHg), Cardiac Output (L/min), and BSA (m^2).
-}
calculateOxygenTransport :
    Float
    -> Float
    -> Float
    -> Float
    -> Float
    -> Float
    -> Float
    -> OxygenTransport
calculateOxygenTransport hb sao2Percent svo2Percent pao2 pvo2 co bsa =
    let
        safeBsa =
            max 0.5 bsa

        safeCo =
            max 0.1 co

        -- Arterial Oxygen Content (mL/dL): CaO2 = (Hb * 1.34 * SaO2/100) + (PaO2 * 0.0031)
        cao2 =
            (hb * 1.34 * (sao2Percent / 100.0)) + (pao2 * 0.0031)

        -- Venous Oxygen Content (mL/dL): CvO2 = (Hb * 1.34 * SvO2/100) + (PvO2 * 0.0031)
        cvo2 =
            (hb * 1.34 * (svo2Percent / 100.0)) + (pvo2 * 0.0031)

        -- Oxygen Delivery (mL/min): DO2 = CO * CaO2 * 10
        do2 =
            safeCo * cao2 * 10.0

        -- Oxygen Delivery Index (mL/min/m^2): DO2I = DO2 / BSA
        do2i =
            do2 / safeBsa

        -- Oxygen Consumption (mL/min): VO2 = CO * (CaO2 - CvO2) * 10
        vo2 =
            safeCo * (cao2 - cvo2) * 10.0

        -- Oxygen Extraction Ratio (%): O2ER = (VO2 / DO2) * 100
        o2er =
            if do2 > 0.0 then
                (vo2 / do2) * 100.0

            else
                0.0
    in
    { arterialOxygenContentMlDl = cao2
    , venousOxygenContentMlDl = cvo2
    , oxygenDeliveryLpm = do2
    , oxygenDeliveryIndexLpmM2 = do2i
    , oxygenConsumptionLpm = vo2
    , oxygenExtractionRatioPercent = o2er
    }
