module TestCapnography exposing (suite)

{-| Verification test suite for capnogram segmentation and respiratory analysis.
Tests EtCO2 extraction, shark-fin bronchospasm detection, and dead space fraction math.
-}

import Dsp.Capnography as Capno
import Expect
import Test exposing (Test, describe, test)


suite : Test
suite =
    describe "Dsp.Capnography Verification Suite"
        [ test "Bohr-Enghoff equation estimates normal dead space fraction" <|
            \_ ->
                let
                    paCo2 =
                        40.0

                    petCo2 =
                        36.0

                    -- (40 - 36) / 40 = 0.10 dead space fraction
                    vdVt =
                        Capno.estimateDeadSpaceFraction paCo2 petCo2
                in
                Expect.within (Expect.Absolute 0.01) 0.10 vdVt
        , test "Bohr-Enghoff equation detects elevated dead space in ventilation-perfusion mismatch" <|
            \_ ->
                let
                    paCo2 =
                        50.0

                    petCo2 =
                        25.0

                    -- (50 - 25) / 50 = 0.50 (severe dead space)
                    vdVt =
                        Capno.estimateDeadSpaceFraction paCo2 petCo2
                in
                Expect.within (Expect.Absolute 0.01) 0.50 vdVt
        , test "High Phase III slope triggers shark-fin bronchospasm alert" <|
            \_ ->
                let
                    feature : Capno.CapnoFeature
                    feature =
                        { etco2Mmhg = 48.0
                        , respiratoryRateBpm = 18.0
                        , alphaAngleDeg = 138.0
                        , betaAngleDeg = 92.0
                        , phase3SlopeMmhgSec = 22.0
                        , isSharkFinBronchospasm = True
                        , timestamp = 12000.0
                        }
                in
                Expect.equal True (Capno.isBronchospasmSharkFin feature)
        ]
