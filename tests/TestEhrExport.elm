module TestEhrExport exposing (suite)

import Expect
import Json.Decode as Decode
import Protocol.Hl7Fhir as Fhir
import Simulation.Patient as Patient
import Test exposing (Test, describe, test)


suite : Test
suite =
    describe "Protocol.Hl7Fhir and EHR Export Test Suite"
        [ test "Export patient bundle generates valid JSON containing Bundle resourceType" <|
            \_ ->
                let
                    patient =
                        Patient.defaultPatient

                    jsonStr =
                        Fhir.exportPatientBundleJson patient 1000.0

                    resourceTypeDecoder =
                        Decode.field "resourceType" Decode.string

                    decoded =
                        Decode.decodeString resourceTypeDecoder jsonStr
                in
                decoded
                    |> Expect.equal (Ok "Bundle")
        , test "Bundle contains 5 observation entries with LOINC codes" <|
            \_ ->
                let
                    patient =
                        Patient.defaultPatient

                    jsonStr =
                        Fhir.exportPatientBundleJson patient 1000.0

                    entriesDecoder =
                        Decode.field "entry" (Decode.list (Decode.field "fullUrl" Decode.string))

                    decoded =
                        Decode.decodeString entriesDecoder jsonStr
                in
                case decoded of
                    Ok urls ->
                        Expect.equal 5 (List.length urls)

                    Err _ ->
                        Expect.fail "Failed to decode entry array from FHIR bundle"
        , test "Observation encoder includes LOINC system and display name" <|
            \_ ->
                let
                    obs =
                        Fhir.buildObservation "test-obs" "8867-4" "Heart Rate" 75.0 "beats/min" "/min" 500.0

                    jsonVal =
                        Fhir.encodeFhirObservation obs

                    encodedStr =
                        jsonVal
                            |> (\v -> Decode.decodeValue (Decode.field "status" Decode.string) v)
                in
                encodedStr
                    |> Expect.equal (Ok "final")
        ]
