module TestPressureVolumeLoop exposing (suite)

import Expect
import Hemodynamics.PressureVolumeLoop as Pv
import Test exposing (Test, describe, test)


suite : Test
suite =
    describe "Hemodynamics.PressureVolumeLoop Test Suite"
        [ test "ESPVR slope scales linearly with inotropy" <|
            \_ ->
                let
                    baseModel =
                        Pv.defaultPvModel

                    inotropicModel =
                        { baseModel | eesMmHgPerMl = 4.0 }

                    pBase =
                        Pv.evaluateEspvr baseModel 50.0

                    pIno =
                        Pv.evaluateEspvr inotropicModel 50.0
                in
                Expect.equal True (pIno > pBase)
        , test "EDPVR curve shows nonlinear exponential diastolic stiffening" <|
            \_ ->
                let
                    model =
                        Pv.defaultPvModel

                    pLow =
                        Pv.evaluateEdpvr model 60.0

                    pMid =
                        Pv.evaluateEdpvr model 100.0

                    pHigh =
                        Pv.evaluateEdpvr model 140.0

                    delta1 =
                        pMid - pLow

                    delta2 =
                        pHigh - pMid
                in
                -- Delta2 should exceed Delta1 due to exponential upward curvature
                Expect.equal True (delta2 > delta1)
        , test "Default model produces normal physiological ejection fraction" <|
            \_ ->
                let
                    metrics =
                        Pv.computePvMetrics Pv.defaultPvModel
                in
                Expect.all
                    [ \_ -> Expect.equal True (metrics.ejectionFractionPercent >= 50.0)
                    , \_ -> Expect.equal True (metrics.ejectionFractionPercent <= 75.0)
                    , \_ -> Expect.equal True (metrics.ventriculoArterialCoupling >= 0.5)
                    , \_ -> Expect.equal True (metrics.ventriculoArterialCoupling <= 2.0)
                    ]
                    ()
        , test "Loop trajectory produces contiguous 4-phase closed loop" <|
            \_ ->
                let
                    trajectory =
                        Pv.generateLoopTrajectory Pv.defaultPvModel 10
                in
                -- 4 phases * 11 points each = 44 points
                Expect.equal 44 (List.length trajectory)
        ]
