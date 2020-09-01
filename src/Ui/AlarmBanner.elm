module Ui.AlarmBanner exposing
    ( renderAlarmBanner
    )

{-| IEC 60601-1-8 clinical alarm presentation banner.
Displays active alarm conditions with standard severity color coding (Red/Yellow/Cyan),
audio silence countdown controls, and alarm latch acknowledgments.
-}

import Alarms.Manager as AM
import Alarms.Types as AT exposing (ActiveAlarm, AlarmPriority(..))
import Html exposing (Html, button, div, span, text)
import Html.Attributes exposing (style)
import Html.Events exposing (onClick)
import Ui.Theme as Theme


{-| Render the top clinical alarm notification banner.
-}
renderAlarmBanner : AM.AlarmManager -> msg -> msg -> Html msg
renderAlarmBanner mgr silenceMsg ackMsg =
    let
        maybeHighest =
            AM.getHighestPriorityAlarm mgr

        alarmCount =
            List.length mgr.activeAlarms
    in
    case maybeHighest of
        Just alarm ->
            let
                bg =
                    case alarm.priority of
                        CrisisHighPriority ->
                            "rgba(255, 0, 51, 0.22)"

                        WarningMediumPriority ->
                            "rgba(255, 204, 0, 0.18)"

                        _ ->
                            "rgba(0, 229, 255, 0.12)"

                textColor =
                    AT.alarmColor alarm.priority

                priorityLabel =
                    AT.priorityToString alarm.priority
            in
            div
                [ style "background" bg
                , style "border-bottom" ("2px solid " ++ textColor)
                , style "padding" "8px 20px"
                , style "display" "flex"
                , style "justify-content" "space-between"
                , style "align-items" "center"
                ]
                [ div
                    [ style "display" "flex"
                    , style "align-items" "center"
                    , style "gap" "12px"
                    ]
                    [ span
                        [ style "background" textColor
                        , style "color" "#000000"
                        , style "font-size" "11px"
                        , style "font-weight" "bold"
                        , style "font-family" "monospace"
                        , style "padding" "3px 8px"
                        , style "border-radius" "3px"
                        ]
                        [ text priorityLabel ]
                    , span
                        [ style "color" textColor
                        , style "font-size" "15px"
                        , style "font-weight" "bold"
                        , style "font-family" "monospace"
                        ]
                        [ text alarm.message ]
                    , if alarmCount > 1 then
                        span
                            [ style "color" Theme.textMutedColor
                            , style "font-size" "12px"
                            , style "font-family" "monospace"
                            ]
                            [ text ("(+" ++ String.fromInt (alarmCount - 1) ++ " other alerts)") ]

                      else
                        text ""
                    ]
                , div
                    [ style "display" "flex"
                    , style "align-items" "center"
                    , style "gap" "10px"
                    ]
                    [ if mgr.isAudioSilenced then
                        button
                            [ onClick silenceMsg
                            , style "background" "#202d42"
                            , style "color" Theme.warningColor
                            , style "border" ("1px solid " ++ Theme.warningColor)
                            , style "border-radius" "4px"
                            , style "padding" "6px 14px"
                            , style "font-family" "monospace"
                            , style "font-size" "12px"
                            , style "font-weight" "bold"
                            , style "cursor" "pointer"
                            ]
                            [ text ("SILENCED (" ++ String.fromInt (round mgr.silenceRemainingSec) ++ "s)") ]

                      else
                        button
                            [ onClick silenceMsg
                            , style "background" "#182234"
                            , style "color" Theme.textPrimaryColor
                            , style "border" "1px solid #2a3a54"
                            , style "border-radius" "4px"
                            , style "padding" "6px 14px"
                            , style "font-family" "monospace"
                            , style "font-size" "12px"
                            , style "font-weight" "bold"
                            , style "cursor" "pointer"
                            ]
                            [ text "SILENCE ALARMS (120s)" ]
                    , button
                        [ onClick ackMsg
                        , style "background" "#182234"
                        , style "color" Theme.textPrimaryColor
                        , style "border" "1px solid #2a3a54"
                        , style "border-radius" "4px"
                        , style "padding" "6px 14px"
                        , style "font-family" "monospace"
                        , style "font-size" "12px"
                        , style "font-weight" "bold"
                        , style "cursor" "pointer"
                        ]
                        [ text "ACKNOWLEDGE" ]
                    ]
                ]

        Nothing ->
            div
                [ style "background" "#0a0e17"
                , style "border-bottom" "1px solid #141c2b"
                , style "padding" "6px 20px"
                , style "display" "flex"
                , style "justify-content" "space-between"
                , style "align-items" "center"
                ]
                [ span
                    [ style "color" Theme.ecgColor
                    , style "font-size" "12px"
                    , style "font-family" "monospace"
                    ]
                    [ text "SYSTEM NOMINAL: All physiological parameters within verified clinical bounds" ]
                , span
                    [ style "color" Theme.textMutedColor
                    , style "font-size" "11px"
                    , style "font-family" "monospace"
                    ]
                    [ text "IEC 60601-1-8 ALARM ENGINE ACTIVE" ]
                ]
