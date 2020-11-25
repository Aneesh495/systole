module Ui.Controls exposing
    ( ToolbarActions
    , renderControlToolbar
    )

{-| Simulation controls, emergency contingency triggers, and navigation toolbar.
Allows operators to manipulate time acceleration, select pathophysiology scenarios,
trigger acute clinical crises, and toggle diagnostic modal workstations.
-}

import Html exposing (Html, button, div, option, select, span, text)
import Html.Attributes exposing (selected, style, value)
import Html.Events exposing (onClick, onInput)
import Simulation.Scenarios as Scenarios exposing (ClinicalScenario(..))
import Ui.Theme as Theme


{-| Action record for toolbar button events.
-}
type alias ToolbarActions msg =
    { togglePause : msg
    , setSpeed : Float -> msg
    , selectScenario : ClinicalScenario -> msg
    , open12Lead : msg
    , openHemo : msg
    , openPump : msg
    , openPvLoop : msg
    , openVentilator : msg
    , openTrends : msg
    , openSpectrum : msg
    , openEhr : msg
    , toggleWard : msg
    , triggerVfib : msg
    , triggerAsystole : msg
    , resetNominal : msg
    }


{-| Render the clinical control toolbar.
-}
renderControlToolbar :
    Bool
    -> Float
    -> ClinicalScenario
    -> Bool
    -> ToolbarActions msg
    -> Html msg
renderControlToolbar isPaused simSpeed currentScenario isWardView actions =
    div
        [ style "background" "#090d15"
        , style "border-top" "1px solid #141c2b"
        , style "padding" "10px 16px"
        , style "display" "flex"
        , style "justify-content" "space-between"
        , style "align-items" "center"
        , style "flex-wrap" "wrap"
        , style "gap" "10px"
        ]
        [ -- Left group: Playback, Speed, Scenario
          div
            [ style "display" "flex"
            , style "align-items" "center"
            , style "gap" "8px"
            ]
            [ button
                [ onClick actions.togglePause
                , style "background"
                    (if isPaused then
                        Theme.warningColor

                     else
                        "#182234"
                    )
                , style "color"
                    (if isPaused then
                        "#000000"

                     else
                        Theme.textPrimaryColor
                    )
                , style "border" "1px solid #2a3a54"
                , style "border-radius" "4px"
                , style "padding" "6px 12px"
                , style "font-family" "monospace"
                , style "font-weight" "bold"
                , style "font-size" "11px"
                , style "cursor" "pointer"
                ]
                [ text
                    (if isPaused then
                        "RESUME [SPACE]"

                     else
                        "PAUSE [SPACE]"
                    )
                ]
            , div
                [ style "display" "flex"
                , style "gap" "4px"
                ]
                [ speedButton "1x" (simSpeed == 1.0) (actions.setSpeed 1.0)
                , speedButton "2x" (simSpeed == 2.0) (actions.setSpeed 2.0)
                , speedButton "5x" (simSpeed == 5.0) (actions.setSpeed 5.0)
                ]
            , select
                [ onInput
                    (\s ->
                        actions.selectScenario (stringToScenario s)
                    )
                , style "background" "#101826"
                , style "color" Theme.textPrimaryColor
                , style "border" "1px solid #233047"
                , style "border-radius" "4px"
                , style "padding" "6px 8px"
                , style "font-family" "monospace"
                , style "font-size" "11px"
                , style "cursor" "pointer"
                ]
                (List.map (\scen -> renderScenarioOption scen (scen == currentScenario)) Scenarios.allScenarios)
            ]

        -- Center group: Diagnostic Modals and Workstations
        , div
            [ style "display" "flex"
            , style "align-items" "center"
            , style "gap" "6px"
            , style "flex-wrap" "wrap"
            ]
            [ navButton "12-LEAD" actions.open12Lead
            , navButton "HEMO" actions.openHemo
            , navButton "PV LOOP" actions.openPvLoop
            , navButton "VENTILATOR" actions.openVentilator
            , navButton "TRENDS" actions.openTrends
            , navButton "SPECTRUM" actions.openSpectrum
            , navButton "PUMP" actions.openPump
            , navButton "EHR" actions.openEhr
            , button
                [ onClick actions.toggleWard
                , style "background"
                    (if isWardView then
                        Theme.ppgColor

                     else
                        "#182234"
                    )
                , style "color"
                    (if isWardView then
                        "#000000"

                     else
                        Theme.textPrimaryColor
                    )
                , style "border" "1px solid #2a3a54"
                , style "border-radius" "4px"
                , style "padding" "6px 12px"
                , style "font-family" "monospace"
                , style "font-weight" "bold"
                , style "font-size" "11px"
                , style "cursor" "pointer"
                ]
                [ text
                    (if isWardView then
                        "BEDSIDE"

                     else
                        "WARD"
                    )
                ]
            ]

        -- Right group: Emergency Contingency Injectors
        , div
            [ style "display" "flex"
            , style "align-items" "center"
            , style "gap" "6px"
            ]
            [ emergencyButton "INJECT V-FIB" actions.triggerVfib
            , emergencyButton "INJECT ASYSTOLE" actions.triggerAsystole
            , button
                [ onClick actions.resetNominal
                , style "background" "#182234"
                , style "color" Theme.ecgColor
                , style "border" "1px solid #2a3a54"
                , style "border-radius" "4px"
                , style "padding" "6px 10px"
                , style "font-family" "monospace"
                , style "font-weight" "bold"
                , style "font-size" "11px"
                , style "cursor" "pointer"
                ]
                [ text "RESET" ]
            ]
        ]


speedButton : String -> Bool -> msg -> Html msg
speedButton label isActive msg =
    button
        [ onClick msg
        , style "background"
            (if isActive then
                "#2b3c5a"

             else
                "#101826"
            )
        , style "color"
            (if isActive then
                Theme.ppgColor

             else
                Theme.textMutedColor
            )
        , style "border" "1px solid #1e2c44"
        , style "border-radius" "3px"
        , style "padding" "4px 8px"
        , style "font-family" "monospace"
        , style "font-size" "11px"
        , style "font-weight" "bold"
        , style "cursor" "pointer"
        ]
        [ text label ]


navButton : String -> msg -> Html msg
navButton label msg =
    button
        [ onClick msg
        , style "background" "#141d2e"
        , style "color" Theme.textPrimaryColor
        , style "border" "1px solid #263857"
        , style "border-radius" "4px"
        , style "padding" "6px 10px"
        , style "font-family" "monospace"
        , style "font-size" "11px"
        , style "font-weight" "bold"
        , style "cursor" "pointer"
        ]
        [ text label ]


emergencyButton : String -> msg -> Html msg
emergencyButton label msg =
    button
        [ onClick msg
        , style "background" "#2b0a12"
        , style "color" Theme.alertColor
        , style "border" "1px solid #5a1424"
        , style "border-radius" "4px"
        , style "padding" "6px 10px"
        , style "font-family" "monospace"
        , style "font-weight" "bold"
        , style "font-size" "11px"
        , style "cursor" "pointer"
        ]
        [ text label ]


renderScenarioOption : ClinicalScenario -> Bool -> Html msg
renderScenarioOption scen isSel =
    option
        [ value (scenarioToString scen)
        , selected isSel
        ]
        [ text (scenarioToLabel scen) ]


scenarioToString : ClinicalScenario -> String
scenarioToString scen =
    case scen of
        BaselineNominal ->
            "nominal"

        AcuteAnteriorStemi ->
            "stemi"

        SepticShockDistributive ->
            "sepsis"

        TensionPneumothorax ->
            "pneumo"

        HypovolemicHemorrhage ->
            "hemorrhage"

        OpioidRespiratoryDepression ->
            "opioid"

        MalignantHyperthermiaCrisis ->
            "hyperthermia"


stringToScenario : String -> ClinicalScenario
stringToScenario s =
    case s of
        "stemi" ->
            AcuteAnteriorStemi

        "sepsis" ->
            SepticShockDistributive

        "pneumo" ->
            TensionPneumothorax

        "hemorrhage" ->
            HypovolemicHemorrhage

        "opioid" ->
            OpioidRespiratoryDepression

        "hyperthermia" ->
            MalignantHyperthermiaCrisis

        _ ->
            BaselineNominal


scenarioToLabel : ClinicalScenario -> String
scenarioToLabel scen =
    case scen of
        BaselineNominal ->
            "Nominal Resting State"

        AcuteAnteriorStemi ->
            "Acute Anterior STEMI"

        SepticShockDistributive ->
            "Septic Shock (Hyperdynamic)"

        TensionPneumothorax ->
            "Tension Pneumothorax"

        HypovolemicHemorrhage ->
            "Severe Hemorrhagic Shock"

        OpioidRespiratoryDepression ->
            "Opioid Hypoventilation"

        MalignantHyperthermiaCrisis ->
            "Malignant Hyperthermia"
