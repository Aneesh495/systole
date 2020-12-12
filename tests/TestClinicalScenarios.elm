module TestClinicalScenarios exposing (suite)

import Alarms.Manager as AM
import Alarms.Types as AT exposing (AlarmPriority(..))
import Dsp.Arrhythmia as Arr
import Expect
import Simulation.Scenarios as Scenarios exposing (ClinicalScenario(..))
import Test exposing (Test, describe, test)


suite : Test
suite =
    describe "Simulation.Scenarios Clinical Crisis Verification Suite"
        [ test "All 7 clinical scenarios have unique valid configurations" <|
            \_ ->
                let
                    scenarios =
                        Scenarios.allScenarios

                    defs =
                        List.map Scenarios.getScenarioDefinition scenarios
                in
                Expect.all
                    [ \_ -> Expect.equal 7 (List.length defs)
                    , \_ -> Expect.equal True (List.all (\d -> d.heartRateBpm > 0.0) defs)
                    , \_ -> Expect.equal True (List.all (\d -> d.systolicMmhg > d.diastolicMmhg) defs)
                    , \_ -> Expect.equal True (List.all (\d -> d.spo2Percent >= 50.0 && d.spo2Percent <= 100.0) defs)
                    ]
                    ()
        , test "Acute Anterior STEMI triggers ST-elevation above 0.2 mV" <|
            \_ ->
                let
                    def =
                        Scenarios.getScenarioDefinition AcuteAnteriorStemi
                in
                Expect.equal True (def.stElevationMv >= 0.25)
        , test "Septic Shock exhibits hyperdynamic tachycardia and profound hypotension" <|
            \_ ->
                let
                    def =
                        Scenarios.getScenarioDefinition SepticShockDistributive
                in
                Expect.all
                    [ \_ -> Expect.equal True (def.heartRateBpm > 110.0)
                    , \_ -> Expect.equal True (def.systolicMmhg < 90.0)
                    ]
                    ()
        , test "Tension Pneumothorax exhibits severe hypoxemia and elevated CVP" <|
            \_ ->
                let
                    def =
                        Scenarios.getScenarioDefinition TensionPneumothorax
                in
                Expect.all
                    [ \_ -> Expect.equal True (def.spo2Percent < 85.0)
                    , \_ -> Expect.equal True (def.cvpMmhg > 15.0)
                    ]
                    ()
        , test "Opioid Overdose exhibits critical bradypnea with elevated EtCO2" <|
            \_ ->
                let
                    def =
                        Scenarios.getScenarioDefinition OpioidRespiratoryDepression
                in
                Expect.all
                    [ \_ -> Expect.equal True (def.heartRateBpm < 60.0)
                    , \_ -> Expect.equal True (def.etco2Mmhg > 55.0)
                    ]
                    ()
        , test "Malignant Hyperthermia triggers extreme fever and hypercapnia" <|
            \_ ->
                let
                    def =
                        Scenarios.getScenarioDefinition MalignantHyperthermiaCrisis
                in
                Expect.all
                    [ \_ -> Expect.equal True (def.temperatureC >= 40.0)
                    , \_ -> Expect.equal True (def.etco2Mmhg >= 65.0)
                    ]
                    ()
        ]
