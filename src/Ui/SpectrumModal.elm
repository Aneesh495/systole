module Ui.SpectrumModal exposing
    ( Msg(..)
    , viewSpectrumModal
    )

{-| Interactive Heart Rate Variability (HRV) Power Spectral Density (PSD) modal dialog.
Renders frequency domain decomposition across VLF, LF, and HF bands with autonomic tone metrics.
-}

import Dsp.Spectrum as Spectrum
import Html exposing (Html, button, div, h2, span, text)
import Html.Attributes exposing (style)
import Html.Events exposing (onClick)
import Svg exposing (Svg)
import Svg.Attributes as SvgAttr
import Ui.Theme as Theme


{-| Spectrum modal messages.
-}
type Msg
    = CloseSpectrumModal


{-| Render the HRV Power Spectral Density modal.
-}
viewSpectrumModal : Spectrum.HrvFrequencyMetrics -> List ( Float, Float ) -> Html Msg
viewSpectrumModal metrics psd =
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
            , style "width" "840px"
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
                        , style "color" Theme.ecgColor
                        ]
                        [ text "AUTONOMIC TONE & HRV POWER SPECTRAL DENSITY" ]
                    , span
                        [ style "font-size" "12px"
                        , style "color" Theme.textMutedColor
                        ]
                        [ text "Welch Periodogram Spectral Estimation and Sympathovagal Balance (LF/HF)" ]
                    ]
                , button
                    [ onClick CloseSpectrumModal
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

            -- Main Body: SVG Periodogram on Left, Autonomic Metrics on Right
            , div
                [ style "display" "grid"
                , style "grid-template-columns" "480px 1fr"
                , style "gap" "20px"
                ]
                [ div
                    [ style "background" Theme.backgroundColor
                    , style "border" ("1px solid " ++ Theme.bezelColor)
                    , style "border-radius" "8px"
                    , style "padding" "12px"
                    ]
                    [ renderPsdSvg psd ]
                , div
                    [ style "display" "flex"
                    , style "flex-direction" "column"
                    , style "gap" "12px"
                    ]
                    [ renderAutonomicCard metrics
                    , renderBandsCard metrics
                    ]
                ]
            ]
        ]


{-| Render SVG Periodogram with color-coded frequency bands:
VLF (0.0033 to 0.04 Hz)
LF (0.04 to 0.15 Hz)
HF (0.15 to 0.40 Hz)
-}
renderPsdSvg : List ( Float, Float ) -> Html Msg
renderPsdSvg psd =
    let
        svgW =
            450.0

        svgH =
            300.0

        padL =
            45.0

        padR =
            15.0

        padT =
            20.0

        padB =
            35.0

        mapX f =
            padL + (f / 0.5) * (svgW - padL - padR)

        maxP =
            List.foldl (\( _, p ) acc -> Basics.max acc p) 10.0 psd

        mapY p =
            (svgH - padB) - (p / maxP) * (svgH - padT - padB)

        -- Band boundary X coordinates
        vlfEndX =
            mapX 0.04

        lfEndX =
            mapX 0.15

        hfEndX =
            mapX 0.40

        -- PSD curve path
        curvePath =
            case List.filter (\( f, _ ) -> f <= 0.5) psd of
                [] ->
                    ""

                p0 :: rest ->
                    let
                        start =
                            "M " ++ String.fromFloat (mapX (Tuple.first p0)) ++ " " ++ String.fromFloat (mapY (Tuple.second p0))

                        lines =
                            List.map (\( f, p ) -> "L " ++ String.fromFloat (mapX f) ++ " " ++ String.fromFloat (mapY p)) rest
                                |> String.join " "
                    in
                    start ++ " " ++ lines
    in
    Svg.svg
        [ SvgAttr.width "100%"
        , SvgAttr.height "300"
        , SvgAttr.viewBox ("0 0 " ++ String.fromFloat svgW ++ " " ++ String.fromFloat svgH)
        ]
        [ -- Shaded Frequency Bands
          -- VLF Band
          Svg.rect
            [ SvgAttr.x (String.fromFloat padL)
            , SvgAttr.y (String.fromFloat padT)
            , SvgAttr.width (String.fromFloat (vlfEndX - padL))
            , SvgAttr.height (String.fromFloat (svgH - padT - padB))
            , SvgAttr.fill "rgba(100, 116, 139, 0.12)"
            ]
            []

        -- LF Band (Sympathetic)
        , Svg.rect
            [ SvgAttr.x (String.fromFloat vlfEndX)
            , SvgAttr.y (String.fromFloat padT)
            , SvgAttr.width (String.fromFloat (lfEndX - vlfEndX))
            , SvgAttr.height (String.fromFloat (svgH - padT - padB))
            , SvgAttr.fill "rgba(255, 204, 0, 0.12)"
            ]
            []

        -- HF Band (Parasympathetic)
        , Svg.rect
            [ SvgAttr.x (String.fromFloat lfEndX)
            , SvgAttr.y (String.fromFloat padT)
            , SvgAttr.width (String.fromFloat (hfEndX - lfEndX))
            , SvgAttr.height (String.fromFloat (svgH - padT - padB))
            , SvgAttr.fill "rgba(0, 255, 65, 0.12)"
            ]
            []

        -- Band Labels
        , Svg.text_ [ SvgAttr.x (String.fromFloat ((padL + vlfEndX) / 2.0)), SvgAttr.y (String.fromFloat (padT + 14.0)), SvgAttr.fill Theme.textMutedColor, SvgAttr.fontSize "10", SvgAttr.textAnchor "middle" ] [ Svg.text "VLF" ]
        , Svg.text_ [ SvgAttr.x (String.fromFloat ((vlfEndX + lfEndX) / 2.0)), SvgAttr.y (String.fromFloat (padT + 14.0)), SvgAttr.fill Theme.capnoColor, SvgAttr.fontSize "10", SvgAttr.textAnchor "middle" ] [ Svg.text "LF" ]
        , Svg.text_ [ SvgAttr.x (String.fromFloat ((lfEndX + hfEndX) / 2.0)), SvgAttr.y (String.fromFloat (padT + 14.0)), SvgAttr.fill Theme.ecgColor, SvgAttr.fontSize "10", SvgAttr.textAnchor "middle" ] [ Svg.text "HF" ]

        -- Axes
        , Svg.line [ SvgAttr.x1 (String.fromFloat padL), SvgAttr.y1 (String.fromFloat (svgH - padB)), SvgAttr.x2 (String.fromFloat (svgW - padR)), SvgAttr.y2 (String.fromFloat (svgH - padB)), SvgAttr.stroke Theme.textMutedColor ] []
        , Svg.line [ SvgAttr.x1 (String.fromFloat padL), SvgAttr.y1 (String.fromFloat padT), SvgAttr.x2 (String.fromFloat padL), SvgAttr.y2 (String.fromFloat (svgH - padB)), SvgAttr.stroke Theme.textMutedColor ] []

        -- Labels
        , Svg.text_ [ SvgAttr.x (String.fromFloat (svgW / 2.0)), SvgAttr.y (String.fromFloat (svgH - 8.0)), SvgAttr.fill Theme.textMutedColor, SvgAttr.fontSize "11", SvgAttr.textAnchor "middle" ] [ Svg.text "Frequency (Hz)" ]

        -- Curve
        , Svg.path [ SvgAttr.d curvePath, SvgAttr.fill "none", SvgAttr.stroke Theme.ecgColor, SvgAttr.strokeWidth "2.0" ] []
        ]


{-| Render autonomic balance diagnostic card.
-}
renderAutonomicCard : Spectrum.HrvFrequencyMetrics -> Html Msg
renderAutonomicCard m =
    let
        toneStatus =
            if m.lfHfRatio > 2.5 then
                ( "Sympathetic Dominance (Stress / Sepsis)", Theme.warningColor )

            else if m.lfHfRatio < 0.8 then
                ( "Parasympathetic Vagal Dominance", Theme.ecgColor )

            else
                ( "Balanced Autonomic Tone", Theme.ppgColor )
    in
    div
        [ style "background" Theme.cardColor
        , style "border" ("1px solid " ++ Theme.bezelColor)
        , style "border-radius" "8px"
        , style "padding" "14px"
        , style "display" "flex"
        , style "flex-direction" "column"
        , style "gap" "10px"
        ]
        [ div [ style "font-size" "11px", style "font-weight" "700", style "color" Theme.ecgColor, style "letter-spacing" "0.05em" ] [ text "AUTONOMIC TONE EVALUATION" ]
        , div [ style "display" "flex", style "justify-content" "space-between", style "align-items" "baseline" ]
            [ span [ style "font-size" "12px", style "color" Theme.textMutedColor ] [ text "LF / HF Ratio:" ]
            , span [ style "font-size" "24px", style "font-family" "monospace", style "font-weight" "700", style "color" (Tuple.second toneStatus) ] [ text (String.fromFloat (round2 m.lfHfRatio)) ]
            ]
        , div [ style "font-size" "12px", style "font-weight" "600", style "color" (Tuple.second toneStatus) ] [ text (Tuple.first toneStatus) ]
        ]


{-| Render frequency power bands breakdown.
-}
renderBandsCard : Spectrum.HrvFrequencyMetrics -> Html Msg
renderBandsCard m =
    div
        [ style "background" Theme.cardColor
        , style "border" ("1px solid " ++ Theme.bezelColor)
        , style "border-radius" "8px"
        , style "padding" "14px"
        , style "display" "flex"
        , style "flex-direction" "column"
        , style "gap" "8px"
        ]
        [ div [ style "font-size" "11px", style "font-weight" "700", style "color" Theme.ecgColor, style "letter-spacing" "0.05em" ] [ text "SPECTRAL POWER BANDS" ]
        , renderBandRow "LF Power (0.04-0.15 Hz)" (String.fromFloat (round1 m.lfPowerMs2) ++ " ms2") Theme.capnoColor
        , renderBandRow "HF Power (0.15-0.40 Hz)" (String.fromFloat (round1 m.hfPowerMs2) ++ " ms2") Theme.ecgColor
        , renderBandRow "VLF Power (0.003-0.04 Hz)" (String.fromFloat (round1 m.vlfPowerMs2) ++ " ms2") Theme.textMutedColor
        , renderBandRow "Total Power" (String.fromFloat (round1 m.totalPowerMs2) ++ " ms2") Theme.textPrimaryColor
        , renderBandRow "Normalized LF (LFnu)" (String.fromFloat (round1 m.lfNormalized) ++ " %") Theme.capnoColor
        , renderBandRow "Normalized HF (HFnu)" (String.fromFloat (round1 m.hfNormalized) ++ " %") Theme.ecgColor
        ]


renderBandRow : String -> String -> String -> Html Msg
renderBandRow label val color =
    div
        [ style "display" "flex"
        , style "justify-content" "space-between"
        , style "font-size" "12px"
        ]
        [ span [ style "color" Theme.textMutedColor ] [ text label ]
        , span [ style "color" color, style "font-family" "monospace", style "font-weight" "600" ] [ text val ]
        ]


round1 : Float -> Float
round1 val =
    toFloat (round (val * 10.0)) / 10.0


round2 : Float -> Float
round2 val =
    toFloat (round (val * 100.0)) / 100.0
