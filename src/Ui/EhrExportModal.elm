module Ui.EhrExportModal exposing
    ( ExportFormat(..)
    , Msg(..)
    , viewEhrModal
    )

{-| Clinical Electronic Health Record (EHR) export modal dialog.
Generates compliant HL7 FHIR R4 Observation JSON bundles and structured
clinical narrative progress summaries for hospital integration.
-}

import Html exposing (Html, button, div, h2, pre, span, text)
import Html.Attributes exposing (style)
import Html.Events exposing (onClick)
import Protocol.Hl7Fhir as Fhir
import Simulation.Patient as Patient
import Ui.Theme as Theme


{-| EHR Export interaction messages.
-}
type Msg
    = CloseEhrModal
    | SelectFormat ExportFormat
    | CopyExportPayload String


{-| Export serialization format.
-}
type ExportFormat
    = FhirJsonFormat
    | ClinicalNarrativeFormat


{-| Render the EHR Export Modal dialog.
-}
viewEhrModal : ExportFormat -> Patient.PatientProfile -> Float -> Html Msg
viewEhrModal activeFormat patient currentTimestamp =
    let
        fhirJson =
            Fhir.exportPatientBundleJson patient currentTimestamp

        narrative =
            generateClinicalNarrative patient

        activePayload =
            case activeFormat of
                FhirJsonFormat ->
                    fhirJson

                ClinicalNarrativeFormat ->
                    narrative
    in
    div
        [ style "position" "fixed"
        , style "top" "0"
        , style "left" "0"
        , style "width" "100vw"
        , style "height" "100vh"
        , style "background" "rgba(2, 6, 23, 0.85)"
        , style "backdrop-filter" "blur(6px)"
        , style "display" "flex"
        , style "align-items" "center"
        , style "justify-content" "center"
        , style "z-index" "150"
        ]
        [ div
            [ style "background" Theme.surfaceColor
            , style "border" ("1px solid " ++ Theme.bezelColor)
            , style "border-radius" "12px"
            , style "width" "820px"
            , style "max-width" "94vw"
            , style "max-height" "88vh"
            , style "padding" "24px"
            , style "color" Theme.textPrimaryColor
            , style "box-shadow" "0 25px 50px -12px rgba(0, 0, 0, 0.7)"
            , style "display" "flex"
            , style "flex-direction" "column"
            , style "gap" "16px"
            ]
            [ -- Header
              div
                [ style "display" "flex"
                , style "justify-content" "space-between"
                , style "align-items" "center"
                , style "border-bottom" ("1px solid " ++ Theme.bezelColor)
                , style "padding-bottom" "12px"
                ]
                [ div []
                    [ h2
                        [ style "margin" "0"
                        , style "font-size" "18px"
                        , style "font-weight" "700"
                        , style "letter-spacing" "0.05em"
                        , style "color" Theme.ecgColor
                        ]
                        [ text "EHR CLINICAL DATA EXPORT" ]
                    , span
                        [ style "font-size" "12px"
                        , style "color" Theme.textMutedColor
                        ]
                        [ text "HL7 FHIR R4 Standard Observation Bundle and Clinical Summary" ]
                    ]
                , button
                    [ onClick CloseEhrModal
                    , style "background" "transparent"
                    , style "border" ("1px solid " ++ Theme.bezelColor)
                    , style "color" Theme.textMutedColor
                    , style "border-radius" "6px"
                    , style "padding" "6px 14px"
                    , style "cursor" "pointer"
                    , style "font-size" "13px"
                    ]
                    [ text "Close [ESC]" ]
                ]

            -- Format Switcher and Copy Button
            , div
                [ style "display" "flex"
                , style "justify-content" "space-between"
                , style "align-items" "center"
                ]
                [ div [ style "display" "flex", style "gap" "8px" ]
                    [ renderFormatBtn "HL7 FHIR JSON" FhirJsonFormat (activeFormat == FhirJsonFormat)
                    , renderFormatBtn "Clinical Summary" ClinicalNarrativeFormat (activeFormat == ClinicalNarrativeFormat)
                    ]
                , button
                    [ onClick (CopyExportPayload activePayload)
                    , style "background" Theme.ecgColor
                    , style "color" "#000000"
                    , style "border" "none"
                    , style "border-radius" "6px"
                    , style "padding" "6px 16px"
                    , style "font-weight" "700"
                    , style "font-size" "12px"
                    , style "cursor" "pointer"
                    ]
                    [ text "Copy Payload" ]
                ]

            -- Payload Display Area
            , div
                [ style "background" Theme.backgroundColor
                , style "border" ("1px solid " ++ Theme.bezelColor)
                , style "border-radius" "8px"
                , style "padding" "14px"
                , style "flex" "1"
                , style "overflow-y" "auto"
                , style "max-height" "450px"
                ]
                [ pre
                    [ style "margin" "0"
                    , style "font-family" "monospace"
                    , style "font-size" "11px"
                    , style "color" Theme.textPrimaryColor
                    , style "white-space" "pre-wrap"
                    , style "word-break" "break-all"
                    ]
                    [ text activePayload ]
                ]
            ]
        ]


renderFormatBtn : String -> ExportFormat -> Bool -> Html Msg
renderFormatBtn label format isSelected =
    button
        [ onClick (SelectFormat format)
        , style "background"
            (if isSelected then
                Theme.bezelColor

             else
                "transparent"
            )
        , style "border"
            ("1px solid "
                ++ (if isSelected then
                        Theme.ecgColor

                    else
                        Theme.bezelColor
                   )
            )
        , style "color"
            (if isSelected then
                Theme.ecgColor

             else
                Theme.textMutedColor
            )
        , style "border-radius" "6px"
        , style "padding" "6px 12px"
        , style "font-size" "12px"
        , style "font-weight" "600"
        , style "cursor" "pointer"
        ]
        [ text label ]


{-| Generate structured clinical narrative progress report.
-}
generateClinicalNarrative : Patient.PatientProfile -> String
generateClinicalNarrative p =
    let
        l =
            p.labs

        abg =
            p.abg

        sexStr =
            case p.sex of
                Patient.Male ->
                    "Male"

                Patient.Female ->
                    "Female"

        header =
            "=======================================================================\n"
                ++ "ICU INTENSIVE CARE CLINICAL PROGRESS NOTE - PHYSIOLOGICAL TELEMETRY\n"
                ++ "=======================================================================\n"
                ++ "Patient ID: "
                ++ p.id
                ++ "\nName: "
                ++ p.name
                ++ " | Age: "
                ++ String.fromInt (round p.ageYears)
                ++ " | Sex: "
                ++ sexStr
                ++ "\nWeight: "
                ++ String.fromFloat p.weightKg
                ++ " kg | Height: "
                ++ String.fromFloat p.heightCm
                ++ " cm | BSA: "
                ++ String.fromFloat p.bsaM2
                ++ " m2\n"
                ++ "Primary Admission Diagnosis: "
                ++ p.primaryDiagnosis
                ++ "\n\n"

        vitalSection =
            "CURRENT PHYSIOLOGICAL VITALS:\n"
                ++ "- Heart Rate: "
                ++ String.fromInt (round p.baselineHeartRateBpm)
                ++ " bpm\n"
                ++ "- Arterial Blood Pressure: "
                ++ String.fromInt (round p.baselineSystolicMmhg)
                ++ "/"
                ++ String.fromInt (round p.baselineDiastolicMmhg)
                ++ " mmHg\n"
                ++ "- SpO2: "
                ++ String.fromFloat p.baselineSpo2Percent
                ++ " %\n"
                ++ "- End-Tidal CO2: "
                ++ String.fromInt (round p.baselineEtco2Mmhg)
                ++ " mmHg\n"
                ++ "- Central Venous Pressure: "
                ++ String.fromFloat p.baselineCvpMmhg
                ++ " mmHg\n\n"

        labSection =
            "LABORATORY & ARTERIAL BLOOD GAS PANEL:\n"
                ++ "- Arterial pH: "
                ++ String.fromFloat abg.ph
                ++ "\n- PaO2: "
                ++ String.fromFloat abg.paO2Mmhg
                ++ " mmHg | PaCO2: "
                ++ String.fromFloat abg.paCo2Mmhg
                ++ " mmHg\n"
                ++ "- Base Excess: "
                ++ String.fromFloat abg.baseExcessMeqL
                ++ " mEq/L | Serum Lactate: "
                ++ String.fromFloat abg.lactateMmolL
                ++ " mmol/L\n"
                ++ "- Hemoglobin: "
                ++ String.fromFloat l.hemoglobinGDl
                ++ " g/dL | Hematocrit: "
                ++ String.fromFloat l.hematocritPercent
                ++ " %\n"
                ++ "- Serum Potassium: "
                ++ String.fromFloat l.potassiumMeqL
                ++ " mEq/L | Sodium: "
                ++ String.fromFloat l.sodiumMeqL
                ++ " mEq/L\n"
                ++ "- Troponin I: "
                ++ String.fromFloat l.troponinINgMl
                ++ " ng/mL\n\n"

        footer =
            "=======================================================================\n"
                ++ "Generated deterministically by Systole ICU Physiological Telemetry Core\n"
                ++ "Compliant with IEC 62304 Class C Medical Software Safety Standard\n"
                ++ "=======================================================================\n"
    in
    header ++ vitalSection ++ labSection ++ footer
