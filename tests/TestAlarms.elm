module TestAlarms exposing (suite)

{-| Verification test suite for IEC 60601-1-8 medical alarm management and smart sensor fusion.
Validates multi-parameter false alarm suppression, priority scheduling, and NEWS2 scoring.
-}

import Alarms.EarlyWarning as EW
import Alarms.Manager as AM
import Alarms.Types as AT
import Dsp.Arrhythmia exposing (ArrhythmiaType(..))
import Expect
import Test exposing (Test, describe, test)


suite : Test
suite =
    describe "Alarms & Clinical Decision Support Verification Suite"
        [ test "Multi-sensor fusion suppresses false asystole when mechanical arterial pulses persist" <|
            \_ ->
                let
                    mgr =
                        AM.emptyAlarmManager

                    -- Patient shows Asystole on ECG, but SBP is 118 mmHg with active PPG pulse
                    evaluated =
                        AM.evaluateVitals Asystole 75.0 118.0 76.0 90.0 98.0 38.0 True 1000.0 mgr

                    highest =
                        AM.getHighestPriorityAlarm evaluated
                in
                -- Should NOT be a Crisis Asystole alarm; must be downgraded to Technical Lead Off
                case highest of
                    Just alarm ->
                        Expect.all
                            [ \_ -> Expect.equal AT.TechnicalFailure alarm.priority
                            , \_ -> Expect.equal "ECG_LEAD_OFF" alarm.id
                            ]
                            ()

                    Nothing ->
                        Expect.fail "Expected Lead Off alert to be generated"
        , test "True asystole with hemodynamic collapse triggers Crisis High Priority alarm and latches" <|
            \_ ->
                let
                    mgr =
                        AM.emptyAlarmManager

                    -- Patient shows Asystole and SBP is 0 mmHg with no PPG pulse
                    evaluated =
                        AM.evaluateVitals Asystole 0.0 0.0 0.0 0.0 0.0 0.0 False 1000.0 mgr

                    highest =
                        AM.getHighestPriorityAlarm evaluated
                in
                case highest of
                    Just alarm ->
                        Expect.all
                            [ \_ -> Expect.equal AT.CrisisHighPriority alarm.priority
                            , \_ -> Expect.equal "ASYSTOLE_CRISIS" alarm.id
                            , \_ -> Expect.equal True alarm.isLatched
                            ]
                            ()

                    Nothing ->
                        Expect.fail "Expected Asystole crisis alarm"
        , test "Alarm silence timer mutes audio for 120 seconds then restores audible alert" <|
            \_ ->
                let
                    mgr =
                        AM.emptyAlarmManager
                            |> AM.evaluateVitals VentricularFibrillation 0.0 0.0 0.0 0.0 0.0 0.0 False 1000.0

                    -- Silence for 120 seconds
                    silenced =
                        AM.silenceAlarms 120.0 mgr

                    -- Tick 60 seconds (60 seconds remaining)
                    ticked60 =
                        AM.tickSilenceTimer 60.0 silenced

                    -- Tick another 65 seconds (timer expires)
                    ticked125 =
                        AM.tickSilenceTimer 65.0 ticked60

                    alarmAfterExpiry =
                        AM.getHighestPriorityAlarm ticked125
                in
                Expect.all
                    [ \_ -> Expect.equal True silenced.isAudioSilenced
                    , \_ -> Expect.equal 60.0 ticked60.silenceRemainingSec
                    , \_ -> Expect.equal False ticked125.isAudioSilenced
                    , \_ ->
                        case alarmAfterExpiry of
                            Just a ->
                                Expect.equal False a.isSilenced

                            Nothing ->
                                Expect.fail "Expected active alarm after timer expiry"
                    ]
                    ()
        , test "NEWS2 clinical score identifies high-risk deteriorating patient" <|
            \_ ->
                let
                    -- Severe sepsis: RR = 28 (3 pts), SpO2 = 89% (3 pts), O2 = True (2 pts),
                    -- SBP = 88 (3 pts), HR = 135 (3 pts), AVPU = Confusion (3 pts), Temp = 39.2 (2 pts)
                    -- Total score = 3 + 3 + 2 + 3 + 3 + 3 + 2 = 19 points (High Risk)
                    score =
                        EW.calculateNews2 28.0 89.0 False 88.0 135.0 EW.VoiceResponsive 39.2

                    riskTier =
                        EW.news2RiskTier score.totalScore
                in
                Expect.all
                    [ \_ -> Expect.equal 19 score.totalScore
                    , \_ -> Expect.equal "High Risk: Urgent Critical Care Outreach Response" riskTier
                    ]
                    ()
        , test "SOFA cardiovascular score reflects high-dose norepinephrine infusion" <|
            \_ ->
                let
                    -- MAP = 58 mmHg, Norepinephrine = 0.25 mcg/kg/min -> Score 4
                    sofaCv =
                        EW.calculateSofaCardiovascular 58.0 0.0 0.0 0.25
                in
                Expect.equal 4 sofaCv
        ]
