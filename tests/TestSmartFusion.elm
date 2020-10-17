module TestSmartFusion exposing (suite)

import Alarms.SmartFusion as SmartFusion
import Alarms.Types as Alarms
import Expect
import Test exposing (Test, describe, test)


suite : Test
suite =
    describe "Alarms.SmartFusion Test Suite"
        [ test "Legitimate asystole without pulse is confirmed as Crisis" <|
            \_ ->
                let
                    input =
                        { ecgHeartRate = 0.0
                        , abpPulseRate = 0.0
                        , ppgPulseRate = 0.0
                        , abpPulsePressure = 2.0
                        , ppgPerfusionIndex = 0.02
                        , etco2Value = 5.0
                        , sqi = SmartFusion.defaultSqi
                        , candidateAlarm = Just ( Alarms.CrisisHighPriority, Alarms.AsystoleCrisis )
                        }

                    result =
                        SmartFusion.fuseAlarms input
                in
                Expect.all
                    [ \_ -> Expect.equal False result.falseAlarmSuppressed
                    , \_ -> Expect.equal (Just ( Alarms.CrisisHighPriority, Alarms.AsystoleCrisis )) result.confirmedAlarm
                    ]
                    ()
        , test "False asystole with active arterial line pulses is suppressed to Technical LeadOff" <|
            \_ ->
                let
                    input =
                        { ecgHeartRate = 0.0
                        , abpPulseRate = 78.0
                        , ppgPulseRate = 78.0
                        , abpPulsePressure = 45.0
                        , ppgPerfusionIndex = 1.8
                        , etco2Value = 38.0
                        , sqi = SmartFusion.defaultSqi
                        , candidateAlarm = Just ( Alarms.CrisisHighPriority, Alarms.AsystoleCrisis )
                        }

                    result =
                        SmartFusion.fuseAlarms input
                in
                Expect.all
                    [ \_ -> Expect.equal True result.falseAlarmSuppressed
                    , \_ -> Expect.equal (Just ( Alarms.TechnicalFailure, Alarms.EcgLeadOff )) result.confirmedAlarm
                    ]
                    ()
        ]
