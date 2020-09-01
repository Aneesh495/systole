module Ui.InfusionPumpModal exposing
    ( InfusionPumpState
    , renderInfusionPumpModal
    )

{-| Smart syringe infusion pump interface with real-time target-controlled infusion (TCI).
Models multi-channel vasoactive and anesthetic delivery, automated bolus titration,
and predictive forward projection of plasma (Cp) and effect-site (Ce) concentrations.
-}

import Html exposing (Html, button, div, h2, h3, input, label, span, text)
import Html.Attributes exposing (style, type_, value)
import Html.Events exposing (onClick, onInput)
import Pharmacokinetics.Compartment exposing (CompartmentConcentrations)
import Pharmacokinetics.Models exposing (DrugType(..))
import Pharmacokinetics.Pharmacodynamics as PD
import Svg exposing (Svg, circle, line, path, rect, svg, text_)
import Svg.Attributes as SvgAttr exposing (cx, cy, d, fill, fontSize, height, opacity, r, stroke, strokeDasharray, strokeWidth, viewBox, width, x, x1, x2, y, y1, y2)
import Ui.Theme as Theme


{-| Operational state of the smart infusion pump channel.
-}
type alias InfusionPumpState =
    { drug : DrugType
    , isRunning : Bool
    , targetConcentration : Float
    , currentRateMcgMin : Float
    , syringeVolumeRemainingMl : Float
    , syringeTotalCapacityMl : Float
    , concentrations : CompartmentConcentrations
    , historicalCe : List ( Float, Float )
    }


{-| Render the interactive smart infusion pump modal dialog.
-}
renderInfusionPumpModal :
    InfusionPumpState
    -> (DrugType -> msg)
    -> (Float -> msg)
    -> msg
    -> msg
    -> msg
    -> Html msg
renderInfusionPumpModal pumpState selectDrugMsg setRateMsg togglePumpMsg bolusMsg closeMsg =
    let
        drugName =
            case pumpState.drug of
                PropofolMarsh ->
                    "Propofol (Marsh TCI Model)"

                PropofolSchnider ->
                    "Propofol (Schnider TCI Model)"

                Norepinephrine ->
                    "Norepinephrine (Alpha-1 Vasopressor)"

                Dobutamine ->
                    "Dobutamine (Beta-1 Inotrope)"

                Fentanyl ->
                    "Fentanyl (Synthetic Opioid)"

        syringePercent =
            (pumpState.syringeVolumeRemainingMl / pumpState.syringeTotalCapacityMl) * 100.0

        bis =
            PD.calculateBispectralIndex pumpState.concentrations.effectSiteCe

        norepiBoost =
            PD.calculateNorepinephrinePressureBoost pumpState.concentrations.effectSiteCe
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
            , style "max-width" "1100px"
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
                        [ text "SMART SYRINGE INFUSION PUMP & TCI ENGINE" ]
                    , div
                        [ style "color" Theme.textMutedColor
                        , style "font-size" "12px"
                        , style "font-family" "monospace"
                        ]
                        [ text ("Active Protocol: " ++ drugName) ]
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

            -- Drug Selection Tabs
            , div
                [ style "display" "flex"
                , style "gap" "10px"
                , style "margin-bottom" "20px"
                ]
                [ drugTabButton "Propofol (Marsh)" (pumpState.drug == PropofolMarsh) (selectDrugMsg PropofolMarsh)
                , drugTabButton "Propofol (Schnider)" (pumpState.drug == PropofolSchnider) (selectDrugMsg PropofolSchnider)
                , drugTabButton "Norepinephrine" (pumpState.drug == Norepinephrine) (selectDrugMsg Norepinephrine)
                , drugTabButton "Dobutamine" (pumpState.drug == Dobutamine) (selectDrugMsg Dobutamine)
                , drugTabButton "Fentanyl" (pumpState.drug == Fentanyl) (selectDrugMsg Fentanyl)
                ]

            -- Main Infusion Controls and Syringe Status
            , div
                [ style "display" "grid"
                , style "grid-template-columns" "320px 1fr"
                , style "gap" "20px"
                , style "margin-bottom" "24px"
                ]
                [ -- Left: Pump controls and Syringe Level
                  div
                    [ style "background" "#070c14"
                    , style "border" "1px solid #162033"
                    , style "border-radius" "6px"
                    , style "padding" "16px"
                    ]
                    [ div
                        [ style "color" Theme.textMutedColor
                        , style "font-size" "11px"
                        , style "font-family" "monospace"
                        , style "margin-bottom" "6px"
                        ]
                        [ text "SYRINGE RESERVOIR (50 mL)" ]
                    , -- Syringe visual bar
                      div
                        [ style "background" "#141c2b"
                        , style "border" "1px solid #2a3a54"
                        , style "border-radius" "4px"
                        , style "height" "24px"
                        , style "position" "relative"
                        , style "overflow" "hidden"
                        , style "margin-bottom" "12px"
                        ]
                        [ div
                            [ style "background" Theme.ppgColor
                            , style "height" "100%"
                            , style "width" (String.fromFloat syringePercent ++ "%")
                            , style "transition" "width 0.3s ease"
                            ]
                            []
                        , span
                            [ style "position" "absolute"
                            , style "top" "4px"
                            , style "right" "8px"
                            , style "color" Theme.textPrimaryColor
                            , style "font-size" "11px"
                            , style "font-family" "monospace"
                            , style "font-weight" "bold"
                            ]
                            [ text (String.fromFloat (toFloat (round (pumpState.syringeVolumeRemainingMl * 10.0)) / 10.0) ++ " mL remaining") ]
                        ]
                    , div
                        [ style "display" "flex"
                        , style "justify-content" "space-between"
                        , style "align-items" "baseline"
                        , style "margin-bottom" "16px"
                        ]
                        [ span
                            [ style "color" Theme.textMutedColor
                            , style "font-size" "12px"
                            , style "font-family" "monospace"
                            ]
                            [ text "INFUSION RATE" ]
                        , span
                            [ style "color" Theme.textPrimaryColor
                            , style "font-size" "24px"
                            , style "font-weight" "bold"
                            , style "font-family" "monospace"
                            ]
                            [ text (String.fromInt (round pumpState.currentRateMcgMin) ++ " mcg/min") ]
                        ]
                    , -- Action buttons: Start/Stop and Bolus
                      div
                        [ style "display" "flex"
                        , style "flex-direction" "column"
                        , style "gap" "10px"
                        ]
                        [ button
                            [ onClick togglePumpMsg
                            , style "background"
                                (if pumpState.isRunning then
                                    Theme.alertColor

                                 else
                                    Theme.ecgColor
                                )
                            , style "color" "#000000"
                            , style "border" "none"
                            , style "border-radius" "4px"
                            , style "padding" "12px"
                            , style "font-family" "monospace"
                            , style "font-weight" "bold"
                            , style "font-size" "14px"
                            , style "cursor" "pointer"
                            ]
                            [ text
                                (if pumpState.isRunning then
                                    "STOP INFUSION"

                                 else
                                    "START INFUSION"
                                )
                            ]
                        , button
                            [ onClick bolusMsg
                            , style "background" "#202d42"
                            , style "color" Theme.textPrimaryColor
                            , style "border" "1px solid #364b6e"
                            , style "border-radius" "4px"
                            , style "padding" "10px"
                            , style "font-family" "monospace"
                            , style "font-weight" "bold"
                            , style "font-size" "13px"
                            , style "cursor" "pointer"
                            ]
                            [ text "DELIVER INDUCTION BOLUS" ]
                        ]
                    ]

                -- Right: Real-time PK/PD Predictive Concentration Graph
                , div
                    [ style "background" "#06090e"
                    , style "border" "1px solid #162033"
                    , style "border-radius" "6px"
                    , style "padding" "16px"
                    ]
                    [ div
                        [ style "display" "flex"
                        , style "justify-content" "space-between"
                        , style "margin-bottom" "8px"
                        ]
                        [ span
                            [ style "color" Theme.ppgColor
                            , style "font-size" "12px"
                            , style "font-weight" "bold"
                            , style "font-family" "monospace"
                            ]
                            [ text "PHARMACOKINETIC CONCENTRATION PROFILE (Cp vs Ce)" ]
                        , span
                            [ style "color" Theme.textMutedColor
                            , style "font-size" "11px"
                            , style "font-family" "monospace"
                            ]
                            [ text "Plasma Cp (Cyan) | Effect-Site Ce (Orange)" ]
                        ]
                    , renderPkGraph pumpState.concentrations
                    ]
                ]

            -- Pharmacodynamic Effect Readouts
            , div
                [ style "display" "grid"
                , style "grid-template-columns" "repeat(3, 1fr)"
                , style "gap" "14px"
                ]
                [ pdCard "CENTRAL CONCENTRATION (Cp)" (String.fromFloat (roundFloat 2 pumpState.concentrations.centralCp)) "mcg/mL"
                , pdCard "EFFECT-SITE CONCENTRATION (Ce)" (String.fromFloat (roundFloat 2 pumpState.concentrations.effectSiteCe)) "mcg/mL"
                , if pumpState.drug == PropofolMarsh || pumpState.drug == PropofolSchnider then
                    pdCard "BISPECTRAL INDEX (BIS)" (String.fromInt (round bis)) "Target 40 - 60"

                  else
                    pdCard "PREDICTED MAP BOOST" ("+" ++ String.fromInt (round norepiBoost)) "mmHg"
                ]
            ]
        ]


drugTabButton : String -> Bool -> msg -> Html msg
drugTabButton label isSelected clickMsg =
    button
        [ onClick clickMsg
        , style "background"
            (if isSelected then
                Theme.ppgColor

             else
                "#141c2b"
            )
        , style "color"
            (if isSelected then
                "#000000"

             else
                Theme.textPrimaryColor
            )
        , style "border"
            (if isSelected then
                "none"

             else
                "1px solid #233047"
            )
        , style "border-radius" "4px"
        , style "padding" "8px 16px"
        , style "font-family" "monospace"
        , style "font-weight" "bold"
        , style "font-size" "12px"
        , style "cursor" "pointer"
        ]
        [ text label ]


pdCard : String -> String -> String -> Html msg
pdCard label val unit =
    div
        [ style "background" "#0e1522"
        , style "border" "1px solid #182234"
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
            , style "margin-top" "4px"
            ]
            [ span
                [ style "color" Theme.textPrimaryColor
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
        ]


renderPkGraph : CompartmentConcentrations -> Html msg
renderPkGraph concs =
    let
        w =
            650.0

        h =
            180.0

        -- Scaled bar indicators for active concentrations
        cpY =
            150.0 - (clamp 0.0 8.0 concs.centralCp / 8.0) * 120.0

        ceY =
            150.0 - (clamp 0.0 8.0 concs.effectSiteCe / 8.0) * 120.0
    in
    svg
        [ viewBox ("0 0 " ++ String.fromFloat w ++ " " ++ String.fromFloat h)
        , width "100%"
        , height (String.fromFloat h ++ "px")
        ]
        [ -- Axes
          line [ x1 "40", y1 "150", x2 "620", y2 "150", stroke "#2a3a54", strokeWidth "1" ] []
        , line [ x1 "40", y1 "150", x2 "40", y2 "20", stroke "#2a3a54", strokeWidth "1" ] []
        , text_ [ x "580", y "170", fill Theme.textMutedColor, fontSize "10", SvgAttr.fontFamily "monospace" ] [ text "Time (min)" ]
        , text_ [ x "6", y "24", fill Theme.textMutedColor, fontSize "10", SvgAttr.fontFamily "monospace" ] [ text "mcg/mL" ]

        -- Target therapeutic window band (3.0 to 5.0 mcg/mL)
        , rect [ x "40", y "75", width "580", height "30", fill "rgba(0, 229, 255, 0.06)", stroke "rgba(0, 229, 255, 0.2)", strokeDasharray "3,3" ] []
        , text_ [ x "48", y "94", fill Theme.ppgColor, fontSize "10", SvgAttr.fontFamily "monospace" ] [ text "Therapeutic Window (3.0 - 5.0 mcg/mL)" ]

        -- Current Cp marker (Cyan)
        , line [ x1 "180", y1 "150", x2 "180", y2 (String.fromFloat cpY), stroke Theme.ppgColor, strokeWidth "6" ] []
        , circle [ cx "180", cy (String.fromFloat cpY), r "5", fill Theme.ppgColor ] []
        , text_ [ x "192", y (String.fromFloat (cpY + 4.0)), fill Theme.ppgColor, fontSize "11", SvgAttr.fontWeight "bold", SvgAttr.fontFamily "monospace" ] [ text ("Cp: " ++ String.fromFloat (roundFloat 2 concs.centralCp)) ]

        -- Current Ce marker (Orange)
        , line [ x1 "340", y1 "150", x2 "340", y2 (String.fromFloat ceY), stroke Theme.respColor, strokeWidth "6" ] []
        , circle [ cx "340", cy (String.fromFloat ceY), r "5", fill Theme.respColor ] []
        , text_ [ x "352", y (String.fromFloat (ceY + 4.0)), fill Theme.respColor, fontSize "11", SvgAttr.fontWeight "bold", SvgAttr.fontFamily "monospace" ] [ text ("Ce: " ++ String.fromFloat (roundFloat 2 concs.effectSiteCe)) ]
        ]


roundFloat : Int -> Float -> Float
roundFloat decimals n =
    let
        factor =
            10.0 ^ toFloat decimals
    in
    toFloat (round (n * factor)) / factor
