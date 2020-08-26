module Simulation.Patient exposing
    ( ArterialBloodGas
    , ClinicalLabs
    , PatientProfile
    , Sex(..)
    , defaultAbg
    , defaultLabs
    , defaultPatient
    )

{-| Comprehensive ICU patient physiological record and clinical laboratory telemetry.
Contains demographic covariates, baseline hemodynamic parameters, arterial blood gas (ABG) panels,
and standard critical care biochemical markers (troponin, lactate, creatinine).
-}

import Hemodynamics.Calculations as Hemo


{-| Biological sex for covariate-adjusted pharmacokinetic and normal value scaling.
-}
type Sex
    = Male
    | Female


{-| Arterial Blood Gas (ABG) panel measuring oxygenation, ventilation, and acid-base equilibrium.
-}
type alias ArterialBloodGas =
    { ph : Float
    , paCo2Mmhg : Float
    , paO2Mmhg : Float
    , hco3MeqL : Float
    , baseExcessMeqL : Float
    , lactateMmolL : Float
    , saO2Percent : Float
    }


{-| Bedside and central laboratory diagnostic panel.
-}
type alias ClinicalLabs =
    { hemoglobinGDl : Float
    , hematocritPercent : Float
    , plateletCountKUl : Float
    , whiteBloodCellsKUl : Float
    , serumCreatinineMgDl : Float
    , bloodUreaNitrogenMgDl : Float
    , potassiumMeqL : Float
    , sodiumMeqL : Float
    , troponinINgMl : Float
    }


{-| Comprehensive intensive care patient profile.
-}
type alias PatientProfile =
    { id : String
    , bedNumber : Int
    , name : String
    , ageYears : Float
    , sex : Sex
    , weightKg : Float
    , heightCm : Float
    , bsaM2 : Float
    , primaryDiagnosis : String
    , baselineHeartRateBpm : Float
    , baselineSystolicMmhg : Float
    , baselineDiastolicMmhg : Float
    , baselineSpo2Percent : Float
    , baselineEtco2Mmhg : Float
    , baselineCvpMmhg : Float
    , abg : ArterialBloodGas
    , labs : ClinicalLabs
    }


{-| Normal adult resting arterial blood gas panel.
-}
defaultAbg : ArterialBloodGas
defaultAbg =
    { ph = 7.40
    , paCo2Mmhg = 40.0
    , paO2Mmhg = 95.0
    , hco3MeqL = 24.0
    , baseExcessMeqL = 0.0
    , lactateMmolL = 1.0
    , saO2Percent = 98.0
    }


{-| Normal adult clinical laboratory panel.
-}
defaultLabs : ClinicalLabs
defaultLabs =
    { hemoglobinGDl = 14.2
    , hematocritPercent = 42.0
    , plateletCountKUl = 240.0
    , whiteBloodCellsKUl = 7.5
    , serumCreatinineMgDl = 0.9
    , bloodUreaNitrogenMgDl = 14.0
    , potassiumMeqL = 4.2
    , sodiumMeqL = 140.0
    , troponinINgMl = 0.01
    }


{-| Default standard ICU patient profile for Bed 01.
-}
defaultPatient : PatientProfile
defaultPatient =
    let
        w =
            75.0

        h =
            178.0

        bsa =
            Hemo.calculateBsaDubois w h
    in
    { id = "PT-84920"
    , bedNumber = 1
    , name = "Alexander Vance"
    , ageYears = 58.0
    , sex = Male
    , weightKg = w
    , heightCm = h
    , bsaM2 = bsa
    , primaryDiagnosis = "Post-Op Coronary Artery Bypass (CABG x3)"
    , baselineHeartRateBpm = 76.0
    , baselineSystolicMmhg = 122.0
    , baselineDiastolicMmhg = 78.0
    , baselineSpo2Percent = 98.5
    , baselineEtco2Mmhg = 38.0
    , baselineCvpMmhg = 6.0
    , abg = defaultAbg
    , labs = defaultLabs
    }
