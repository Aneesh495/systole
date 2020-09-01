module Ui.HemodynamicsModal exposing
    ( renderHemodynamicsModal
    )

{-| Advanced hemodynamics and ventricular performance modal dashboard.
Visualizes Frank-Starling myocardial performance curves, systemic vascular resistance (SVR)
versus Cardiac Index (CI) clinical state spaces, and oxygen delivery (DO2) / consumption (VO2) balance.
-}

import Hemodynamics.Calculations exposing (HemodynamicProfile, OxygenTransport)
import Hemodynamics.Targets as Targets exposing (ClinicalState(..), FrankStarlingPosition(..))
import Html exposing (Html, button, div, h2, h3, span, text)
import Html.Attributes exposing (style)
import Html.Events exposing (onClick)
import Svg exposing (Svg, circle, line, path, rect, svg, text_)
import Svg.Attributes as SvgAttr exposing (cx, cy, d, fill, fontSize, height, opacity, r, stroke, strokeDasharray, strokeWidth, viewBox, width, x, x1, x2, y, y1, y2)
import Ui.Theme as Theme


{-| Render the comprehensive hemodynamics dashboard modal.
-}
renderHemodynamicsModal : HemodynamicProfile -> OxygenTransport -> Float -> msg -> Html msg
renderHemodynamicsModal prof o2 cvp closeMsg =
    let
        state =
            Targets.classifyHemodynamicState prof cvp

        fsPos =
            Targets.estimateFrankStarlingPosition cvp prof.strokeVolumeIndexMlM2
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
            , style "max-width" "1200px"
            , style "max-height" "92vh"
            , style "overflow-y" "auto"
            , style "padding" "24px"
            , style "box-shadow" "0 24px 64px rgba(0, 0, 0, 0.8)"
            ]
            [ -- Header
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
                        [ text "ADVANCED HEMODYNAMIC & VENTRICULAR FUNCTION PROFILE" ]
                    , div
                        [ style "color" Theme.textMutedColor
                        , style "font-size" "12px"
                        , style "font-family" "monospace"
                        ]
                        [ text ("Diagnostic State: " ++ clinicalStateToString state) ]
                    ]
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

            -- Graphic Plots Section: Frank-Starling on left, SVR vs CI on right
            , div
                [ style "display" "grid"
                , style "grid-template-columns" "1fr 1fr"
                , style "gap" "20px"
                , style "margin-bottom" "24px"
                ]
                [ renderFrankStarlingChart cvp prof.strokeVolumeIndexMlM2 fsPos
                , renderSvrVsCiChart prof.systemicVascularResistanceDyns prof.cardiacIndexLpmM2 state
                ]

            -- Hemodynamic Metrics Grid
            , div
                [ style "display" "grid"
                , style "grid-template-columns" "repeat(4, 1fr)"
                , style "gap" "14px"
                , style "margin-bottom" "20px"
                ]
                [ hemoCard "CARDIAC INDEX" (String.fromFloat (roundFloat 2 prof.cardiacIndexLpmM2)) "L/min/m²" "Normal 2.5 - 4.0" (prof.cardiacIndexLpmM2 >= 2.5 && prof.cardiacIndexLpmM2 <= 4.0)
                , hemoCard "SVR INDEX" (String.fromInt (round prof.systemicVascularResistanceIndexDyns)) "dyn·s·m²/cm⁵" "Normal 1600 - 2400" (prof.systemicVascularResistanceIndexDyns >= 1600 && prof.systemicVascularResistanceIndexDyns <= 2400)
                , hemoCard "STROKE WORK (LVSWI)" (String.fromFloat (roundFloat 1 prof.leftVentricularStrokeWorkIndexGm)) "g·m/m²" "Normal 45 - 60" (prof.leftVentricularStrokeWorkIndexGm >= 45.0 && prof.leftVentricularStrokeWorkIndexGm <= 60.0)
                , hemoCard "SHOCK INDEX" (String.fromFloat (roundFloat 2 prof.shockIndex)) "ratio" "Normal 0.5 - 0.7 (<0.9)" (prof.shockIndex < 0.9)
                ]

            -- Oxygen Transport Dynamics Grid
            , div
                [ style "background" "#070c14"
                , style "border" "1px solid #162033"
                , style "border-radius" "6px"
                , style "padding" "16px"
                ]
                [ div
                    [ style "color" Theme.ppgColor
                    , style "font-size" "13px"
                    , style "font-weight" "bold"
                    , style "font-family" "monospace"
                    , style "margin-bottom" "12px"
                    ]
                    [ text "TISSUE OXYGEN TRANSPORT DYNAMICS (FICK COUPLING)" ]
                , div
                    [ style "display" "grid"
                    , style "grid-template-columns" "repeat(4, 1fr)"
                    , style "gap" "14px"
                    ]
                    [ hemoCard "OXYGEN DELIVERY (DO2)" (String.fromInt (round o2.oxygenDeliveryLpm)) "mL/min" "Normal 950 - 1150" (o2.oxygenDeliveryLpm >= 900.0)
                    , hemoCard "OXYGEN CONSUMPTION (VO2)" (String.fromInt (round o2.oxygenConsumptionLpm)) "mL/min" "Normal 200 - 250" True
                    , hemoCard "EXTRACTION RATIO (O2ER)" (String.fromFloat (roundFloat 1 o2.oxygenExtractionRatioPercent)) "%" "Normal 22 - 30%" (o2.oxygenExtractionRatioPercent >= 20.0 && o2.oxygenExtractionRatioPercent <= 32.0)
                    , hemoCard "ARTERIAL CONTENT (CaO2)" (String.fromFloat (roundFloat 1 o2.arterialOxygenContentMlDl)) "mL/dL" "Normal 18 - 20" True
                    ]
                ]
            ]
        ]


hemoCard : String -> String -> String -> String -> Bool -> Html msg
hemoCard label val unit normalText isNormal =
    div
        [ style "background" "#0e1522"
        , style "border"
            ("1px solid "
                ++ (if isNormal then
                        "#182234"

                    else
                        Theme.alertColor
                   )
            )
        , style "border-radius" "6px"
        , style "padding" "12px"
        ]
        [ div
            [ style "color" Theme.textMutedColor
            , style "font-size" "11px"
            , style "font-family" "monospace"
            ]
            [ text label ]
        , div
            [ style "display" "flex"
            , style "align-items" "baseline"
            , style "gap" "6px"
            , style "margin" "4px 0"
            ]
            [ span
                [ style "color"
                    (if isNormal then
                        Theme.textPrimaryColor

                     else
                        Theme.alertColor
                    )
                , style "font-size" "24px"
                , style "font-weight" "bold"
                , style "font-family" "monospace"
                ]
                [ text val ]
            , span
                [ style "color" Theme.textMutedColor
                , style "font-size" "12px"
                , style "font-family" "monospace"
                ]
                [ text unit ]
            ]
        , div
            [ style "color"
                (if isNormal then
                    Theme.textMutedColor

                 else
                    Theme.warningColor
                )
            , style "font-size" "10px"
            , style "font-family" "monospace"
            ]
            [ text normalText ]
        ]


{-| Render SVG Frank-Starling curve diagram.
-}
renderFrankStarlingChart : Float -> Float -> FrankStarlingPosition -> Html msg
renderFrankStarlingChart cvp svi pos =
    let
        w =
            460.0

        h =
            220.0

        -- Scaled patient coordinates (CVP 0-20 -> X 40-420, SVI 0-60 -> Y 180-20)
        patientX =
            40.0 + (clamp 0.0 20.0 cvp / 20.0) * 380.0

        patientY =
            180.0 - (clamp 0.0 60.0 svi / 60.0) * 160.0
    in
    div
        [ style "background" "#06090e"
        , style "border" "1px solid #162033"
        , style "border-radius" "6px"
        , style "padding" "12px"
        ]
        [ div
            [ style "color" Theme.cvpColor
            , style "font-size" "12px"
            , style "font-weight" "bold"
            , style "font-family" "monospace"
            , style "margin-bottom" "8px"
            ]
            [ text "FRANK-STARLING MYOCARDIAL PERFORMANCE CURVE" ]
        , svg
            [ viewBox ("0 0 " ++ String.fromFloat w ++ " " ++ String.fromFloat h)
            , width "100%"
            , height (String.fromFloat h ++ "px")
            ]
            [ -- Axes
              line [ x1 "40", y1 "180", x2 "440", y2 "180", stroke "#2a3a54", strokeWidth "1" ] []
            , line [ x1 "40", y1 "180", x2 "40", y2 "20", stroke "#2a3a54", strokeWidth "1" ] []
            , text_ [ x "400", y "200", fill Theme.textMutedColor, fontSize "10", SvgAttr.fontFamily "monospace" ] [ text "Preload (CVP)" ]
            , text_ [ x "8", y "24", fill Theme.textMutedColor, fontSize "10", SvgAttr.fontFamily "monospace" ] [ text "SVI" ]

            -- Target normal operating window box (CVP 4-10, SVI 35-50)
            , rect [ x "116", y "46", width "114", height "40", fill "rgba(0, 255, 65, 0.08)", stroke "rgba(0, 255, 65, 0.3)", strokeDasharray "2,2" ] []
            , text_ [ x "120", y "70", fill Theme.ecgColor, fontSize "10", SvgAttr.fontFamily "monospace" ] [ text "Optimal Zone" ]

            -- Classical Frank-Starling curvilinear sigmoid path
            , path [ d "M 40 175 Q 120 70 240 50 T 440 45", fill "none", stroke "#3d5475", strokeWidth "2" ] []

            -- Depressed failing heart curve
            , path [ d "M 40 178 Q 140 140 280 120 T 440 115", fill "none", stroke "#2a3a54", strokeWidth "1.5", strokeDasharray "4,4" ] []

            -- Current patient operating coordinate dot
            , circle [ cx (String.fromFloat patientX), cy (String.fromFloat patientY), r "6", fill Theme.alertColor ] []
            , circle [ cx (String.fromFloat patientX), cy (String.fromFloat patientY), r "12", fill "none", stroke Theme.alertColor, strokeWidth "1.5", opacity "0.6" ] []
            , text_ [ x (String.fromFloat (patientX + 12.0)), y (String.fromFloat (patientY - 4.0)), fill Theme.textPrimaryColor, fontSize "11", SvgAttr.fontWeight "bold", SvgAttr.fontFamily "monospace" ] [ text "Patient Position" ]
            ]
        ]


{-| Render SVG SVR versus Cardiac Index state space coordinate map.
-}
renderSvrVsCiChart : Float -> Float -> ClinicalState -> Html msg
renderSvrVsCiChart svr ci state =
    let
        w =
            460.0

        h =
            220.0

        -- SVR (200 to 2000 dyn*s/cm^5) -> X (40 to 420), CI (1.0 to 6.0 L/min/m^2) -> Y (180 to 20)
        patientX =
            40.0 + ((clamp 200.0 2000.0 svr - 200.0) / 1800.0) * 380.0

        patientY =
            180.0 - ((clamp 1.0 6.0 ci - 1.0) / 5.0) * 160.0
    in
    div
        [ style "background" "#06090e"
        , style "border" "1px solid #162033"
        , style "border-radius" "6px"
        , style "padding" "12px"
        ]
        [ div
            [ style "color" Theme.abpColor
            , style "font-size" "12px"
            , style "font-weight" "bold"
            , style "font-family" "monospace"
            , style "margin-bottom" "8px"
            ]
            [ text "AFTERLOAD (SVR) VS CONTRACTILITY (CI) STATE SPACE" ]
        , svg
            [ viewBox ("0 0 " ++ String.fromFloat w ++ " " ++ String.fromFloat h)
            , width "100%"
            , height (String.fromFloat h ++ "px")
            ]
            [ -- Axes
              line [ x1 "40", y1 "180", x2 "440", y2 "180", stroke "#2a3a54", strokeWidth "1" ] []
            , line [ x1 "40", y1 "180", x2 "40", y2 "20", stroke "#2a3a54", strokeWidth "1" ] []
            , text_ [ x "390", y "200", fill Theme.textMutedColor, fontSize "10", SvgAttr.fontFamily "monospace" ] [ text "SVR (Afterload)" ]
            , text_ [ x "8", y "24", fill Theme.textMutedColor, fontSize "10", SvgAttr.fontFamily "monospace" ] [ text "CI" ]

            -- Normal target box (SVR 800-1200, CI 2.5-4.0)
            , rect [ x "166", y "84", width "84", height "48", fill "rgba(0, 255, 65, 0.08)", stroke "rgba(0, 255, 65, 0.3)", strokeDasharray "2,2" ] []
            , text_ [ x "170", y "112", fill Theme.ecgColor, fontSize "10", SvgAttr.fontFamily "monospace" ] [ text "Euvolemic" ]

            -- Quadrant labels
            , text_ [ x "50", y "50", fill "rgba(255, 148, 0, 0.6)", fontSize "10", SvgAttr.fontFamily "monospace" ] [ text "Distributive Sepsis" ]
            , text_ [ x "310", y "165", fill "rgba(255, 0, 51, 0.6)", fontSize "10", SvgAttr.fontFamily "monospace" ] [ text "Cardiogenic Shock" ]

            -- Current patient operating coordinate dot
            , circle [ cx (String.fromFloat patientX), cy (String.fromFloat patientY), r "6", fill Theme.abpColor ] []
            , circle [ cx (String.fromFloat patientX), cy (String.fromFloat patientY), r "12", fill "none", stroke Theme.abpColor, strokeWidth "1.5", opacity "0.6" ] []
            , text_ [ x (String.fromFloat (patientX + 12.0)), y (String.fromFloat (patientY - 4.0)), fill Theme.textPrimaryColor, fontSize "11", SvgAttr.fontWeight "bold", SvgAttr.fontFamily "monospace" ] [ text "Patient" ]
            ]
        ]


clinicalStateToString : ClinicalState -> String
clinicalStateToString s =
    case s of
        EuvolemicNominal ->
            "Euvolemic Compensated Normal"

        HypovolemicShock ->
            "Hypovolemic Shock (Volume Depleted)"

        CardiogenicShock ->
            "Cardiogenic Pump Failure"

        DistributiveSepticShock ->
            "Distributive Septic Shock (Vasodilated)"

        ObstructiveShock ->
            "Obstructive Shock (Extrinsic Compression)"


roundFloat : Int -> Float -> Float
roundFloat decimals n =
    let
        factor =
            10.0 ^ toFloat decimals
    in
    toFloat (round (n * factor)) / factor
