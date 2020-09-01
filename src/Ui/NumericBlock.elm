module Ui.NumericBlock exposing
    ( renderAbpBlock
    , renderCapnoBlock
    , renderCvpBlock
    , renderHeartRateBlock
    , renderSpo2Block
    , renderTemperatureBlock
    )

{-| High-contrast clinical parameter callout blocks for bedside monitoring.
Formats instantaneous scalar metrics with unit tags, alarm threshold indicators,
and visual status cues adhering to international patient monitoring standards.
-}

import Html exposing (Html, div, span, text)
import Html.Attributes exposing (style)
import Ui.Theme as Theme


{-| Heart rate tile with animated beating heart indicator and rhythm label.
-}
renderHeartRateBlock : Float -> String -> Bool -> Html msg
renderHeartRateBlock hr rhythmStr isBeating =
    div
        [ style "background" Theme.cardColor
        , style "border" ("1px solid " ++ Theme.bezelColor)
        , style "border-radius" "6px"
        , style "padding" "10px 14px"
        , style "display" "flex"
        , style "flex-direction" "column"
        , style "justify-content" "space-between"
        , style "min-width" "150px"
        ]
        [ div
            [ style "display" "flex"
            , style "justify-content" "space-between"
            , style "align-items" "center"
            ]
            [ span
                [ style "color" Theme.ecgColor
                , style "font-size" "13px"
                , style "font-weight" "bold"
                , style "font-family" "monospace"
                ]
                [ text "HR (BPM)" ]
            , span
                [ style "font-size" "16px"
                , style "color" Theme.ecgColor
                , style "transform"
                    (if isBeating then
                        "scale(1.25)"

                     else
                        "scale(1.0)"
                    )
                , style "transition" "transform 0.1s ease-in-out"
                ]
                [ text "♥" ]
            ]
        , div
            [ style "color" Theme.ecgColor
            , style "font-size" "42px"
            , style "font-weight" "bold"
            , style "font-family" "monospace"
            , style "line-height" "1.0"
            , style "margin" "6px 0"
            ]
            [ text (String.fromInt (round hr)) ]
        , div
            [ style "color" Theme.textMutedColor
            , style "font-size" "11px"
            , style "font-family" "monospace"
            , style "white-space" "nowrap"
            , style "overflow" "hidden"
            , style "text-overflow" "ellipsis"
            ]
            [ text rhythmStr ]
        ]


{-| Arterial blood pressure tile showing Systolic / Diastolic and (Mean).
-}
renderAbpBlock : Float -> Float -> Float -> Html msg
renderAbpBlock sbp dbp map =
    div
        [ style "background" Theme.cardColor
        , style "border" ("1px solid " ++ Theme.bezelColor)
        , style "border-radius" "6px"
        , style "padding" "10px 14px"
        , style "display" "flex"
        , style "flex-direction" "column"
        , style "justify-content" "space-between"
        , style "min-width" "165px"
        ]
        [ div
            [ style "color" Theme.abpColor
            , style "font-size" "13px"
            , style "font-weight" "bold"
            , style "font-family" "monospace"
            ]
            [ text "ABP (mmHg)" ]
        , div
            [ style "color" Theme.abpColor
            , style "font-size" "36px"
            , style "font-weight" "bold"
            , style "font-family" "monospace"
            , style "line-height" "1.0"
            , style "margin" "6px 0"
            ]
            [ text (String.fromInt (round sbp) ++ "/" ++ String.fromInt (round dbp)) ]
        , div
            [ style "color" Theme.textMutedColor
            , style "font-size" "13px"
            , style "font-family" "monospace"
            ]
            [ text ("Mean (" ++ String.fromInt (round map) ++ ")") ]
        ]


{-| Pulse oximetry SpO2 tile with Perfusion Index (PI).
-}
renderSpo2Block : Float -> Float -> Html msg
renderSpo2Block spo2 pi =
    div
        [ style "background" Theme.cardColor
        , style "border" ("1px solid " ++ Theme.bezelColor)
        , style "border-radius" "6px"
        , style "padding" "10px 14px"
        , style "display" "flex"
        , style "flex-direction" "column"
        , style "justify-content" "space-between"
        , style "min-width" "140px"
        ]
        [ div
            [ style "color" Theme.ppgColor
            , style "font-size" "13px"
            , style "font-weight" "bold"
            , style "font-family" "monospace"
            ]
            [ text "SpO2 (%)" ]
        , div
            [ style "color" Theme.ppgColor
            , style "font-size" "42px"
            , style "font-weight" "bold"
            , style "font-family" "monospace"
            , style "line-height" "1.0"
            , style "margin" "6px 0"
            ]
            [ text (String.fromInt (round spo2)) ]
        , div
            [ style "color" Theme.textMutedColor
            , style "font-size" "11px"
            , style "font-family" "monospace"
            ]
            [ text ("PI: " ++ String.fromFloat (toFloat (round (pi * 10.0)) / 10.0) ++ "%") ]
        ]


{-| End-tidal CO2 capnography tile with Respiratory Rate (RR).
-}
renderCapnoBlock : Float -> Float -> Html msg
renderCapnoBlock etco2 rr =
    div
        [ style "background" Theme.cardColor
        , style "border" ("1px solid " ++ Theme.bezelColor)
        , style "border-radius" "6px"
        , style "padding" "10px 14px"
        , style "display" "flex"
        , style "flex-direction" "column"
        , style "justify-content" "space-between"
        , style "min-width" "140px"
        ]
        [ div
            [ style "color" Theme.capnoColor
            , style "font-size" "13px"
            , style "font-weight" "bold"
            , style "font-family" "monospace"
            ]
            [ text "EtCO2 (mmHg)" ]
        , div
            [ style "color" Theme.capnoColor
            , style "font-size" "42px"
            , style "font-weight" "bold"
            , style "font-family" "monospace"
            , style "line-height" "1.0"
            , style "margin" "6px 0"
            ]
            [ text (String.fromInt (round etco2)) ]
        , div
            [ style "color" Theme.textMutedColor
            , style "font-size" "11px"
            , style "font-family" "monospace"
            ]
            [ text ("RR: " ++ String.fromInt (round rr) ++ " /min") ]
        ]


{-| Central Venous Pressure tile.
-}
renderCvpBlock : Float -> Html msg
renderCvpBlock cvp =
    div
        [ style "background" Theme.cardColor
        , style "border" ("1px solid " ++ Theme.bezelColor)
        , style "border-radius" "6px"
        , style "padding" "10px 14px"
        , style "display" "flex"
        , style "flex-direction" "column"
        , style "justify-content" "space-between"
        , style "min-width" "130px"
        ]
        [ div
            [ style "color" Theme.cvpColor
            , style "font-size" "13px"
            , style "font-weight" "bold"
            , style "font-family" "monospace"
            ]
            [ text "CVP (mmHg)" ]
        , div
            [ style "color" Theme.cvpColor
            , style "font-size" "42px"
            , style "font-weight" "bold"
            , style "font-family" "monospace"
            , style "line-height" "1.0"
            , style "margin" "6px 0"
            ]
            [ text (String.fromInt (round cvp)) ]
        , div
            [ style "color" Theme.textMutedColor
            , style "font-size" "11px"
            , style "font-family" "monospace"
            ]
            [ text "Venous Preload" ]
        ]


{-| Body temperature tile with Celsius and Fahrenheit.
-}
renderTemperatureBlock : Float -> Html msg
renderTemperatureBlock tempC =
    let
        tempF =
            tempC * 1.8 + 32.0
    in
    div
        [ style "background" Theme.cardColor
        , style "border" ("1px solid " ++ Theme.bezelColor)
        , style "border-radius" "6px"
        , style "padding" "10px 14px"
        , style "display" "flex"
        , style "flex-direction" "column"
        , style "justify-content" "space-between"
        , style "min-width" "130px"
        ]
        [ div
            [ style "color" Theme.respColor
            , style "font-size" "13px"
            , style "font-weight" "bold"
            , style "font-family" "monospace"
            ]
            [ text "TEMP (°C)" ]
        , div
            [ style "color" Theme.respColor
            , style "font-size" "36px"
            , style "font-weight" "bold"
            , style "font-family" "monospace"
            , style "line-height" "1.0"
            , style "margin" "6px 0"
            ]
            [ text (String.fromFloat (toFloat (round (tempC * 10.0)) / 10.0)) ]
        , div
            [ style "color" Theme.textMutedColor
            , style "font-size" "11px"
            , style "font-family" "monospace"
            ]
            [ text (String.fromFloat (toFloat (round (tempF * 10.0)) / 10.0) ++ " °F") ]
        ]
