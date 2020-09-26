module TestRespiration exposing (suite)

import Dsp.Respiration as Resp
import Expect
import Test exposing (Test, describe, test)


suite : Test
suite =
    describe "Dsp.Respiration Test Suite"
        [ test "Initial state has normal baseline impedance" <|
            \_ ->
                let
                    st =
                        Resp.initRespirationState 200.0
                in
                Expect.equal 500.0 st.baselineZ0
        , test "RSBI calculation with normal parameters" <|
            \_ ->
                -- Rate 15 bpm, Vt 500 mL -> RSBI = 15 / 0.5 = 30 breaths/min/L
                let
                    rsbi =
                        Resp.computeRsbi 15.0 500.0
                in
                Expect.within (Expect.Absolute 0.1) 30.0 rsbi
        , test "RSBI calculation with shallow rapid tachypneic breathing" <|
            \_ ->
                -- Rate 35 bpm, Vt 250 mL -> RSBI = 35 / 0.25 = 140 breaths/min/L (severe weaning failure)
                let
                    rsbi =
                        Resp.computeRsbi 35.0 250.0
                in
                Expect.within (Expect.Absolute 0.1) 140.0 rsbi
        , test "Apnea crisis triggers when breath interval exceeds 20 seconds" <|
            \_ ->
                let
                    initialState =
                        Resp.initRespirationState 50.0

                    -- Feed constant baseline impedance with no breaths for 22 seconds (22 * 50 = 1100 samples)
                    folder _ ( _, currentState ) =
                        Resp.stepRespiration 500.0 currentState

                    ( finalMetrics, _ ) =
                        List.foldl folder ( { respiratoryRateBpm = 0.0, tidalVolumeEstimateMl = 0.0, currentPhase = Resp.PausePhase, apneaStatus = Resp.BreathingNormal, baselineImpedanceOhms = 500.0 }, initialState ) (List.range 1 1100)
                in
                case finalMetrics.apneaStatus of
                    Resp.ApneaCrisis dur ->
                        Expect.equal True (dur >= 20.0)

                    _ ->
                        Expect.fail "Expected ApneaCrisis after 22 seconds without a breath"
        ]
