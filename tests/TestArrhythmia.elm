module TestArrhythmia exposing (suite)

{-| Verification test suite for the arrhythmia classification state machine.
Validates detection of ventricular tachycardia, bigeminy, asystole, and atrial fibrillation.
-}

import Dsp.Arrhythmia as Arr
import Expect
import Test exposing (Test, describe, test)


suite : Test
suite =
    describe "Dsp.Arrhythmia Verification Suite"
        [ test "Three consecutive wide premature beats trigger Ventricular Tachycardia" <|
            \_ ->
                let
                    init =
                        Arr.emptyClassifier

                    -- Seed with 3 normal beats (RR = 800 ms, QRS = 80 ms)
                    ( _, s1 ) =
                        Arr.updateWithBeat 80.0 800.0 800.0 init

                    ( _, s2 ) =
                        Arr.updateWithBeat 80.0 800.0 1600.0 s1

                    ( _, s3 ) =
                        Arr.updateWithBeat 80.0 800.0 2400.0 s2

                    -- Followed by 3 wide, premature ventricular beats (RR = 400 ms, QRS = 140 ms, 150 BPM)
                    ( _, s4 ) =
                        Arr.updateWithBeat 140.0 400.0 2800.0 s3

                    ( _, s5 ) =
                        Arr.updateWithBeat 140.0 400.0 3200.0 s4

                    ( res6, _ ) =
                        Arr.updateWithBeat 140.0 400.0 3600.0 s5
                in
                Expect.all
                    [ \_ -> Expect.equal Arr.VentricularTachycardia res6.rhythm
                    , \_ -> Expect.equal True res6.isEmergency
                    , \_ -> Expect.equal 3 res6.consecutivePvcCount
                    ]
                    ()
        , test "Alternating normal and premature beats trigger Ventricular Bigeminy" <|
            \_ ->
                let
                    init =
                        Arr.emptyClassifier

                    -- Seed normal baseline
                    ( _, s0 ) =
                        Arr.updateWithBeat 80.0 800.0 800.0 init

                    -- V - N - V - N sequence
                    ( _, s1 ) =
                        Arr.updateWithBeat 140.0 450.0 1250.0 s0

                    ( _, s2 ) =
                        Arr.updateWithBeat 80.0 1150.0 2400.0 s1

                    ( _, s3 ) =
                        Arr.updateWithBeat 140.0 450.0 2850.0 s2

                    ( res4, _ ) =
                        Arr.updateWithBeat 80.0 1150.0 4000.0 s3
                in
                Expect.equal Arr.VentricularBigeminy res4.rhythm
        , test "Absence of beats for > 3.0 seconds triggers Asystole crisis" <|
            \_ ->
                let
                    init =
                        Arr.emptyClassifier

                    -- Last beat was at timestamp 1000 ms
                    ( _, s1 ) =
                        Arr.updateWithBeat 80.0 800.0 1000.0 init

                    -- Evaluator runs at 4500 ms (3500 ms pause)
                    ( res, _ ) =
                        Arr.classifyRhythm 4500.0 s1
                in
                Expect.all
                    [ \_ -> Expect.equal Arr.Asystole res.rhythm
                    , \_ -> Expect.equal True res.isEmergency
                    , \_ -> Expect.equal 0.0 res.meanRateBpm
                    ]
                    ()
        , test "Irregularly irregular intervals trigger Atrial Fibrillation" <|
            \_ ->
                let
                    init =
                        Arr.emptyClassifier

                    -- Feed highly erratic RR intervals (CV > 0.22)
                    erraticRrs =
                        [ 480.0, 920.0, 520.0, 1050.0, 610.0, 890.0, 420.0, 1100.0 ]

                    finalClassifier =
                        List.foldl
                            (\rr ( _, st ) ->
                                Arr.updateWithBeat 85.0 rr 1000.0 st
                            )
                            ( { rhythm = Arr.NormalSinusRhythm
                              , isEmergency = False
                              , confidence = 0.0
                              , consecutivePvcCount = 0
                              , meanRateBpm = 0.0
                              , timestamp = 0.0
                              }
                            , init
                            )
                            erraticRrs
                            |> Tuple.second
                in
                Expect.equal Arr.AtrialFibrillation finalClassifier.currentRhythm
        ]
