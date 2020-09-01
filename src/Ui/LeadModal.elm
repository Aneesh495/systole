module Ui.LeadModal exposing
    ( LeadSnippet
    , render12LeadModal
    )

{-| Diagnostic 12-lead ECG modal dialog in standard clinical 4x3 layout.
Displays synchronized 2.5-second captures across Einthoven limb leads (I, II, III),
Goldberger unipolar leads (aVR, aVL, aVF), and Wilson precordial leads (V1 to V6),
complemented by a continuous 10-second Lead II rhythm strip at the base.
-}

import Dsp.EcgAnalysis exposing (AxisDeviation(..), EcgMetrics, StDeviation)
import Dsp.Types exposing (Lead(..), WaveformPoint, leadToString)
import Html exposing (Html, button, div, h2, h3, span, text)
import Html.Attributes exposing (style)
import Html.Events exposing (onClick)
import Svg exposing (Svg, path, svg, text_)
import Svg.Attributes as SvgAttr exposing (d, fill, fontSize, height, stroke, strokeLinecap, strokeLinejoin, strokeWidth, viewBox, width, x, y)
import Ui.EcgGrid as EcgGrid
import Ui.Sweepbar exposing (renderWaveformPath)
import Ui.Theme as Theme


{-| Channel snippet holding historical points for a single lead.
-}
type alias LeadSnippet =
    { lead : Lead
    , points : List WaveformPoint
    }


{-| Render the complete 12-lead diagnostic modal dialog.
Takes list of lead snippets, ECG metrics, STEMI alert status, and close message.
-}
render12LeadModal : List LeadSnippet -> EcgMetrics -> Bool -> msg -> Html msg
render12LeadModal snippets metrics isStemi closeMsg =
    let
        leadMap lead =
            snippets
                |> List.filter (\s -> s.lead == lead)
                |> List.head
                |> Maybe.map .points
                |> Maybe.withDefault []

        col1 =
            [ LeadI, LeadII, LeadIII ]

        col2 =
            [ LeadAVR, LeadAVL, LeadAVF ]

        col3 =
            [ LeadV1, LeadV2, LeadV3 ]

        col4 =
            [ LeadV4, LeadV5, LeadV6 ]

        rhythmStripPoints =
            leadMap LeadII
    in
    div
        [ style "position" "fixed"
        , style "top" "0"
        , style "left" "0"
        , style "right" "0"
        , style "bottom" "0"
        , style "background" "rgba(2, 4, 8, 0.88)"
        , style "display" "flex"
        , style "justify-content" "center"
        , style "align-items" "center"
        , style "z-index" "1000"
        , style "backdrop-filter" "blur(4px)"
        ]
        [ div
            [ style "background" "#0a0e17"
            , style "border" ("1px solid " ++ Theme.bezelColor)
            , style "border-radius" "8px"
            , style "width" "94vw"
            , style "max-width" "1280px"
            , style "max-height" "92vh"
            , style "overflow-y" "auto"
            , style "padding" "24px"
            , style "box-shadow" "0 24px 64px rgba(0, 0, 0, 0.8)"
            ]
            [ -- Modal Header
              div
                [ style "display" "flex"
                , style "justify-content" "space-between"
                , style "align-items" "center"
                , style "border-bottom" "1px solid #1a2333"
                , style "padding-bottom" "16px"
                , style "margin-bottom" "20px"
                ]
                [ div []
                    [ h2
                        [ style "color" Theme.textPrimaryColor
                        , style "font-size" "20px"
                        , style "font-family" "monospace"
                        , style "margin" "0 0 4px 0"
                        ]
                        [ text "12-LEAD DIAGNOSTIC ELECTROCARDIOGRAM" ]
                    , div
                        [ style "color" Theme.textMutedColor
                        , style "font-size" "12px"
                        , style "font-family" "monospace"
                        ]
                        [ text "Standard 25 mm/s, 10 mm/mV, 0.05-150 Hz diagnostic bandwidth" ]
                    ]
                , div
                    [ style "display" "flex"
                    , style "align-items" "center"
                    , style "gap" "16px"
                    ]
                    [ if isStemi then
                        div
                            [ style "background" "rgba(255, 0, 51, 0.2)"
                            , style "border" ("1px solid " ++ Theme.alertColor)
                            , style "color" Theme.alertColor
                            , style "padding" "6px 14px"
                            , style "border-radius" "4px"
                            , style "font-weight" "bold"
                            , style "font-size" "13px"
                            , style "font-family" "monospace"
                            ]
                            [ text "CRITICAL: ACUTE STEMI CRITERIA MET" ]

                      else
                        div [] []
                    , button
                        [ onClick closeMsg
                        , style "background" "#182234"
                        , style "color" Theme.textPrimaryColor
                        , style "border" "1px solid #2a3a54"
                        , style "border-radius" "4px"
                        , style "padding" "8px 18px"
                        , style "font-family" "monospace"
                        , style "font-weight" "bold"
                        , style "cursor" "pointer"
                        ]
                        [ text "CLOSE [ESC]" ]
                    ]
                ]

            -- Diagnostic measurements ticker bar
            , div
                [ style "display" "grid"
                , style "grid-template-columns" "repeat(6, 1fr)"
                , style "gap" "12px"
                , style "background" "#0e1522"
                , style "border" "1px solid #182234"
                , style "border-radius" "6px"
                , style "padding" "12px 16px"
                , style "margin-bottom" "20px"
                ]
                [ metricItem "HEART RATE" (String.fromInt (round metrics.heartRateBpm) ++ " BPM")
                , metricItem "PR INTERVAL" (String.fromInt (round metrics.prIntervalMs) ++ " ms")
                , metricItem "QRS DURATION" (String.fromInt (round metrics.qrsDurationMs) ++ " ms")
                , metricItem "QT / QTc (FRID)" (String.fromInt (round metrics.qtIntervalMs) ++ " / " ++ String.fromInt (round metrics.qtcFridericiaMs) ++ " ms")
                , metricItem "ELECTRICAL AXIS" (axisToString metrics.electricalAxis)
                , metricItem "HRV (RMSSD)" (String.fromFloat (toFloat (round (metrics.hrv.rmssdMs * 10.0)) / 10.0) ++ " ms")
                ]

            -- 4x3 Leads Grid Layout
            , div
                [ style "display" "grid"
                , style "grid-template-columns" "repeat(4, 1fr)"
                , style "gap" "12px"
                , style "margin-bottom" "20px"
                ]
                [ renderLeadColumn col1 leadMap
                , renderLeadColumn col2 leadMap
                , renderLeadColumn col3 leadMap
                , renderLeadColumn col4 leadMap
                ]

            -- Continuous Lead II Rhythm Strip at base
            , div
                [ style "background" "#06090e"
                , style "border" "1px solid #182234"
                , style "border-radius" "6px"
                , style "padding" "12px"
                ]
                [ div
                    [ style "color" Theme.ecgColor
                    , style "font-size" "12px"
                    , style "font-family" "monospace"
                    , style "font-weight" "bold"
                    , style "margin-bottom" "6px"
                    ]
                    [ text "CONTINUOUS RHYTHM STRIP: LEAD II (10 SECONDS)" ]
                , renderLeadSvg "II (Rhythm)" rhythmStripPoints 1150.0 120.0
                ]
            ]
        ]


metricItem : String -> String -> Html msg
metricItem label val =
    div []
        [ div
            [ style "color" Theme.textMutedColor
            , style "font-size" "11px"
            , style "font-family" "monospace"
            ]
            [ text label ]
        , div
            [ style "color" Theme.textPrimaryColor
            , style "font-size" "16px"
            , style "font-weight" "bold"
            , style "font-family" "monospace"
            , style "margin-top" "2px"
            ]
            [ text val ]
        ]


renderLeadColumn : List Lead -> (Lead -> List WaveformPoint) -> Html msg
renderLeadColumn leads leadMap =
    div
        [ style "display" "flex"
        , style "flex-direction" "column"
        , style "gap" "12px"
        ]
        (List.map (\lead -> renderLeadTile lead (leadMap lead)) leads)


renderLeadTile : Lead -> List WaveformPoint -> Html msg
renderLeadTile lead pts =
    div
        [ style "background" "#06090e"
        , style "border" "1px solid #141c2b"
        , style "border-radius" "4px"
        , style "padding" "8px"
        ]
        [ renderLeadSvg (leadToString lead) pts 280.0 110.0 ]


renderLeadSvg : String -> List WaveformPoint -> Float -> Float -> Html msg
renderLeadSvg label pts w h =
    let
        pathD =
            renderWaveformPath pts w h -0.6 1.8
    in
    svg
        [ viewBox ("0 0 " ++ String.fromFloat w ++ " " ++ String.fromFloat h)
        , width "100%"
        , height (String.fromFloat h ++ "px")
        , SvgAttr.style "display: block;"
        ]
        (EcgGrid.renderEcgGridBackground w h
            ++ [ -- 1 mV calibration reference mark at origin
                 EcgGrid.renderCalibrationPulse 8.0 (h * 0.65)

               -- Lead label
               , text_
                    [ x "56"
                    , y "22"
                    , fill Theme.ecgColor
                    , fontSize "13"
                    , SvgAttr.fontWeight "bold"
                    , SvgAttr.fontFamily "monospace"
                    ]
                    [ text label ]

               -- Waveform path trace
               , path
                    [ d pathD
                    , fill "none"
                    , stroke Theme.ecgColor
                    , strokeWidth "1.6"
                    , strokeLinecap "round"
                    , strokeLinejoin "round"
                    ]
                    []
               ]
        )


axisToString : AxisDeviation -> String
axisToString axis =
    case axis of
        NormalAxis deg ->
            String.fromInt (round deg) ++ "° (Normal)"

        LeftAxisDeviation deg ->
            String.fromInt (round deg) ++ "° (LAD)"

        RightAxisDeviation deg ->
            String.fromInt (round deg) ++ "° (RAD)"

        ExtremeAxisDeviation deg ->
            String.fromInt (round deg) ++ "° (Extreme)"
