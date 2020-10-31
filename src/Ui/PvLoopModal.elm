module Ui.PvLoopModal exposing
    ( Msg(..)
    , viewPvModal
    )

{-| Interactive Left Ventricular Pressure-Volume (PV) Loop modal dialog.
Renders real-time SVG loops, Suga-Sagawa elastance lines (ESPVR/EDPVR),
and displays ventriculo-arterial coupling metrics.
-}

import Hemodynamics.PressureVolumeLoop as Pv
import Html exposing (Html, button, div, h2, span, text)
import Html.Attributes exposing (style)
import Html.Events exposing (onClick)
import Svg exposing (Svg)
import Svg.Attributes as SvgAttr
import Ui.Theme as Theme


{-| PV Loop user interaction messages.
-}
type Msg
    = ClosePvModal
    | AdjustContractility Float
    | AdjustPreload Float
    | AdjustAfterload Float


{-| Render the interactive PV Loop modal overlay.
-}
viewPvModal : Pv.PvLoopModel -> Html Msg
viewPvModal model =
    let
        metrics =
            Pv.computePvMetrics model

        trajectory =
            Pv.generateLoopTrajectory model 16
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
            , style "width" "880px"
            , style "max-width" "94vw"
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
                        , style "color" Theme.ppgColor
                        ]
                        [ text "LEFT VENTRICULAR PRESSURE-VOLUME ANALYSIS" ]
                    , span
                        [ style "font-size" "12px"
                        , style "color" Theme.textMutedColor
                        ]
                        [ text "Suga-Sagawa Time-Varying Elastance and Ventriculo-Arterial Coupling" ]
                    ]
                , button
                    [ onClick ClosePvModal
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

            -- Main Body: SVG Plot on Left, Hemodynamic Readout on Right
            , div
                [ style "display" "grid"
                , style "grid-template-columns" "520px 1fr"
                , style "gap" "20px"
                ]
                [ -- SVG PV Loop Diagram
                  div
                    [ style "background" Theme.backgroundColor
                    , style "border" ("1px solid " ++ Theme.bezelColor)
                    , style "border-radius" "8px"
                    , style "padding" "12px"
                    ]
                    [ renderPvSvg model metrics trajectory ]

                -- Metrics and Controls
                , div
                    [ style "display" "flex"
                    , style "flex-direction" "column"
                    , style "gap" "14px"
                    ]
                    [ renderMetricsCard metrics
                    , renderControlsCard model
                    ]
                ]
            ]
        ]


{-| Render SVG Canvas with PV loop and elastance lines.
-}
renderPvSvg : Pv.PvLoopModel -> Pv.PvLoopMetrics -> List Pv.PvCoordinates -> Html Msg
renderPvSvg model metrics trajectory =
    let
        svgW =
            490.0

        svgH =
            340.0

        padL =
            50.0

        padR =
            20.0

        padB =
            40.0

        padT =
            20.0

        mapX vol =
            padL + (vol / 180.0) * (svgW - padL - padR)

        mapY press =
            (svgH - padB) - (press / 160.0) * (svgH - padT - padB)

        pathPoints =
            case trajectory of
                [] ->
                    ""

                p0 :: rest ->
                    let
                        startCmd =
                            "M " ++ String.fromFloat (mapX p0.volumeMl) ++ " " ++ String.fromFloat (mapY p0.pressureMmHg)

                        lineCmds =
                            List.map (\p -> "L " ++ String.fromFloat (mapX p.volumeMl) ++ " " ++ String.fromFloat (mapY p.pressureMmHg)) rest
                                |> String.join " "
                    in
                    startCmd ++ " " ++ lineCmds ++ " Z"

        -- ESPVR Line from V0 to 180 mL
        espvrX1 =
            mapX model.v0Ml

        espvrY1 =
            mapY 0.0

        espvrX2 =
            mapX 160.0

        espvrY2 =
            mapY (Pv.evaluateEspvr model 160.0)

        -- EDPVR curve samples
        edpvrPoints =
            List.range 0 30
                |> List.map
                    (\i ->
                        let
                            vol =
                                toFloat i * 5.0

                            press =
                                Pv.evaluateEdpvr model vol
                        in
                        String.fromFloat (mapX vol) ++ "," ++ String.fromFloat (mapY press)
                    )
                |> String.join " "
    in
    Svg.svg
        [ SvgAttr.width "100%"
        , SvgAttr.height "340"
        , SvgAttr.viewBox ("0 0 " ++ String.fromFloat svgW ++ " " ++ String.fromFloat svgH)
        ]
        [ -- Grid Lines
          Svg.line [ SvgAttr.x1 (String.fromFloat padL), SvgAttr.y1 (String.fromFloat (mapY 50.0)), SvgAttr.x2 (String.fromFloat (svgW - padR)), SvgAttr.y2 (String.fromFloat (mapY 50.0)), SvgAttr.stroke Theme.bezelColor, SvgAttr.strokeDasharray "3 3" ] []
        , Svg.line [ SvgAttr.x1 (String.fromFloat padL), SvgAttr.y1 (String.fromFloat (mapY 100.0)), SvgAttr.x2 (String.fromFloat (svgW - padR)), SvgAttr.y2 (String.fromFloat (mapY 100.0)), SvgAttr.stroke Theme.bezelColor, SvgAttr.strokeDasharray "3 3" ] []
        , Svg.line [ SvgAttr.x1 (String.fromFloat (mapX 50.0)), SvgAttr.y1 (String.fromFloat padT), SvgAttr.x2 (String.fromFloat (mapX 50.0)), SvgAttr.y2 (String.fromFloat (svgH - padB)), SvgAttr.stroke Theme.bezelColor, SvgAttr.strokeDasharray "3 3" ] []
        , Svg.line [ SvgAttr.x1 (String.fromFloat (mapX 100.0)), SvgAttr.y1 (String.fromFloat padT), SvgAttr.x2 (String.fromFloat (mapX 100.0)), SvgAttr.y2 (String.fromFloat (svgH - padB)), SvgAttr.stroke Theme.bezelColor, SvgAttr.strokeDasharray "3 3" ] []

        -- Axes
        , Svg.line [ SvgAttr.x1 (String.fromFloat padL), SvgAttr.y1 (String.fromFloat (svgH - padB)), SvgAttr.x2 (String.fromFloat (svgW - padR)), SvgAttr.y2 (String.fromFloat (svgH - padB)), SvgAttr.stroke Theme.textMutedColor ] []
        , Svg.line [ SvgAttr.x1 (String.fromFloat padL), SvgAttr.y1 (String.fromFloat padT), SvgAttr.x2 (String.fromFloat padL), SvgAttr.y2 (String.fromFloat (svgH - padB)), SvgAttr.stroke Theme.textMutedColor ] []

        -- Axis Labels
        , Svg.text_ [ SvgAttr.x (String.fromFloat (svgW / 2.0)), SvgAttr.y (String.fromFloat (svgH - 10.0)), SvgAttr.fill Theme.textMutedColor, SvgAttr.fontSize "11", SvgAttr.textAnchor "middle" ] [ Svg.text "Left Ventricular Volume (mL)" ]
        , Svg.text_ [ SvgAttr.x "16", SvgAttr.y (String.fromFloat (svgH / 2.0)), SvgAttr.fill Theme.textMutedColor, SvgAttr.fontSize "11", SvgAttr.textAnchor "middle", SvgAttr.transform ("rotate(-90 16 " ++ String.fromFloat (svgH / 2.0) ++ ")") ] [ Svg.text "Pressure (mmHg)" ]

        -- ESPVR Slope Line (Gold dashed)
        , Svg.line [ SvgAttr.x1 (String.fromFloat espvrX1), SvgAttr.y1 (String.fromFloat espvrY1), SvgAttr.x2 (String.fromFloat espvrX2), SvgAttr.y2 (String.fromFloat espvrY2), SvgAttr.stroke Theme.capnoColor, SvgAttr.strokeWidth "1.5", SvgAttr.strokeDasharray "4 4" ] []

        -- EDPVR Exponential Curve (Blue dashed)
        , Svg.polyline [ SvgAttr.points edpvrPoints, SvgAttr.fill "none", SvgAttr.stroke Theme.cvpColor, SvgAttr.strokeWidth "1.5", SvgAttr.strokeDasharray "3 3" ] []

        -- PV Loop Trajectory
        , Svg.path [ SvgAttr.d pathPoints, SvgAttr.fill "rgba(255, 42, 75, 0.15)", SvgAttr.stroke Theme.abpColor, SvgAttr.strokeWidth "2.5" ] []
        ]


{-| Render numerical diagnostic readouts.
-}
renderMetricsCard : Pv.PvLoopMetrics -> Html Msg
renderMetricsCard m =
    div
        [ style "background" Theme.cardColor
        , style "border" ("1px solid " ++ Theme.bezelColor)
        , style "border-radius" "8px"
        , style "padding" "14px"
        , style "display" "flex"
        , style "flex-direction" "column"
        , style "gap" "8px"
        ]
        [ div [ style "font-size" "11px", style "font-weight" "700", style "color" Theme.ppgColor, style "letter-spacing" "0.05em" ] [ text "HEMODYNAMIC INDICES" ]
        , renderMetricRow "Stroke Volume (SV)" (String.fromFloat (round1 m.strokeVolumeMl) ++ " mL")
        , renderMetricRow "Ejection Fraction (EF)" (String.fromFloat (round1 m.ejectionFractionPercent) ++ " %")
        , renderMetricRow "End-Systolic Elastance (Ees)" (String.fromFloat (round2 m.endSystolicElastanceEes) ++ " mmHg/mL")
        , renderMetricRow "Arterial Elastance (Ea)" (String.fromFloat (round2 m.arterialElastanceEa) ++ " mmHg/mL")
        , renderMetricRow "V-A Coupling (Ea / Ees)" (String.fromFloat (round2 m.ventriculoArterialCoupling))
        , renderMetricRow "Stroke Work (SW)" (String.fromFloat (round1 m.strokeWorkMmhgMl) ++ " mmHg*mL")
        , renderMetricRow "Mechanical Efficiency" (String.fromFloat (round1 m.mechanicalEfficiencyPercent) ++ " %")
        ]


renderMetricRow : String -> String -> Html Msg
renderMetricRow label val =
    div
        [ style "display" "flex"
        , style "justify-content" "space-between"
        , style "font-size" "12px"
        ]
        [ span [ style "color" Theme.textMutedColor ] [ text label ]
        , span [ style "color" Theme.textPrimaryColor, style "font-family" "monospace", style "font-weight" "600" ] [ text val ]
        ]


{-| Render interactive tuning sliders for inotropy, preload, and afterload.
-}
renderControlsCard : Pv.PvLoopModel -> Html Msg
renderControlsCard model =
    div
        [ style "background" Theme.cardColor
        , style "border" ("1px solid " ++ Theme.bezelColor)
        , style "border-radius" "8px"
        , style "padding" "14px"
        , style "display" "flex"
        , style "flex-direction" "column"
        , style "gap" "10px"
        ]
        [ div [ style "font-size" "11px", style "font-weight" "700", style "color" Theme.ppgColor, style "letter-spacing" "0.05em" ] [ text "MYOCARDIAL STATE ADJUSTMENT" ]
        , div [ style "display" "flex", style "flex-direction" "column", style "gap" "4px" ]
            [ span [ style "font-size" "11px", style "color" Theme.textMutedColor ] [ text ("Contractility (Ees: " ++ String.fromFloat (round2 model.eesMmHgPerMl) ++ ")") ]
            , div [ style "display" "flex", style "gap" "8px" ]
                [ renderBtn "-0.4" (AdjustContractility (Basics.max 0.6 (model.eesMmHgPerMl - 0.4)))
                , renderBtn "+0.4" (AdjustContractility (Basics.min 5.0 (model.eesMmHgPerMl + 0.4)))
                ]
            ]
        , div [ style "display" "flex", style "flex-direction" "column", style "gap" "4px" ]
            [ span [ style "font-size" "11px", style "color" Theme.textMutedColor ] [ text ("Preload (EDV: " ++ String.fromFloat (round1 model.targetEdvMl) ++ " mL)") ]
            , div [ style "display" "flex", style "gap" "8px" ]
                [ renderBtn "-15 mL" (AdjustPreload (Basics.max 70.0 (model.targetEdvMl - 15.0)))
                , renderBtn "+15 mL" (AdjustPreload (Basics.min 170.0 (model.targetEdvMl + 15.0)))
                ]
            ]
        , div [ style "display" "flex", style "flex-direction" "column", style "gap" "4px" ]
            [ span [ style "font-size" "11px", style "color" Theme.textMutedColor ] [ text ("Afterload (MAP: " ++ String.fromFloat (round1 model.meanArterialPressureMmHg) ++ " mmHg)") ]
            , div [ style "display" "flex", style "gap" "8px" ]
                [ renderBtn "-10 mmHg" (AdjustAfterload (Basics.max 40.0 (model.meanArterialPressureMmHg - 10.0)))
                , renderBtn "+10 mmHg" (AdjustAfterload (Basics.min 150.0 (model.meanArterialPressureMmHg + 10.0)))
                ]
            ]
        ]


renderBtn : String -> Msg -> Html Msg
renderBtn label msg =
    button
        [ onClick msg
        , style "background" Theme.bezelColor
        , style "border" ("1px solid " ++ Theme.cardColor)
        , style "color" Theme.textPrimaryColor
        , style "padding" "4px 10px"
        , style "border-radius" "4px"
        , style "font-size" "11px"
        , style "cursor" "pointer"
        , style "flex" "1"
        ]
        [ text label ]


round1 : Float -> Float
round1 val =
    toFloat (round (val * 10.0)) / 10.0


round2 : Float -> Float
round2 val =
    toFloat (round (val * 100.0)) / 100.0
