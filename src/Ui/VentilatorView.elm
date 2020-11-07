module Ui.VentilatorView exposing
    ( Msg(..)
    , viewVentilatorScreen
    )

{-| Mechanical ventilation graphical monitoring screen.
Displays real-time scalar waveforms for airway pressure (Paw), flow (Vdot),
and delivered volume (V) alongside respiratory mechanics indices.
-}

import Html exposing (Html, button, div, h2, span, text)
import Html.Attributes exposing (style)
import Html.Events exposing (onClick)
import Simulation.Ventilator as Vent
import Svg exposing (Svg)
import Svg.Attributes as SvgAttr
import Ui.Theme as Theme


{-| Ventilator UI interaction messages.
-}
type Msg
    = SetVentMode Vent.VentilationMode
    | AdjustVentRate Float
    | AdjustVentPeep Float
    | AdjustVentTidalVolume Float
    | CloseVentilatorView


{-| Render the full-screen ICU mechanical ventilation graphics mode.
-}
viewVentilatorScreen : Vent.VentilatorSettings -> Vent.VentilatorMechanics -> Vent.VentilatorScalars -> List Float -> List Float -> List Float -> Html Msg
viewVentilatorScreen settings mechanics scalars pawHistory flowHistory volHistory =
    div
        [ style "display" "flex"
        , style "flex-direction" "column"
        , style "gap" "12px"
        , style "padding" "16px"
        , style "background" Theme.backgroundColor
        , style "min-height" "calc(100vh - 120px)"
        ]
        [ -- Top Bar: Header and Mode Switchers
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
                    , style "color" Theme.capnoColor
                    , style "letter-spacing" "0.05em"
                    ]
                    [ text "ICU MECHANICAL VENTILATOR GRAPHICS" ]
                , span [ style "font-size" "11px", style "color" Theme.textMutedColor ] [ text "Continuous Pulmonary Scalar Dynamics and Equation of Motion Solver" ]
                ]
            , div [ style "display" "flex", style "gap" "8px" ]
                [ renderModeBtn "VCV" Vent.VolumeControl (settings.mode == Vent.VolumeControl)
                , renderModeBtn "PCV" Vent.PressureControl (settings.mode == Vent.PressureControl)
                , renderModeBtn "PSV" Vent.PressureSupport (settings.mode == Vent.PressureSupport)
                , button
                    [ onClick CloseVentilatorView
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

        -- Main Grid: 3 Waveform Tracks on Left, Numeric Mechanics Column on Right
        , div
            [ style "display" "grid"
            , style "grid-template-columns" "1fr 280px"
            , style "gap" "12px"
            , style "flex" "1"
            ]
            [ -- Waveform Tracks Column
              div
                [ style "display" "flex"
                , style "flex-direction" "column"
                , style "gap" "10px"
                ]
                [ renderWaveformTrack "Paw (cmH2O)" Theme.capnoColor 0.0 40.0 pawHistory
                , renderWaveformTrack "Flow (L/min)" Theme.ppgColor -60.0 60.0 flowHistory
                , renderWaveformTrack "Volume (mL)" Theme.ecgColor 0.0 600.0 volHistory
                ]

            -- Mechanics Numeric Column
            , div
                [ style "display" "flex"
                , style "flex-direction" "column"
                , style "gap" "10px"
                ]
                [ renderNumericTile "PEAK PRESSURE (PIP)" (String.fromFloat (round1 scalars.peakInspiratoryPressureCmH2o)) "cmH2O" Theme.capnoColor
                , renderNumericTile "PLATEAU PRESSURE (Pplat)" (String.fromFloat (round1 scalars.plateauPressureCmH2o)) "cmH2O" Theme.capnoColor
                , renderNumericTile "TOTAL PEEP" (String.fromFloat (round1 (settings.peepCmH2o + mechanics.autoPeepCmH2o))) "cmH2O" Theme.warningColor
                , renderNumericTile "STATIC COMPLIANCE (Cstat)" (String.fromFloat (round1 mechanics.staticComplianceMlPerCmH2o)) "mL/cmH2O" Theme.ppgColor
                , renderNumericTile "AIRWAY RESISTANCE (Raw)" (String.fromFloat (round1 mechanics.airwayResistanceCmH2oPerLPerSec)) "cmH2O/(L/s)" Theme.alertColor
                , renderNumericTile "DELIVERED TIDAL VOL (Vt)" (String.fromFloat (round1 scalars.deliveredVolumeMl)) "mL" Theme.ecgColor
                ]
            ]
        ]


{-| Render single SVG waveform scalar track.
-}
renderWaveformTrack : String -> String -> Float -> Float -> List Float -> Html Msg
renderWaveformTrack title color minVal maxVal history =
    let
        svgW =
            750.0

        svgH =
            120.0

        padL =
            40.0

        padR =
            10.0

        padT =
            10.0

        padB =
            20.0

        mapX i total =
            padL + (toFloat i / Basics.max 1.0 (toFloat total - 1.0)) * (svgW - padL - padR)

        mapY val =
            let
                clamped =
                    Basics.max minVal (Basics.min maxVal val)

                ratio =
                    (clamped - minVal) / (maxVal - minVal)
            in
            (svgH - padB) - ratio * (svgH - padT - padB)

        n =
            List.length history

        pathData =
            case history of
                [] ->
                    ""

                p0 :: rest ->
                    let
                        startCmd =
                            "M " ++ String.fromFloat (mapX 0 n) ++ " " ++ String.fromFloat (mapY p0)

                        lineCmds =
                            List.indexedMap (\i v -> "L " ++ String.fromFloat (mapX (i + 1) n) ++ " " ++ String.fromFloat (mapY v)) rest
                                |> String.join " "
                    in
                    startCmd ++ " " ++ lineCmds
    in
    div
        [ style "background" Theme.surfaceColor
        , style "border" ("1px solid " ++ Theme.bezelColor)
        , style "border-radius" "8px"
        , style "padding" "10px"
        , style "display" "flex"
        , style "flex-direction" "column"
        , style "gap" "4px"
        ]
        [ div [ style "display" "flex", style "justify-content" "space-between", style "font-size" "11px", style "font-weight" "700", style "color" color ]
            [ span [] [ text title ]
            , span [ style "color" Theme.textMutedColor, style "font-weight" "400" ] [ text (String.fromFloat minVal ++ " to " ++ String.fromFloat maxVal) ]
            ]
        , Svg.svg
            [ SvgAttr.width "100%"
            , SvgAttr.height "120"
            , SvgAttr.viewBox ("0 0 " ++ String.fromFloat svgW ++ " " ++ String.fromFloat svgH)
            ]
            [ -- Zero Baseline
              Svg.line
                [ SvgAttr.x1 (String.fromFloat padL)
                , SvgAttr.y1 (String.fromFloat (mapY 0.0))
                , SvgAttr.x2 (String.fromFloat (svgW - padR))
                , SvgAttr.y2 (String.fromFloat (mapY 0.0))
                , SvgAttr.stroke Theme.bezelColor
                , SvgAttr.strokeDasharray "2 2"
                ]
                []

            -- Waveform Path
            , Svg.path
                [ SvgAttr.d pathData
                , SvgAttr.fill "none"
                , SvgAttr.stroke color
                , SvgAttr.strokeWidth "2.0"
                ]
                []
            ]
        ]


{-| Render numeric measurement tile in the right-hand column.
-}
renderNumericTile : String -> String -> String -> String -> Html Msg
renderNumericTile title val unit color =
    div
        [ style "background" Theme.cardColor
        , style "border" ("1px solid " ++ Theme.bezelColor)
        , style "border-radius" "8px"
        , style "padding" "10px 14px"
        , style "display" "flex"
        , style "justify-content" "space-between"
        , style "align-items" "baseline"
        ]
        [ div []
            [ div [ style "font-size" "10px", style "color" Theme.textMutedColor, style "font-weight" "700", style "letter-spacing" "0.04em" ] [ text title ]
            , div [ style "font-size" "24px", style "font-family" "monospace", style "font-weight" "700", style "color" color ] [ text val ]
            ]
        , span [ style "font-size" "11px", style "color" Theme.textMutedColor ] [ text unit ]
        ]


renderModeBtn : String -> Vent.VentilationMode -> Bool -> Html Msg
renderModeBtn label mode isSelected =
    button
        [ onClick (SetVentMode mode)
        , style "background"
            (if isSelected then
                Theme.capnoColor

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


round1 : Float -> Float
round1 val =
    toFloat (round (val * 10.0)) / 10.0
