module Ui.Sweepbar exposing
    ( SweepbarChannel
    , normalizeX
    , renderSweepbarChannel
    , renderWaveformPath
    )

{-| Vector-based bedside oscilloscope sweepbar renderer with phosphor-fade trail decay.
Renders real-time physiological waveforms using pure SVG paths. Features moving erase cursor
and calibrated voltage/pressure vertical scaling adhering to clinical display standards.
-}

import Dsp.Types exposing (WaveformPoint)
import Html exposing (Html)
import Svg exposing (Svg, line, path, rect, svg, text_, text)
import Svg.Attributes as SvgAttr exposing (d, fill, fontSize, height, opacity, stroke, strokeDasharray, strokeLinecap, strokeLinejoin, strokeWidth, viewBox, width, x, x1, x2, y, y1, y2)
import Ui.Theme as Theme


{-| Channel specification for oscilloscope rendering.
-}
type alias SweepbarChannel =
    { title : String
    , leadLabel : String
    , color : String
    , sweepPositionX : Float
    , points : List WaveformPoint
    , minValue : Float
    , maxValue : Float
    , unitString : String
    , heightPx : Float
    }


{-| Render a single physiological waveform sweepbar track in SVG.
Width is normalized to 800 units, height configurable (typically 120-160px).
-}
renderSweepbarChannel : SweepbarChannel -> Html msg
renderSweepbarChannel ch =
    let
        totalWidth =
            800.0

        totalHeight =
            ch.heightPx

        -- Erase cursor bar width ahead of current sweep point
        eraseGap =
            24.0

        cursorX =
            ch.sweepPositionX

        eraseLeft =
            cursorX

        eraseRight =
            min totalWidth (cursorX + eraseGap)

        -- Split points into trail behind cursor and older trace ahead of cursor
        behindPoints =
            List.filter (\p -> normalizeX p.timestamp totalWidth <= cursorX) ch.points

        aheadPoints =
            List.filter (\p -> normalizeX p.timestamp totalWidth > eraseRight) ch.points

        pathBehind =
            renderWaveformPath behindPoints totalWidth totalHeight ch.minValue ch.maxValue

        pathAhead =
            renderWaveformPath aheadPoints totalWidth totalHeight ch.minValue ch.maxValue
    in
    svg
        [ viewBox ("0 0 " ++ String.fromFloat totalWidth ++ " " ++ String.fromFloat totalHeight)
        , width "100%"
        , height (String.fromFloat totalHeight ++ "px")
        , SvgAttr.style "background: #080c12; border-bottom: 1px solid #141c2b; display: block;"
        ]
        [ -- Channel title label
          text_
            [ x "12"
            , y "20"
            , fill ch.color
            , fontSize "12"
            , SvgAttr.fontWeight "bold"
            , SvgAttr.fontFamily "monospace"
            ]
            [ text (ch.title ++ " " ++ ch.leadLabel) ]

        -- Scale indicator
        , text_
            [ x "12"
            , y "36"
            , fill Theme.textMutedColor
            , fontSize "10"
            , SvgAttr.fontFamily "monospace"
            ]
            [ text (String.fromFloat ch.minValue ++ " - " ++ String.fromFloat ch.maxValue ++ " " ++ ch.unitString) ]

        -- Center isoelectric / baseline dashed guide
        , line
            [ x1 "0"
            , y1 (String.fromFloat (totalHeight / 2.0))
            , x2 (String.fromFloat totalWidth)
            , y2 (String.fromFloat (totalHeight / 2.0))
            , stroke "#172133"
            , strokeWidth "1"
            , strokeDasharray "4,4"
            ]
            []

        -- Older wave segment ahead of cursor (dimmer phosphor persistence)
        , path
            [ d pathAhead
            , fill "none"
            , stroke ch.color
            , strokeWidth "1.6"
            , strokeLinecap "round"
            , strokeLinejoin "round"
            , opacity "0.45"
            ]
            []

        -- Active wave segment behind cursor (bright fresh phosphor glow)
        , path
            [ d pathBehind
            , fill "none"
            , stroke ch.color
            , strokeWidth "2.0"
            , strokeLinecap "round"
            , strokeLinejoin "round"
            , opacity "1.0"
            ]
            []

        -- Moving erase cursor head (blanking dark gap)
        , rect
            [ x (String.fromFloat eraseLeft)
            , y "0"
            , width (String.fromFloat eraseGap)
            , height (String.fromFloat totalHeight)
            , fill "#080c12"
            ]
            []

        -- Bright cursor vertical sweep line
        , line
            [ x1 (String.fromFloat cursorX)
            , y1 "0"
            , x2 (String.fromFloat cursorX)
            , y2 (String.fromFloat totalHeight)
            , stroke ch.color
            , strokeWidth "1.5"
            , opacity "0.8"
            ]
            []
        ]


{-| Convert a list of waveform points into an SVG path string.
-}
renderWaveformPath : List WaveformPoint -> Float -> Float -> Float -> Float -> String
renderWaveformPath points totalW totalH minVal maxVal =
    case points of
        [] ->
            ""

        first :: rest ->
            let
                toSvgCoord p =
                    let
                        xCoord =
                            normalizeX p.timestamp totalW

                        valRange =
                            max 0.1 (maxVal - minVal)

                        normVal =
                            (p.value - minVal) / valRange

                        -- Invert Y for SVG (0 is top) with 10% padding
                        padY =
                            totalH * 0.1

                        usableH =
                            totalH * 0.8

                        yCoord =
                            totalH - padY - (normVal * usableH)
                    in
                    ( xCoord, clamp 2.0 (totalH - 2.0) yCoord )

                ( startX, startY ) =
                    toSvgCoord first

                startCmd =
                    "M " ++ String.fromFloat startX ++ " " ++ String.fromFloat startY

                stepCmd p acc =
                    let
                        ( px, py ) =
                            toSvgCoord p
                    in
                    acc ++ " L " ++ String.fromFloat px ++ " " ++ String.fromFloat py
            in
            List.foldl stepCmd startCmd rest


{-| Normalize timestamp into horizontal pixel position [0, totalWidth].
Wraps horizontally across rolling 4-second sweep window.
-}
normalizeX : Float -> Float -> Float
normalizeX timestampMs totalW =
    let
        sweepPeriodMs =
            4000.0

        moduloMs =
            timestampMs - (toFloat (floor (timestampMs / sweepPeriodMs)) * sweepPeriodMs)
    in
    (moduloMs / sweepPeriodMs) * totalW
