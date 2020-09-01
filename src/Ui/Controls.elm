module Ui.Controls exposing
    ( renderControlToolbar
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


{-| Render the clinical control toolbar.
-}
renderControlToolbar :
    Bool
    -> Float
    -> ClinicalScenario
    -> Bool
    -> msg
    -> (Float -> msg)
    -> (ClinicalScenario -> msg)
    -> msg
    -> msg
    -> msg
    -> msg
    -> msg
    -> msg
    -> msg
    -> Html msg
renderControlToolbar isPaused simSpeed currentScenario isWardView togglePauseMsg setSpeedMsg selectScenarioMsg open12LeadMsg openHemoMsg openPumpMsg toggleWardMsg triggerVfibMsg triggerAsystoleMsg resetNominalMsg =
    div
        [ style "background" "#090d15"
        , style "border-top" "1px solid #141c2b"
        , style "padding" "10px 20px"
        , style "display" "flex"
        , style "justify-content" "space-between"
        , style "align-items" "center"
        , style "flex-wrap" "wrap"
        , style "gap" "12px"
        ]
        [ -- Left group: Playback, Speed, Scenario
          div
            [ style "display" "flex"
            , style "align-items" "center"
            , style "gap" "10px"
            ]
            [ button
                [ onClick togglePauseMsg
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
                , style "padding" "6px 14px"
                , style "font-family" "monospace"
                , style "font-weight" "bold"
                , style "font-size" "12px"
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
                [ speedButton "1x" (simSpeed == 1.0) (setSpeedMsg 1.0)
                , speedButton "2x" (simSpeed == 2.0) (setSpeedMsg 2.0)
                , speedButton "5x" (simSpeed == 5.0) (setSpeedMsg 5.0)
                ]
            , select
                [ onInput
                    (\s ->
                        selectScenarioMsg (stringToScenario s)
                    )
                , style "background" "#101826"
                , style "color" Theme.textPrimaryColor
                , style "border" "1px solid #233047"
                , style "border-radius" "4px"
                , style "padding" "6px 10px"
                , style "font-family" "monospace"
                , style "font-size" "12px"
                , style "cursor" "pointer"
                ]
                (List.map (\scen -> renderScenarioOption scen (scen == currentScenario)) Scenarios.allScenarios)
            ]

        -- Center group: Diagnostic Modals and Views
        , div
            [ style "display" "flex"
            , style "align-items" "center"
            , style "gap" "8px"
            ]
            [ navButton "12-LEAD ECG" open12LeadMsg
            , navButton "HEMODYNAMICS" openHemoMsg
            , navButton "INFUSION PUMP" openPumpMsg
            , button
                [ onClick toggleWardMsg
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
                , style "padding" "6px 14px"
                , style "font-family" "monospace"
                , style "font-weight" "bold"
                , style "font-size" "12px"
                , style "cursor" "pointer"
                ]
                [ text
                    (if isWardView then
                        "BEDSIDE MONITOR"

                     else
                        "WARD OVERVIEW"
                    )
                ]
            ]

        -- Right group: Emergency Contingency Injectors
        , div
            [ style "display" "flex"
            , style "align-items" "center"
            , style "gap" "8px"
            ]
            [ emergencyButton "INJECT V-FIB" triggerVfibMsg
            , emergencyButton "INJECT ASYSTOLE" triggerAsystoleMsg
            , button
                [ onClick resetNominalMsg
                , style "background" "#101826"
                , style "color" Theme.ecgColor
                , style "border" ("1px solid " ++ Theme.ecgColor)
                , style "border-radius" "4px"
                , style "padding" "6px 12px"
                , style "font-family" "monospace"
                , style "font-weight" "bold"
                , style "font-size" "11px"
                , style "cursor" "pointer"
                ]
                [ text "RESET NOMINAL" ]
            ]
        ]


speedButton : String -> Bool -> msg -> Html msg
speedButton labelText isSelected clickMsg =
    button
        [ onClick clickMsg
        , style "background"
            (if isSelected then
                Theme.ppgColor

             else
                "#101826"
            )
        , style "color"
            (if isSelected then
                "#000000"

             else
                Theme.textMutedColor
            )
        , style "border" "1px solid #1c2638"
        , style "border-radius" "3px"
        , style "padding" "4px 8px"
        , style "font-family" "monospace"
        , style "font-weight" "bold"
        , style "font-size" "11px"
        , style "cursor" "pointer"
        ]
        [ text labelText ]


navButton : String -> msg -> Html msg
navButton labelText clickMsg =
    button
        [ onClick clickMsg
        , style "background" "#182234"
        , style "color" Theme.textPrimaryColor
        , style "border" "1px solid #2a3a54"
        , style "border-radius" "4px"
        , style "padding" "6px 14px"
        , style "font-family" "monospace"
        , style "font-weight" "bold"
        , style "font-size" "12px"
        , style "cursor" "pointer"
        ]
        [ text labelText ]


emergencyButton : String -> msg -> Html msg
emergencyButton labelText clickMsg =
    button
        [ onClick clickMsg
        , style "background" "rgba(255, 0, 51, 0.15)"
        , style "color" Theme.alertColor
        , style "border" ("1px solid " ++ Theme.alertColor)
        , style "border-radius" "4px"
        , style "padding" "6px 12px"
        , style "font-family" "monospace"
        , style "font-weight" "bold"
        , style "font-size" "11px"
        , style "cursor" "pointer"
        ]
        [ text labelText ]


renderScenarioOption : ClinicalScenario -> Bool -> Html msg
renderScenarioOption scen isSelected =
    option
        [ value (scenarioToKey scen)
        , selected isSelected
        ]
        [ text (Scenarios.scenarioToString scen) ]


scenarioToKey : ClinicalScenario -> String
scenarioToKey scen =
    case scen of
        BaselineNominal ->
            "nominal"

        AcuteAnteriorStemi ->
            "stemi"

        SepticShockDistributive ->
            "sepsis"

        TensionPneumothorax ->
            "pneumothorax"

        HypovolemicHemorrhage ->
            "hemorrhage"

        OpioidRespiratoryDepression ->
            "opioid"

        MalignantHyperthermiaCrisis ->
            "malignant_hyperthermia"


stringToScenario : String -> ClinicalScenario
stringToScenario str =
    case str of
        "stemi" ->
            AcuteAnteriorStemi

        "sepsis" ->
            SepticShockDistributive

        "pneumothorax" ->
            TensionPneumothorax

        "hemorrhage" ->
            HypovolemicHemorrhage

        "opioid" ->
            OpioidRespiratoryDepression

        "malignant_hyperthermia" ->
            MalignantHyperthermiaCrisis

        _ ->
            BaselineNominal
