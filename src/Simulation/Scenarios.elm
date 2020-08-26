module Simulation.Scenarios exposing
    ( ClinicalScenario(..)
    , ScenarioDefinition
    , allScenarios
    , getScenarioDefinition
    , scenarioToString
    )

{-| High-acuity ICU clinical emergency simulation scenarios.
Models pathophysiology, dynamic vital sign trajectories, and therapeutic intervention targets
for acute myocardial infarction, septic shock, tension pneumothorax, and pharmacologic toxicity.
-}


{-| Enumeration of supported simulation emergency scenarios.
-}
type ClinicalScenario
    = BaselineNominal
    | AcuteAnteriorStemi
    | SepticShockDistributive
    | TensionPneumothorax
    | HypovolemicHemorrhage
    | OpioidRespiratoryDepression
    | MalignantHyperthermiaCrisis


{-| Ordered enumeration of all scenarios for UI selection.
-}
allScenarios : List ClinicalScenario
allScenarios =
    [ BaselineNominal
    , AcuteAnteriorStemi
    , SepticShockDistributive
    , TensionPneumothorax
    , HypovolemicHemorrhage
    , OpioidRespiratoryDepression
    , MalignantHyperthermiaCrisis
    ]


{-| Detailed configuration and physiological targets for a clinical scenario.
-}
type alias ScenarioDefinition =
    { scenario : ClinicalScenario
    , title : String
    , clinicalDescription : String
    , heartRateBpm : Float
    , systolicMmhg : Float
    , diastolicMmhg : Float
    , spo2Percent : Float
    , etco2Mmhg : Float
    , cvpMmhg : Float
    , stElevationMv : Float
    , temperatureC : Float
    , recommendedIntervention : String
    }


{-| Clinical string title for display.
-}
scenarioToString : ClinicalScenario -> String
scenarioToString s =
    case s of
        BaselineNominal ->
            "Nominal Resting Baseline"

        AcuteAnteriorStemi ->
            "Acute Anterior STEMI"

        SepticShockDistributive ->
            "Severe Septic Shock"

        TensionPneumothorax ->
            "Tension Pneumothorax"

        HypovolemicHemorrhage ->
            "Hemorrhagic Shock Class III"

        OpioidRespiratoryDepression ->
            "Opioid Overdose / Bradypnea"

        MalignantHyperthermiaCrisis ->
            "Malignant Hyperthermia Crisis"


{-| Retrieve clinical parameter definitions for a scenario.
-}
getScenarioDefinition : ClinicalScenario -> ScenarioDefinition
getScenarioDefinition s =
    case s of
        BaselineNominal ->
            { scenario = BaselineNominal
            , title = "Nominal Resting Baseline"
            , clinicalDescription = "Euvolemic adult resting in ICU following elective surgery. Normal hemodynamics."
            , heartRateBpm = 75.0
            , systolicMmhg = 120.0
            , diastolicMmhg = 80.0
            , spo2Percent = 98.5
            , etco2Mmhg = 38.0
            , cvpMmhg = 6.0
            , stElevationMv = 0.0
            , temperatureC = 37.0
            , recommendedIntervention = "Continue routine monitoring and maintenance hydration."
            }

        AcuteAnteriorStemi ->
            { scenario = AcuteAnteriorStemi
            , title = "Acute Anterior STEMI"
            , clinicalDescription = "Acute coronary syndrome with occlusion of left anterior descending artery. ST elevation in V1-V4."
            , heartRateBpm = 108.0
            , systolicMmhg = 102.0
            , diastolicMmhg = 68.0
            , spo2Percent = 94.0
            , etco2Mmhg = 35.0
            , cvpMmhg = 10.0
            , stElevationMv = 0.35
            , temperatureC = 37.2
            , recommendedIntervention = "Activate emergency cardiac catheterization lab, administer dual antiplatelet and heparin."
            }

        SepticShockDistributive ->
            { scenario = SepticShockDistributive
            , title = "Severe Septic Shock"
            , clinicalDescription = "Hyperdynamic distributive shock secondary to urosepsis. Profound vasodilation and low SVR."
            , heartRateBpm = 125.0
            , systolicMmhg = 82.0
            , diastolicMmhg = 42.0
            , spo2Percent = 92.0
            , etco2Mmhg = 28.0
            , cvpMmhg = 4.0
            , stElevationMv = 0.02
            , temperatureC = 39.4
            , recommendedIntervention = "Crystalloid fluid bolus 30 mL/kg, initiate Norepinephrine infusion, broad-spectrum antibiotics."
            }

        TensionPneumothorax ->
            { scenario = TensionPneumothorax
            , title = "Tension Pneumothorax"
            , clinicalDescription = "Right-sided tension pneumothorax under positive pressure ventilation. Mediastinal shift and venous collapse."
            , heartRateBpm = 142.0
            , systolicMmhg = 74.0
            , diastolicMmhg = 48.0
            , spo2Percent = 76.0
            , etco2Mmhg = 16.0
            , cvpMmhg = 18.0
            , stElevationMv = 0.0
            , temperatureC = 37.0
            , recommendedIntervention = "Immediate needle thoracostomy decompression in second intercostal space, followed by chest tube."
            }

        HypovolemicHemorrhage ->
            { scenario = HypovolemicHemorrhage
            , title = "Hemorrhagic Shock Class III"
            , clinicalDescription = "Acute retroperitoneal hemorrhage. Significant intravascular volume depletion with tachycardia."
            , heartRateBpm = 132.0
            , systolicMmhg = 88.0
            , diastolicMmhg = 72.0
            , spo2Percent = 93.0
            , etco2Mmhg = 26.0
            , cvpMmhg = 2.0
            , stElevationMv = 0.0
            , temperatureC = 35.8
            , recommendedIntervention = "Initiate massive transfusion protocol (1:1:1 PRBC, FFP, platelets), tranexamic acid."
            }

        OpioidRespiratoryDepression ->
            { scenario = OpioidRespiratoryDepression
            , title = "Opioid Overdose / Bradypnea"
            , clinicalDescription = "Postoperative opioid accumulation. Severe central respiratory drive depression and hypercapnia."
            , heartRateBpm = 52.0
            , systolicMmhg = 104.0
            , diastolicMmhg = 64.0
            , spo2Percent = 84.0
            , etco2Mmhg = 64.0
            , cvpMmhg = 7.0
            , stElevationMv = 0.0
            , temperatureC = 36.4
            , recommendedIntervention = "Titrate IV Naloxone in 40 mcg increments, bag-valve-mask ventilatory support."
            }

        MalignantHyperthermiaCrisis ->
            { scenario = MalignantHyperthermiaCrisis
            , title = "Malignant Hyperthermia Crisis"
            , clinicalDescription = "Hypermetabolic crisis triggered by volatile anesthetic exposure. Uncontrolled sarcoplasmic calcium release."
            , heartRateBpm = 158.0
            , systolicMmhg = 148.0
            , diastolicMmhg = 96.0
            , spo2Percent = 90.0
            , etco2Mmhg = 82.0
            , cvpMmhg = 12.0
            , stElevationMv = 0.05
            , temperatureC = 41.2
            , recommendedIntervention = "Discontinue triggering agents, hyperventilate with 100% O2, administer IV Dantrolene 2.5 mg/kg."
            }
