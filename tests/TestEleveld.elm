module TestEleveld exposing (suite)

import Expect
import Pharmacokinetics.Eleveld as Eleveld
import Test exposing (Test, describe, test)


suite : Test
suite =
    describe "Pharmacokinetics.Eleveld Test Suite"
        [ test "Adult reference Propofol volume V1 is approximately 6.28 L" <|
            \_ ->
                let
                    params =
                        Eleveld.computeEleveldPropofol Eleveld.defaultAdultCovariates
                in
                Expect.within (Expect.Absolute 0.5) 6.28 params.v1Liters
        , test "Pediatric Propofol parameters scale volume down with body weight" <|
            \_ ->
                let
                    pediatricCov =
                        { ageYears = 6.0
                        , weightKg = 20.0
                        , heightCm = 115.0
                        , sex = Eleveld.Male
                        , samplingSite = Eleveld.Arterial
                        }

                    adultParams =
                        Eleveld.computeEleveldPropofol Eleveld.defaultAdultCovariates

                    pediatricParams =
                        Eleveld.computeEleveldPropofol pediatricCov
                in
                Expect.all
                    [ \_ -> Expect.equal True (pediatricParams.v1Liters < adultParams.v1Liters)
                    , \_ -> Expect.equal True (pediatricParams.cl1LitersPerMin < adultParams.cl1LitersPerMin)
                    ]
                    ()
        , test "Elderly patient has reduced metabolic clearance and increased sensitivity" <|
            \_ ->
                let
                    elderlyCov =
                        { ageYears = 75.0
                        , weightKg = 70.0
                        , heightCm = 170.0
                        , sex = Eleveld.Female
                        , samplingSite = Eleveld.Arterial
                        }

                    adultParams =
                        Eleveld.computeEleveldPropofol Eleveld.defaultAdultCovariates

                    elderlyParams =
                        Eleveld.computeEleveldPropofol elderlyCov
                in
                Expect.all
                    [ \_ -> Expect.equal True (elderlyParams.cl1LitersPerMin < adultParams.cl1LitersPerMin)
                    , \_ -> Expect.equal True (elderlyParams.ce50UgPerMl < adultParams.ce50UgPerMl)
                    ]
                    ()
        , test "Context-Sensitive Half-Time increases with infusion duration" <|
            \_ ->
                let
                    cshtShort =
                        Eleveld.estimateContextSensitiveHalfTime 15.0

                    cshtLong =
                        Eleveld.estimateContextSensitiveHalfTime 180.0
                in
                Expect.equal True (cshtLong > cshtShort)
        ]
