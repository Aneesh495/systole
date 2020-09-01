module Ui.WardOverview exposing
    ( renderWardOverview
    )

{-| Central telemetry station multi-bed ward overview.
Renders an 8-bed intensive care unit layout with instantaneous vital sign cards,
alarm severity status badges, and one-click bed selection for detailed waveform analysis.
-}

import Html exposing (Html, div, span, text)
import Html.Attributes exposing (style)
import Html.Events exposing (onClick)
import Simulation.Ward exposing (BedState, WardState)
import Ui.Theme as Theme


{-| Render the central station 8-bed overview grid.
-}
renderWardOverview : WardState -> (Int -> msg) -> Html msg
renderWardOverview ward selectBedMsg =
    div
        [ style "display" "grid"
        , style "grid-template-columns" "repeat(4, 1fr)"
        , style "gap" "14px"
        , style "padding" "16px"
        , style "background" Theme.backgroundColor
        ]
        (List.map (\bed -> renderBedTile bed (bed.bedNumber == ward.selectedBedNumber) (selectBedMsg bed.bedNumber)) ward.beds)


renderBedTile : BedState -> Bool -> msg -> Html msg
renderBedTile bed isSelected clickMsg =
    let
        borderColor =
            if bed.hasActiveCrisis then
                Theme.alertColor

            else if bed.hasActiveWarning then
                Theme.warningColor

            else if isSelected then
                Theme.ppgColor

            else
                Theme.bezelColor

        bgColor =
            if isSelected then
                "#101826"

            else
                Theme.cardColor
    in
    div
        [ onClick clickMsg
        , style "background" bgColor
        , style "border" ("1px solid " ++ borderColor)
        , style "border-radius" "6px"
        , style "padding" "12px"
        , style "cursor" "pointer"
        , style "transition" "all 0.15s ease"
        ]
        [ -- Header: Bed Number and Patient Name
          div
            [ style "display" "flex"
            , style "justify-content" "space-between"
            , style "align-items" "baseline"
            , style "border-bottom" "1px solid #1c2638"
            , style "padding-bottom" "6px"
            , style "margin-bottom" "8px"
            ]
            [ div []
                [ span
                    [ style "color" Theme.ppgColor
                    , style "font-size" "13px"
                    , style "font-weight" "bold"
                    , style "font-family" "monospace"
                    , style "margin-right" "6px"
                    ]
                    [ text ("BED " ++ String.fromInt bed.bedNumber) ]
                , span
                    [ style "color" Theme.textPrimaryColor
                    , style "font-size" "13px"
                    , style "font-family" "monospace"
                    ]
                    [ text bed.patient.name ]
                ]
            , if bed.hasActiveCrisis then
                span
                    [ style "background" Theme.alertColor
                    , style "color" "#ffffff"
                    , style "padding" "2px 6px"
                    , style "border-radius" "3px"
                    , style "font-size" "10px"
                    , style "font-weight" "bold"
                    , style "font-family" "monospace"
                    ]
                    [ text "CRISIS" ]

              else if bed.hasActiveWarning then
                span
                    [ style "background" Theme.warningColor
                    , style "color" "#000000"
                    , style "padding" "2px 6px"
                    , style "border-radius" "3px"
                    , style "font-size" "10px"
                    , style "font-weight" "bold"
                    , style "font-family" "monospace"
                    ]
                    [ text "WARNING" ]

              else
                span
                    [ style "color" Theme.ecgColor
                    , style "font-size" "11px"
                    , style "font-family" "monospace"
                    ]
                    [ text "NOMINAL" ]
            ]

        -- Primary Diagnosis
        , div
            [ style "color" Theme.textMutedColor
            , style "font-size" "11px"
            , style "font-family" "monospace"
            , style "margin-bottom" "10px"
            , style "white-space" "nowrap"
            , style "overflow" "hidden"
            , style "text-overflow" "ellipsis"
            ]
            [ text bed.patient.primaryDiagnosis ]

        -- 4-Vitals Micro Grid
        , div
            [ style "display" "grid"
            , style "grid-template-columns" "repeat(4, 1fr)"
            , style "gap" "6px"
            , style "background" "#070c14"
            , style "border-radius" "4px"
            , style "padding" "6px"
            ]
            [ microVital "HR" (String.fromInt (round bed.heartRateBpm)) Theme.ecgColor
            , microVital "ABP" (String.fromInt (round bed.systolicMmhg) ++ "/" ++ String.fromInt (round bed.diastolicMmhg)) Theme.abpColor
            , microVital "SpO2" (String.fromInt (round bed.spo2Percent) ++ "%") Theme.ppgColor
            , microVital "EtCO2" (String.fromInt (round bed.etco2Mmhg)) Theme.capnoColor
            ]
        ]


microVital : String -> String -> String -> Html msg
microVital label val col =
    div
        [ style "display" "flex"
        , style "flex-direction" "column"
        ]
        [ span
            [ style "color" Theme.textMutedColor
            , style "font-size" "9px"
            , style "font-family" "monospace"
            ]
            [ text label ]
        , span
            [ style "color" col
            , style "font-size" "13px"
            , style "font-weight" "bold"
            , style "font-family" "monospace"
            , style "margin-top" "1px"
            ]
            [ text val ]
        ]
