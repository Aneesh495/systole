module Ui.EcgGrid exposing
    ( renderCalibrationPulse
    , renderEcgGridBackground
    )

{-| Standard clinical electrocardiographic paper grid renderer.
Renders calibrated millimeter squares adhering to international medical standards:
Minor grid: 1 mm squares (0.04 seconds, 0.1 millivolt at 25 mm/s paper speed).
Major grid: 5 mm squares (0.20 seconds, 0.5 millivolt).
-}

import Svg exposing (Svg, defs, line, path, pattern, rect)
import Svg.Attributes exposing (d, fill, height, id, patternUnits, stroke, strokeWidth, width, x, y)
import Ui.Theme as Theme


{-| Generate SVG defs pattern and background rect for standard clinical pink/tan ECG grid.
-}
renderEcgGridBackground : Float -> Float -> List (Svg msg)
renderEcgGridBackground gridWidth gridHeight =
    [ defs []
        [ -- 1 mm minor grid pattern (approx 8px at standard screen DPI)
          pattern
            [ id "ecg-minor-grid"
            , width "8"
            , height "8"
            , patternUnits "userSpaceOnUse"
            ]
            [ path
                [ d "M 8 0 L 0 0 0 8"
                , fill "none"
                , stroke Theme.gridMinorColor
                , strokeWidth "0.5"
                ]
                []
            ]

        -- 5 mm major grid pattern (40px)
        , pattern
            [ id "ecg-major-grid"
            , width "40"
            , height "40"
            , patternUnits "userSpaceOnUse"
            ]
            [ rect
                [ width "40"
                , height "40"
                , fill "url(#ecg-minor-grid)"
                ]
                []
            , path
                [ d "M 40 0 L 0 0 0 40"
                , fill "none"
                , stroke Theme.gridMajorColor
                , strokeWidth "1.0"
                ]
                []
            ]
        ]
    , rect
        [ x "0"
        , y "0"
        , width (String.fromFloat gridWidth)
        , height (String.fromFloat gridHeight)
        , fill "url(#ecg-major-grid)"
        ]
        []
    ]


{-| Standard 1.0 mV square calibration pulse indicating vertical gain (10 mm/mV) and paper speed.
-}
renderCalibrationPulse : Float -> Float -> Svg msg
renderCalibrationPulse originX originY =
    let
        -- 1 mV height = 40 pixels (5 mm * 2 = 10 mm), duration 200 ms = 40 pixels
        pulseD =
            "M "
                ++ String.fromFloat originX
                ++ " "
                ++ String.fromFloat originY
                ++ " L "
                ++ String.fromFloat (originX + 8.0)
                ++ " "
                ++ String.fromFloat originY
                ++ " L "
                ++ String.fromFloat (originX + 8.0)
                ++ " "
                ++ String.fromFloat (originY - 40.0)
                ++ " L "
                ++ String.fromFloat (originX + 32.0)
                ++ " "
                ++ String.fromFloat (originY - 40.0)
                ++ " L "
                ++ String.fromFloat (originX + 32.0)
                ++ " "
                ++ String.fromFloat originY
                ++ " L "
                ++ String.fromFloat (originX + 44.0)
                ++ " "
                ++ String.fromFloat originY
    in
    path
        [ d pulseD
        , fill "none"
        , stroke Theme.ecgColor
        , strokeWidth "1.8"
        ]
        []
