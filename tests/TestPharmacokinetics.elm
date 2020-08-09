module TestPharmacokinetics exposing (suite)

{-| Verification test suite for multi-compartment pharmacokinetics and pharmacodynamics.
Validates numerical differential integration, TCI bolus calculations, and Hill equation curves.
-}

import Expect
import Pharmacokinetics.Compartment as PK
import Pharmacokinetics.Models as Models
import Pharmacokinetics.Pharmacodynamics as PD
import Pharmacokinetics.Titration as TCI
import Test exposing (Test, describe, test)


suite : Test
suite =
    describe "Pharmacokinetics & Pharmacodynamics Verification Suite"
        [ test "Marsh model scales central volume proportionally with total body weight" <|
            \_ ->
                let
                    cov70 =
                        { ageYears = 45.0, weightKg = 70.0, heightCm = 175.0, isMale = True }

                    cov100 =
                        { ageYears = 45.0, weightKg = 100.0, heightCm = 175.0, isMale = True }

                    p70 =
                        Models.marshPropofolParams cov70

                    p100 =
                        Models.marshPropofolParams cov100
                in
                -- V1 is 0.228 * Weight -> 15.96 L for 70 kg, 22.8 L for 100 kg
                Expect.all
                    [ \_ -> Expect.within (Expect.Absolute 0.1) 15.96 p70.v1Liters
                    , \_ -> Expect.within (Expect.Absolute 0.1) 22.8 p100.v1Liters
                    ]
                    ()
        , test "James formula calculates accurate lean body mass" <|
            \_ ->
                let
                    maleCov =
                        { ageYears = 35.0, weightKg = 80.0, heightCm = 180.0, isMale = True }

                    femaleCov =
                        { ageYears = 35.0, weightKg = 60.0, heightCm = 165.0, isMale = False }

                    lbmMale =
                        Models.calculateLeanBodyMass maleCov

                    lbmFemale =
                        Models.calculateLeanBodyMass femaleCov
                in
                Expect.all
                    [ \_ -> Expect.greaterThan 55.0 lbmMale
                    , \_ -> Expect.lessThan 68.0 lbmMale
                    , \_ -> Expect.greaterThan 40.0 lbmFemale
                    , \_ -> Expect.lessThan 48.0 lbmFemale
                    ]
                    ()
        , test "TCI loading bolus equals target concentration times central volume" <|
            \_ ->
                let
                    cov =
                        { ageYears = 40.0, weightKg = 70.0, heightCm = 175.0, isMale = True }

                    params =
                        Models.marshPropofolParams cov

                    target =
                        4.0

                    -- V1 = 15.96 L = 15960 mL. Bolus = 4.0 mcg/mL * 15960 mL = 63,840 mcg = 63.84 mg
                    bolus =
                        TCI.calculateBolusDose target params
                in
                Expect.within (Expect.Absolute 100.0) 63840.0 bolus
        , test "Three-compartment integration achieves target concentration following bolus" <|
            \_ ->
                let
                    cov =
                        { ageYears = 40.0, weightKg = 70.0, heightCm = 175.0, isMale = True }

                    params =
                        Models.marshPropofolParams cov

                    initSt =
                        PK.initCompartmentState params

                    -- Instantaneous bolus of 63,840 mcg injected into central compartment
                    loadedSt =
                        { initSt | massCentral = 63840.0 }

                    -- Step 0.05 minutes (3 seconds) forward with 0 maintenance
                    ( concs, _ ) =
                        PK.stepCompartment 0.0 0.05 loadedSt
                in
                -- Cp should be very close to 4.0 mcg/mL (slight early distribution)
                Expect.all
                    [ \_ -> Expect.greaterThan 3.8 concs.centralCp
                    , \_ -> Expect.lessThan 4.1 concs.centralCp
                    ]
                    ()
        , test "Bispectral Index Hill equation maps Propofol concentration to clinical depth of anesthesia" <|
            \_ ->
                let
                    bisAwake =
                        PD.calculateBispectralIndex 0.0

                    bisSurgical =
                        PD.calculateBispectralIndex 3.5

                    bisDeep =
                        PD.calculateBispectralIndex 7.0
                in
                Expect.all
                    [ \_ -> Expect.within (Expect.Absolute 1.0) 98.0 bisAwake
                    , \_ -> Expect.greaterThan 35.0 bisSurgical
                    , \_ -> Expect.lessThan 55.0 bisSurgical
                    , \_ -> Expect.lessThan 25.0 bisDeep
                    ]
                    ()
        , test "Norepinephrine Hill equation models dose-dependent vasoconstrictive MAP boost" <|
            \_ ->
                let
                    boostZero =
                        PD.calculateNorepinephrinePressureBoost 0.0

                    boostEc50 =
                        PD.calculateNorepinephrinePressureBoost 2.5

                    boostHigh =
                        PD.calculateNorepinephrinePressureBoost 10.0
                in
                Expect.all
                    [ \_ -> Expect.within (Expect.Absolute 0.1) 0.0 boostZero
                    , \_ -> Expect.within (Expect.Absolute 1.5) 25.0 boostEc50
                    , \_ -> Expect.greaterThan 40.0 boostHigh
                    ]
                    ()
        ]
