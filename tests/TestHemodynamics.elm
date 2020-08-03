module TestHemodynamics exposing (suite)

{-| Verification test suite for advanced hemodynamics and oxygen transport calculations.
Validates BSA, SVR, Cardiac Index, Fick principle DO2/VO2, and VIS score.
-}

import Expect
import Hemodynamics.Calculations as Hemo
import Hemodynamics.Targets as Targets
import Test exposing (Test, describe, test)


suite : Test
suite =
    describe "Hemodynamics Verification Suite"
        [ test "DuBois and Mosteller BSA compute close agreement for standard adult" <|
            \_ ->
                let
                    weight =
                        70.0

                    height =
                        175.0

                    dubois =
                        Hemo.calculateBsaDubois weight height

                    mosteller =
                        Hemo.calculateBsaMosteller weight height
                in
                -- Both formulas should calculate ~1.84 to 1.85 m^2 within 2% of each other
                Expect.all
                    [ \_ -> Expect.within (Expect.Absolute 0.05) 1.85 dubois
                    , \_ -> Expect.within (Expect.Absolute 0.05) 1.85 mosteller
                    ]
                    ()
        , test "Systemic Vascular Resistance accurately scales with pressure gradient and flow" <|
            \_ ->
                let
                    -- MAP = 90 mmHg, CVP = 5 mmHg, HR = 75, SV = 70 mL (CO = 5.25 L/min)
                    -- SVR = ((90 - 5) / 5.25) * 80 = (85 / 5.25) * 80 = 1295 dyn*s/cm^5
                    prof =
                        Hemo.calculateHemodynamics 75.0 90.0 5.0 120.0 20.0 10.0 70.0 1.85
                in
                Expect.within (Expect.Absolute 10.0) 1295.0 prof.systemicVascularResistanceDyns
        , test "Fick oxygen delivery DO2 and consumption VO2 compute accurate physiological values" <|
            \_ ->
                let
                    -- Hb = 14 g/dL, SaO2 = 99%, SvO2 = 74%, PaO2 = 95 mmHg, PvO2 = 40 mmHg, CO = 5.0 L/min, BSA = 1.8 m^2
                    -- CaO2 = (14 * 1.34 * 0.99) + (95 * 0.0031) = 18.57 + 0.29 = 18.86 mL/dL
                    -- DO2 = 5.0 * 18.86 * 10 = 943 mL/min
                    o2 =
                        Hemo.calculateOxygenTransport 14.0 99.0 74.0 95.0 40.0 5.0 1.8
                in
                Expect.all
                    [ \_ -> Expect.within (Expect.Absolute 20.0) 943.0 o2.oxygenDeliveryLpm
                    , \_ -> Expect.greaterThan 20.0 o2.oxygenExtractionRatioPercent
                    , \_ -> Expect.lessThan 30.0 o2.oxygenExtractionRatioPercent
                    ]
                    ()
        , test "Vasoactive-Inotropic Score computes exact weighted sum" <|
            \_ ->
                let
                    doses =
                        { dopamineMcgKgMin = 0.0
                        , dobutamineMcgKgMin = 5.0
                        , epinephrineMcgKgMin = 0.0
                        , norepinephrineMcgKgMin = 0.15
                        , milrinoneMcgKgMin = 0.0
                        , vasopressinUnitsKgMin = 0.0003
                        }

                    -- VIS = 5.0 + 0 + 0 + (100 * 0.15 = 15.0) + 0 + (10000 * 0.0003 = 3.0) = 23.0
                    vis =
                        Targets.calculateVis doses
                in
                Expect.within (Expect.Absolute 0.1) 23.0 vis
        , test "Septic shock hemodynamics classify as DistributiveSepticShock" <|
            \_ ->
                let
                    -- Hyperdynamic sepsis: HR = 120, SBP = 85 (SI = 1.41 > 0.9), MAP = 55, CVP = 4, SV = 80 mL (CO = 9.6 L/min, CI = 5.18, SVR = 425 dyn*s/cm^5)
                    prof =
                        Hemo.calculateHemodynamics 120.0 55.0 4.0 85.0 18.0 8.0 80.0 1.85

                    state =
                        Targets.classifyHemodynamicState prof 4.0
                in
                Expect.equal Targets.DistributiveSepticShock state
        ]
