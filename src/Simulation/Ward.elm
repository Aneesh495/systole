module Simulation.Ward exposing
    ( BedState
    , WardState
    , getBed
    , initWard
    , selectBed
    , updateBedVitals
    )

{-| Intensive Care Unit ward registry coordinating multi-bed telemetry.
Maintains state for Beds 01 through 08 with simultaneous simulation instances,
vital sign parameters, active alarm flags, and bed selection for central monitoring.
-}

import Simulation.Patient exposing (PatientProfile, Sex(..), defaultAbg, defaultLabs)
import Simulation.Scenarios exposing (ClinicalScenario(..))


{-| Bedside monitor state for an individual ICU bed.
-}
type alias BedState =
    { bedNumber : Int
    , patient : PatientProfile
    , scenario : ClinicalScenario
    , heartRateBpm : Float
    , systolicMmhg : Float
    , diastolicMmhg : Float
    , meanMmhg : Float
    , spo2Percent : Float
    , etco2Mmhg : Float
    , cvpMmhg : Float
    , hasActiveCrisis : Bool
    , hasActiveWarning : Bool
    , primaryRhythmString : String
    }


{-| Aggregate 8-bed intensive care unit state.
-}
type alias WardState =
    { beds : List BedState
    , selectedBedNumber : Int
    }


{-| Initialize the 8-bed intensive care unit with realistic patient profiles.
-}
initWard : WardState
initWard =
    let
        bed1 =
            createBed 1 "Alexander Vance" 58 Male 75.0 178.0 "Post-Op CABG x3" BaselineNominal 76.0 122.0 78.0 98.5 38.0 6.0

        bed2 =
            createBed 2 "Eleanor Wright" 67 Female 64.0 162.0 "Acute Anterior STEMI" AcuteAnteriorStemi 108.0 102.0 68.0 94.0 35.0 10.0

        bed3 =
            createBed 3 "Marcus Thorne" 44 Male 88.0 185.0 "Polytrauma / Hemorrhagic Shock" HypovolemicHemorrhage 132.0 88.0 72.0 93.0 26.0 2.0

        bed4 =
            createBed 4 "Priya Sharma" 52 Female 59.0 160.0 "Severe Uroseptic Shock" SepticShockDistributive 125.0 82.0 42.0 92.0 28.0 4.0

        bed5 =
            createBed 5 "Liam Gallagher" 71 Male 78.0 174.0 "COPD Exacerbation / ARDS" BaselineNominal 84.0 134.0 82.0 95.0 44.0 8.0

        bed6 =
            createBed 6 "Sophia Chen" 31 Female 54.0 165.0 "Post-Op Opioid Monitoring" OpioidRespiratoryDepression 52.0 104.0 64.0 84.0 64.0 7.0

        bed7 =
            createBed 7 "David Miller" 64 Male 92.0 180.0 "Acute Decompensated Heart Failure" BaselineNominal 92.0 148.0 92.0 96.0 40.0 14.0

        bed8 =
            createBed 8 "Isabella Santos" 23 Female 58.0 168.0 "Traumatic Brain Injury / ICP Monitor" BaselineNominal 72.0 128.0 76.0 99.0 36.0 5.0
    in
    { beds = [ bed1, bed2, bed3, bed4, bed5, bed6, bed7, bed8 ]
    , selectedBedNumber = 1
    }


createBed :
    Int
    -> String
    -> Float
    -> Sex
    -> Float
    -> Float
    -> String
    -> ClinicalScenario
    -> Float
    -> Float
    -> Float
    -> Float
    -> Float
    -> Float
    -> BedState
createBed num name age sex weight height diag scen hr sbp dbp spo2 etco2 cvp =
    let
        bsa =
            0.007184 * (weight ^ 0.425) * (height ^ 0.725)

        map =
            dbp + ((sbp - dbp) / 3.0)

        patient =
            { id = "PT-" ++ String.fromInt (84900 + num)
            , bedNumber = num
            , name = name
            , ageYears = age
            , sex = sex
            , weightKg = weight
            , heightCm = height
            , bsaM2 = bsa
            , primaryDiagnosis = diag
            , baselineHeartRateBpm = hr
            , baselineSystolicMmhg = sbp
            , baselineDiastolicMmhg = dbp
            , baselineSpo2Percent = spo2
            , baselineEtco2Mmhg = etco2
            , baselineCvpMmhg = cvp
            , abg = defaultAbg
            , labs = defaultLabs
            }
    in
    { bedNumber = num
    , patient = patient
    , scenario = scen
    , heartRateBpm = hr
    , systolicMmhg = sbp
    , diastolicMmhg = dbp
    , meanMmhg = map
    , spo2Percent = spo2
    , etco2Mmhg = etco2
    , cvpMmhg = cvp
    , hasActiveCrisis = False
    , hasActiveWarning = False
    , primaryRhythmString = "Normal Sinus Rhythm"
    }


{-| Select an active bed number for deep-dive waveform inspection.
-}
selectBed : Int -> WardState -> WardState
selectBed bedNum ward =
    { ward | selectedBedNumber = clamp 1 8 bedNum }


{-| Retrieve the bed state for the given bed number.
-}
getBed : Int -> WardState -> Maybe BedState
getBed bedNum ward =
    ward.beds
        |> List.filter (\b -> b.bedNumber == bedNum)
        |> List.head


{-| Update dynamic vital parameters for a specific bed in the ward.
-}
updateBedVitals : Int -> Float -> Float -> Float -> Float -> Float -> Float -> Bool -> Bool -> String -> WardState -> WardState
updateBedVitals bedNum hr sbp dbp spo2 etco2 cvp crisis warning rhythmStr ward =
    let
        map =
            dbp + ((sbp - dbp) / 3.0)

        updateSingleBed b =
            if b.bedNumber == bedNum then
                { b
                    | heartRateBpm = hr
                    , systolicMmhg = sbp
                    , diastolicMmhg = dbp
                    , meanMmhg = map
                    , spo2Percent = spo2
                    , etco2Mmhg = etco2
                    , cvpMmhg = cvp
                    , hasActiveCrisis = crisis
                    , hasActiveWarning = warning
                    , primaryRhythmString = rhythmStr
                }

            else
                b
    in
    { ward | beds = List.map updateSingleBed ward.beds }
