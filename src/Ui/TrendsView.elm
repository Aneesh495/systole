module Ui.TrendsView exposing
    ( Msg(..)
    , TrendInterval(..)
    , TrendRecord
    , viewTrendsScreen
    )

{-| ICU vital signs trending view.
Provides graphical and tabular retrospective analysis of physiological parameters
across 1-hour, 8-hour, and 24-hour monitoring epochs with statistical summary metrics.
-}

import Html exposing (Html, button, div, h2, span, table, tbody, td, text, th, thead, tr)
import Html.Attributes exposing (style)
import Html.Events exposing (onClick)
import Svg exposing (Svg)
import Svg.Attributes as SvgAttr
import Ui.Theme as Theme


{-| Time interval selection for trends.
-}
type TrendInterval
    = Interval1Hour
    | Interval8Hour
    | Interval24Hour


{-| Recorded physiological trend snapshot.
-}
type alias TrendRecord =
    { timestampSec : Float
    , heartRateBpm : Float
    , abpSystolicMmHg : Float
    , abpDiastolicMmHg : Float
    , abpMeanMmHg : Float
    , spO2Percent : Float
    , etco2MmHg : Float
    , respiratoryRateBpm : Float
    , temperatureCelsius : Float
    }


{-| Trends view user interactions.
-}
type Msg
    = SelectInterval TrendInterval
    | CloseTrendsView


{-| Render the comprehensive trends monitoring view.
-}
viewTrendsScreen : TrendInterval -> List TrendRecord -> Html Msg
viewTrendsScreen activeInterval records =
    div
        [ style "display" "flex"
        , style "flex-direction" "column"
        , style "gap" "14px"
        , style "padding" "16px"
        , style "background" Theme.backgroundColor
        , style "min-height" "calc(100vh - 120px)"
        ]
        [ -- Top Bar
          div
            [ style "display" "flex"
            , style "justify-content" "space-between"
            , style "align-items" "center"
            , style "background" Theme.surfaceColor
            , style "border" ("1px solid " ++ Theme.bezelColor)
            , style "border-radius" "8px"
            , style "padding" "12px 16px"
            ]
            [ div []
                [ h2
                    [ style "margin" "0"
                    , style "font-size" "16px"
                    , style "color" Theme.ecgColor
                    , style "letter-spacing" "0.05em"
                    ]
                    [ text "PHYSIOLOGICAL VITAL SIGN TRENDS" ]
                , span [ style "font-size" "11px", style "color" Theme.textMutedColor ] [ text "Longitudinal Retrospective Telemetry Archive and Statistical Summary" ]
                ]
            , div [ style "display" "flex", style "gap" "8px" ]
                [ renderIntervalBtn "1 Hour" Interval1Hour (activeInterval == Interval1Hour)
                , renderIntervalBtn "8 Hours" Interval8Hour (activeInterval == Interval8Hour)
                , renderIntervalBtn "24 Hours" Interval24Hour (activeInterval == Interval24Hour)
                , button
                    [ onClick CloseTrendsView
                    , style "background" Theme.bezelColor
                    , style "border" "none"
                    , style "color" Theme.textMutedColor
                    , style "border-radius" "6px"
                    , style "padding" "6px 12px"
                    , style "cursor" "pointer"
                    , style "font-size" "12px"
                    ]
                    [ text "Close Screen" ]
                ]
            ]

        -- Trend Charts and Tabular Log
        , div
            [ style "display" "grid"
            , style "grid-template-columns" "1fr 1fr"
            , style "gap" "14px"
            ]
            [ renderTrendChart "HEART RATE & ARTERIAL PRESSURE (bpm / mmHg)" Theme.ecgColor Theme.abpColor records
            , renderSpO2CapnoChart "SPO2 & ETCO2 (% / mmHg)" Theme.ppgColor Theme.capnoColor records
            ]
        , renderTabularTrends records
        ]


{-| Render SVG trend chart for HR and ABP.
-}
renderTrendChart : String -> String -> String -> List TrendRecord -> Html Msg
renderTrendChart title color1 color2 records =
    let
        svgW =
            480.0

        svgH =
            160.0

        padL =
            40.0

        padR =
            10.0

        padT =
            15.0

        padB =
            25.0

        n =
            List.length records

        mapX i =
            padL + (toFloat i / Basics.max 1.0 (toFloat n - 1.0)) * (svgW - padL - padR)

        mapY val =
            let
                clamped =
                    Basics.max 30.0 (Basics.min 200.0 val)

                ratio =
                    (clamped - 30.0) / 170.0
            in
            (svgH - padB) - ratio * (svgH - padT - padB)

        hrPath =
            case records of
                [] ->
                    ""

                p0 :: rest ->
                    let
                        start =
                            "M " ++ String.fromFloat (mapX 0) ++ " " ++ String.fromFloat (mapY p0.heartRateBpm)

                        lines =
                            List.indexedMap (\i r -> "L " ++ String.fromFloat (mapX (i + 1)) ++ " " ++ String.fromFloat (mapY r.heartRateBpm)) rest
                                |> String.join " "
                    in
                    start ++ " " ++ lines

        abpPath =
            case records of
                [] ->
                    ""

                p0 :: rest ->
                    let
                        start =
                            "M " ++ String.fromFloat (mapX 0) ++ " " ++ String.fromFloat (mapY p0.abpMeanMmHg)

                        lines =
                            List.indexedMap (\i r -> "L " ++ String.fromFloat (mapX (i + 1)) ++ " " ++ String.fromFloat (mapY r.abpMeanMmHg)) rest
                                |> String.join " "
                    in
                    start ++ " " ++ lines
    in
    div
        [ style "background" Theme.surfaceColor
        , style "border" ("1px solid " ++ Theme.bezelColor)
        , style "border-radius" "8px"
        , style "padding" "12px"
        ]
        [ div [ style "display" "flex", style "justify-content" "space-between", style "font-size" "11px", style "font-weight" "700", style "margin-bottom" "8px" ]
            [ span [ style "color" color1 ] [ text title ]
            , span [ style "color" Theme.textMutedColor, style "font-weight" "400" ] [ text "HR (Green) | MAP (Red)" ]
            ]
        , Svg.svg
            [ SvgAttr.width "100%"
            , SvgAttr.height "160"
            , SvgAttr.viewBox ("0 0 " ++ String.fromFloat svgW ++ " " ++ String.fromFloat svgH)
            ]
            [ -- Grid
              Svg.line [ SvgAttr.x1 (String.fromFloat padL), SvgAttr.y1 (String.fromFloat (mapY 60.0)), SvgAttr.x2 (String.fromFloat (svgW - padR)), SvgAttr.y2 (String.fromFloat (mapY 60.0)), SvgAttr.stroke Theme.bezelColor, SvgAttr.strokeDasharray "2 2" ] []
            , Svg.line [ SvgAttr.x1 (String.fromFloat padL), SvgAttr.y1 (String.fromFloat (mapY 120.0)), SvgAttr.x2 (String.fromFloat (svgW - padR)), SvgAttr.y2 (String.fromFloat (mapY 120.0)), SvgAttr.stroke Theme.bezelColor, SvgAttr.strokeDasharray "2 2" ] []

            -- HR Path
            , Svg.path [ SvgAttr.d hrPath, SvgAttr.fill "none", SvgAttr.stroke color1, SvgAttr.strokeWidth "2.0" ] []

            -- MAP Path
            , Svg.path [ SvgAttr.d abpPath, SvgAttr.fill "none", SvgAttr.stroke color2, SvgAttr.strokeWidth "2.0" ] []
            ]
        ]


{-| Render SVG trend chart for SpO2 and EtCO2.
-}
renderSpO2CapnoChart : String -> String -> String -> List TrendRecord -> Html Msg
renderSpO2CapnoChart title color1 color2 records =
    let
        svgW =
            480.0

        svgH =
            160.0

        padL =
            40.0

        padR =
            10.0

        padT =
            15.0

        padB =
            25.0

        n =
            List.length records

        mapX i =
            padL + (toFloat i / Basics.max 1.0 (toFloat n - 1.0)) * (svgW - padL - padR)

        mapY val =
            let
                clamped =
                    Basics.max 0.0 (Basics.min 100.0 val)

                ratio =
                    clamped / 100.0
            in
            (svgH - padB) - ratio * (svgH - padT - padB)

        spo2Path =
            case records of
                [] ->
                    ""

                p0 :: rest ->
                    let
                        start =
                            "M " ++ String.fromFloat (mapX 0) ++ " " ++ String.fromFloat (mapY p0.spO2Percent)

                        lines =
                            List.indexedMap (\i r -> "L " ++ String.fromFloat (mapX (i + 1)) ++ " " ++ String.fromFloat (mapY r.spO2Percent)) rest
                                |> String.join " "
                    in
                    start ++ " " ++ lines

        co2Path =
            case records of
                [] ->
                    ""

                p0 :: rest ->
                    let
                        start =
                            "M " ++ String.fromFloat (mapX 0) ++ " " ++ String.fromFloat (mapY p0.etco2MmHg)

                        lines =
                            List.indexedMap (\i r -> "L " ++ String.fromFloat (mapX (i + 1)) ++ " " ++ String.fromFloat (mapY r.etco2MmHg)) rest
                                |> String.join " "
                    in
                    start ++ " " ++ lines
    in
    div
        [ style "background" Theme.surfaceColor
        , style "border" ("1px solid " ++ Theme.bezelColor)
        , style "border-radius" "8px"
        , style "padding" "12px"
        ]
        [ div [ style "display" "flex", style "justify-content" "space-between", style "font-size" "11px", style "font-weight" "700", style "margin-bottom" "8px" ]
            [ span [ style "color" color1 ] [ text title ]
            , span [ style "color" Theme.textMutedColor, style "font-weight" "400" ] [ text "SpO2 (Cyan) | EtCO2 (Yellow)" ]
            ]
        , Svg.svg
            [ SvgAttr.width "100%"
            , SvgAttr.height "160"
            , SvgAttr.viewBox ("0 0 " ++ String.fromFloat svgW ++ " " ++ String.fromFloat svgH)
            ]
            [ -- Grid
              Svg.line [ SvgAttr.x1 (String.fromFloat padL), SvgAttr.y1 (String.fromFloat (mapY 90.0)), SvgAttr.x2 (String.fromFloat (svgW - padR)), SvgAttr.y2 (String.fromFloat (mapY 90.0)), SvgAttr.stroke Theme.bezelColor, SvgAttr.strokeDasharray "2 2" ] []
            , Svg.line [ SvgAttr.x1 (String.fromFloat padL), SvgAttr.y1 (String.fromFloat (mapY 40.0)), SvgAttr.x2 (String.fromFloat (svgW - padR)), SvgAttr.y2 (String.fromFloat (mapY 40.0)), SvgAttr.stroke Theme.bezelColor, SvgAttr.strokeDasharray "2 2" ] []

            -- SpO2 Path
            , Svg.path [ SvgAttr.d spo2Path, SvgAttr.fill "none", SvgAttr.stroke color1, SvgAttr.strokeWidth "2.0" ] []

            -- EtCO2 Path
            , Svg.path [ SvgAttr.d co2Path, SvgAttr.fill "none", SvgAttr.stroke color2, SvgAttr.strokeWidth "2.0" ] []
            ]
        ]


{-| Render tabular retrospective vital signs log.
-}
renderTabularTrends : List TrendRecord -> Html Msg
renderTabularTrends records =
    div
        [ style "background" Theme.surfaceColor
        , style "border" ("1px solid " ++ Theme.bezelColor)
        , style "border-radius" "8px"
        , style "padding" "14px"
        , style "overflow-x" "auto"
        ]
        [ table
            [ style "width" "100%"
            , style "border-collapse" "collapse"
            , style "font-size" "12px"
            ]
            [ thead []
                [ tr [ style "border-bottom" ("1px solid " ++ Theme.bezelColor), style "color" Theme.textMutedColor, style "text-align" "left" ]
                    [ th [ style "padding" "8px" ] [ text "TIME" ]
                    , th [ style "padding" "8px", style "color" Theme.ecgColor ] [ text "HR (bpm)" ]
                    , th [ style "padding" "8px", style "color" Theme.abpColor ] [ text "ABP (Sys/Dia)" ]
                    , th [ style "padding" "8px", style "color" Theme.abpColor ] [ text "MAP (mmHg)" ]
                    , th [ style "padding" "8px", style "color" Theme.ppgColor ] [ text "SpO2 (%)" ]
                    , th [ style "padding" "8px", style "color" Theme.capnoColor ] [ text "EtCO2 (mmHg)" ]
                    , th [ style "padding" "8px", style "color" Theme.respColor ] [ text "RR (bpm)" ]
                    , th [ style "padding" "8px" ] [ text "TEMP (C)" ]
                    ]
                ]
            , tbody []
                (List.take 10 records
                    |> List.map
                        (\r ->
                            tr [ style "border-bottom" ("1px solid " ++ Theme.cardColor), style "font-family" "monospace" ]
                                [ td [ style "padding" "8px", style "color" Theme.textMutedColor ] [ text (formatTime r.timestampSec) ]
                                , td [ style "padding" "8px", style "color" Theme.ecgColor ] [ text (String.fromInt (round r.heartRateBpm)) ]
                                , td [ style "padding" "8px", style "color" Theme.abpColor ] [ text (String.fromInt (round r.abpSystolicMmHg) ++ "/" ++ String.fromInt (round r.abpDiastolicMmHg)) ]
                                , td [ style "padding" "8px", style "color" Theme.abpColor ] [ text (String.fromInt (round r.abpMeanMmHg)) ]
                                , td [ style "padding" "8px", style "color" Theme.ppgColor ] [ text (String.fromFloat (round1 r.spO2Percent)) ]
                                , td [ style "padding" "8px", style "color" Theme.capnoColor ] [ text (String.fromInt (round r.etco2MmHg)) ]
                                , td [ style "padding" "8px", style "color" Theme.respColor ] [ text (String.fromInt (round r.respiratoryRateBpm)) ]
                                , td [ style "padding" "8px", style "color" Theme.textPrimaryColor ] [ text (String.fromFloat (round1 r.temperatureCelsius)) ]
                                ]
                        )
                )
            ]
        ]


renderIntervalBtn : String -> TrendInterval -> Bool -> Html Msg
renderIntervalBtn label interval isSelected =
    button
        [ onClick (SelectInterval interval)
        , style "background"
            (if isSelected then
                Theme.ecgColor

             else
                Theme.bezelColor
            )
        , style "color"
            (if isSelected then
                "#000000"

             else
                Theme.textPrimaryColor
            )
        , style "border" "none"
        , style "border-radius" "4px"
        , style "padding" "6px 12px"
        , style "font-size" "12px"
        , style "font-weight" "700"
        , style "cursor" "pointer"
        ]
        [ text label ]


formatTime : Float -> String
formatTime sec =
    let
        totalSec =
            round sec

        m =
            modBy 60 (totalSec // 60)

        s =
            modBy 60 totalSec

        pad n =
            if n < 10 then
                "0" ++ String.fromInt n

            else
                String.fromInt n
    in
    pad m ++ ":" ++ pad s


round1 : Float -> Float
round1 val =
    toFloat (round (val * 10.0)) / 10.0
