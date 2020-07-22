module TestPulseContour exposing (suite)

{-| Verification test suite for arterial blood pressure pulse contour analysis.
Tests MAP computation, stroke volume estimation, and PPV fluid responsiveness classification.
-}

import Dsp.PulseContour as PC
import Expect
import Test exposing (Test, describe, test)


suite : Test
suite =
    describe "Dsp.PulseContour Verification Suite"
        [ test "Liljestrand-Zander stroke volume estimates normal physiological volume" <|
            \_ ->
                let
                    sbp =
                        120.0

                    dbp =
                        80.0

                    -- Systolic area ~13 mmHg*sec
                    area =
                        13.0

                    sv =
                        PC.estimateStrokeVolume sbp dbp area
                in
                -- SV should fall in normal adult resting range (60 to 85 mL)
                Expect.all
                    [ \_ -> Expect.greaterThan 60.0 sv
                    , \_ -> Expect.lessThan 85.0 sv
                    ]
                    ()
        , test "High pulse pressure variation triggers Fluid Responsive classification" <|
            \_ ->
                let
                    -- 8 beats reflecting respiratory swing: PP swings between 32 mmHg and 50 mmHg
                    -- Mean PP = 41, delta = 18, PPV = 18 / 41 = 43.9% (> 13%)
                    makeBeat : Float -> PC.BeatContour
                    makeBeat pp =
                        { systolic = 120.0
                        , pulsePressure = pp
                        , strokeVolume = 70.0
                        , timestamp = 1000.0
                        }

                    swingBeats =
                        [ makeBeat 50.0
                        , makeBeat 48.0
                        , makeBeat 42.0
                        , makeBeat 35.0
                        , makeBeat 32.0
                        , makeBeat 36.0
                        , makeBeat 44.0
                        , makeBeat 50.0
                        ]

                    result =
                        PC.estimateFluidResponsiveness swingBeats
                in
                case result of
                    PC.FluidResponsive ppv ->
                        Expect.greaterThan 13.0 ppv

                    _ ->
                        Expect.fail "Expected FluidResponsive verdict"
        , test "Stable pulse pressure triggers Fluid Non-Responsive classification" <|
            \_ ->
                let
                    makeBeat : Float -> PC.BeatContour
                    makeBeat pp =
                        { systolic = 120.0
                        , pulsePressure = pp
                        , strokeVolume = 70.0
                        , timestamp = 1000.0
                        }

                    -- Minimal variation (PP between 40 and 42 mmHg, PPV = 2 / 41 = 4.8% < 13%)
                    stableBeats =
                        [ makeBeat 40.0
                        , makeBeat 41.0
                        , makeBeat 42.0
                        , makeBeat 41.0
                        , makeBeat 40.0
                        , makeBeat 41.0
                        , makeBeat 42.0
                        , makeBeat 40.0
                        ]

                    result =
                        PC.estimateFluidResponsiveness stableBeats
                in
                case result of
                    PC.FluidNonResponsive ppv ->
                        Expect.lessThan 13.0 ppv

                    _ ->
                        Expect.fail "Expected FluidNonResponsive verdict"
        ]
