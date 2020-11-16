module Protocol.Hl7Fhir exposing
    ( FhirObservation
    , buildObservation
    , encodeFhirObservation
    , exportPatientBundleJson
    , loincDiastolicBp
    , loincEndTidalCo2
    , loincHeartRate
    , loincOxygenSaturation
    , loincSystolicBp
    )

{-| Health Level Seven (HL7) Fast Healthcare Interoperability Resources (FHIR) R4 export.
Formats bedside clinical observations into FHIR JSON with Logical Observation Identifiers
Names and Codes (LOINC) and Unified Code for Units of Measure (UCUM) codings.
-}

import Dsp.Types exposing (Timestamp)
import Json.Encode as Encode
import Simulation.Patient as Patient


{-| Standard clinical LOINC identifiers.
-}
loincHeartRate : String
loincHeartRate =
    "8867-4"


loincSystolicBp : String
loincSystolicBp =
    "8480-6"


loincDiastolicBp : String
loincDiastolicBp =
    "8462-4"


loincOxygenSaturation : String
loincOxygenSaturation =
    "59408-5"


loincEndTidalCo2 : String
loincEndTidalCo2 =
    "19889-5"


{-| Structured FHIR observation container.
-}
type alias FhirObservation =
    { id : String
    , status : String
    , loincCode : String
    , display : String
    , valueQuantity : Float
    , unit : String
    , ucumCode : String
    , effectiveTimestamp : Timestamp
    }


{-| Build a standardized FHIR observation record.
-}
buildObservation : String -> String -> String -> Float -> String -> String -> Timestamp -> FhirObservation
buildObservation id code name val unit ucum ts =
    { id = id
    , status = "final"
    , loincCode = code
    , display = name
    , valueQuantity = val
    , unit = unit
    , ucumCode = ucum
    , effectiveTimestamp = ts
    }


{-| Encode an observation into FHIR JSON.
-}
encodeFhirObservation : FhirObservation -> Encode.Value
encodeFhirObservation obs =
    Encode.object
        [ ( "resourceType", Encode.string "Observation" )
        , ( "id", Encode.string obs.id )
        , ( "status", Encode.string obs.status )
        , ( "code"
          , Encode.object
                [ ( "coding"
                  , Encode.list identity
                        [ Encode.object
                            [ ( "system", Encode.string "http://loinc.org" )
                            , ( "code", Encode.string obs.loincCode )
                            , ( "display", Encode.string obs.display )
                            ]
                        ]
                  )
                ]
          )
        , ( "valueQuantity"
          , Encode.object
                [ ( "value", Encode.float obs.valueQuantity )
                , ( "unit", Encode.string obs.unit )
                , ( "system", Encode.string "http://unitsofmeasure.org" )
                , ( "code", Encode.string obs.ucumCode )
                ]
          )
        , ( "effectiveDateTime", Encode.string (String.fromFloat obs.effectiveTimestamp ++ "ms") )
        ]


{-| Export all patient vitals as a FHIR R4 Bundle JSON string.
-}
exportPatientBundleJson : Patient.PatientProfile -> Timestamp -> String
exportPatientBundleJson patient ts =
    let
        obsHr =
            buildObservation (patient.id ++ "-hr") loincHeartRate "Heart Rate" patient.baselineHeartRateBpm "beats/min" "/min" ts

        obsSys =
            buildObservation (patient.id ++ "-sys") loincSystolicBp "Systolic Blood Pressure" patient.baselineSystolicMmhg "mmHg" "mm[Hg]" ts

        obsDia =
            buildObservation (patient.id ++ "-dia") loincDiastolicBp "Diastolic Blood Pressure" patient.baselineDiastolicMmhg "mmHg" "mm[Hg]" ts

        obsSpo2 =
            buildObservation (patient.id ++ "-spo2") loincOxygenSaturation "Oxygen Saturation" patient.baselineSpo2Percent "%" "%" ts

        obsEtco2 =
            buildObservation (patient.id ++ "-etco2") loincEndTidalCo2 "End-Tidal Carbon Dioxide" patient.baselineEtco2Mmhg "mmHg" "mm[Hg]" ts

        entries =
            [ obsHr, obsSys, obsDia, obsSpo2, obsEtco2 ]
                |> List.map
                    (\obs ->
                        Encode.object
                            [ ( "fullUrl", Encode.string ("urn:uuid:" ++ obs.id) )
                            , ( "resource", encodeFhirObservation obs )
                            ]
                    )

        bundle =
            Encode.object
                [ ( "resourceType", Encode.string "Bundle" )
                , ( "id", Encode.string ("bundle-" ++ patient.id) )
                , ( "type", Encode.string "transaction" )
                , ( "entry", Encode.list identity entries )
                ]
    in
    Encode.encode 2 bundle
