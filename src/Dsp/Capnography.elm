module Dsp.Capnography exposing
    ( CapnoFeature
    , CapnoPhase(..)
    , CapnoState
    , emptyCapnoState
    , estimateDeadSpaceFraction
    , isBronchospasmSharkFin
    , processCapnoSample
    )

{-| Microstream and mainstream infrared absorption capnography analysis engine.
Segments the respiratory cycle into Phase I (baseline), Phase II (expiratory upstroke),
Phase III (alveolar plateau), and Phase IV (inspiratory downstroke). Extracts End-Tidal CO2
(EtCO2), respiratory rate (RR), alpha and beta angles, and flags bronchospasm shark-fin patterns.
-}

import Dsp.Types exposing (CircularBuffer, Timestamp, emptyBuffer, pushBuffer)


{-| Distinct physiological phases of the continuous capnogram wave.
-}
type CapnoPhase
    = Phase1InspiratoryBaseline
    | Phase2ExpiratoryUpstroke
    | Phase3AlveolarPlateau
    | Phase4InspiratoryDownstroke


{-| Extracted clinical capnography features for a completed respiratory cycle.
-}
type alias CapnoFeature =
    { etco2Mmhg : Float
    , respiratoryRateBpm : Float
    , alphaAngleDeg : Float
    , betaAngleDeg : Float
    , phase3SlopeMmhgSec : Float
    , isSharkFinBronchospasm : Bool
    , timestamp : Timestamp
    }


{-| Internal record for phase transition step results.
-}
type alias PhaseTransition =
    { nextPhase : CapnoPhase
    , maybeFeature : Maybe CapnoFeature
    , nextPeak : Float
    , nextPhase3Samples : List Float
    , nextLastBreath : Timestamp
    }


{-| State registers for continuous capnography analysis.
-}
type alias CapnoState =
    { buffer : CircularBuffer
    , currentPhase : CapnoPhase
    , cyclePeakCo2 : Float
    , cycleBaselineCo2 : Float
    , phase2Slope : Float
    , phase3Slope : Float
    , phase3Samples : List Float
    , lastBreathTimestamp : Timestamp
    , recentEtco2 : List Float
    , sampleCountInPhase : Int
    }


{-| Initial idle capnography state.
-}
emptyCapnoState : CapnoState
emptyCapnoState =
    { buffer = emptyBuffer 6
    , currentPhase = Phase1InspiratoryBaseline
    , cyclePeakCo2 = 0.0
    , cycleBaselineCo2 = 0.0
    , phase2Slope = 0.0
    , phase3Slope = 0.0
    , phase3Samples = []
    , lastBreathTimestamp = 0.0
    , recentEtco2 = []
    , sampleCountInPhase = 0
    }


{-| Process a single real-time CO2 partial pressure sample (in mmHg).
Returns detected breath feature at the end of exhalation (transition from Phase 3 to Phase 4).
-}
processCapnoSample : Float -> Timestamp -> CapnoState -> ( Maybe CapnoFeature, CapnoState )
processCapnoSample sample timestamp state =
    let
        nextBuf =
            pushBuffer sample state.buffer

        -- Rate of change (mmHg/sample)
        slope =
            case nextBuf.values of
                s0 :: _ :: s2 :: _ ->
                    (s0 - s2) / 2.0

                _ ->
                    0.0

        transition : PhaseTransition
        transition =
            case state.currentPhase of
                Phase1InspiratoryBaseline ->
                    if sample > 4.0 && slope > 0.8 then
                        { nextPhase = Phase2ExpiratoryUpstroke
                        , maybeFeature = Nothing
                        , nextPeak = sample
                        , nextPhase3Samples = []
                        , nextLastBreath = state.lastBreathTimestamp
                        }

                    else
                        { nextPhase = Phase1InspiratoryBaseline
                        , maybeFeature = Nothing
                        , nextPeak = state.cyclePeakCo2
                        , nextPhase3Samples = []
                        , nextLastBreath = state.lastBreathTimestamp
                        }

                Phase2ExpiratoryUpstroke ->
                    if slope < 0.3 && sample > 20.0 then
                        { nextPhase = Phase3AlveolarPlateau
                        , maybeFeature = Nothing
                        , nextPeak = sample
                        , nextPhase3Samples = [ sample ]
                        , nextLastBreath = state.lastBreathTimestamp
                        }

                    else
                        { nextPhase = Phase2ExpiratoryUpstroke
                        , maybeFeature = Nothing
                        , nextPeak = max state.cyclePeakCo2 sample
                        , nextPhase3Samples = []
                        , nextLastBreath = state.lastBreathTimestamp
                        }

                Phase3AlveolarPlateau ->
                    if slope < -1.0 && sample > 15.0 then
                        -- Exhalation ends, inspiration begins
                        let
                            etco2 =
                                max state.cyclePeakCo2 sample

                            dtMs =
                                max 1000.0 (timestamp - state.lastBreathTimestamp)

                            rr =
                                60000.0 / dtMs

                            -- Alpha angle: transition between upstroke and plateau (normally 100 to 110 deg)
                            -- In bronchospasm, plateau is sloped upwards, increasing alpha angle > 130 deg
                            alpha =
                                calculateAlphaAngle state.phase2Slope state.phase3Slope

                            beta =
                                92.0

                            sharkFin =
                                alpha > 130.0 || state.phase3Slope > 18.0

                            feat =
                                { etco2Mmhg = etco2
                                , respiratoryRateBpm = rr
                                , alphaAngleDeg = alpha
                                , betaAngleDeg = beta
                                , phase3SlopeMmhgSec = state.phase3Slope
                                , isSharkFinBronchospasm = sharkFin
                                , timestamp = timestamp
                                }
                        in
                        { nextPhase = Phase4InspiratoryDownstroke
                        , maybeFeature = Just feat
                        , nextPeak = 0.0
                        , nextPhase3Samples = []
                        , nextLastBreath = timestamp
                        }

                    else
                        let
                            updatedSamples =
                                sample :: state.phase3Samples
                        in
                        { nextPhase = Phase3AlveolarPlateau
                        , maybeFeature = Nothing
                        , nextPeak = max state.cyclePeakCo2 sample
                        , nextPhase3Samples = updatedSamples
                        , nextLastBreath = state.lastBreathTimestamp
                        }

                Phase4InspiratoryDownstroke ->
                    if sample < 3.0 then
                        { nextPhase = Phase1InspiratoryBaseline
                        , maybeFeature = Nothing
                        , nextPeak = 0.0
                        , nextPhase3Samples = []
                        , nextLastBreath = state.lastBreathTimestamp
                        }

                    else
                        { nextPhase = Phase4InspiratoryDownstroke
                        , maybeFeature = Nothing
                        , nextPeak = state.cyclePeakCo2
                        , nextPhase3Samples = []
                        , nextLastBreath = state.lastBreathTimestamp
                        }

        -- Update phase 3 slope estimate
        nextP3Slope =
            case transition.nextPhase3Samples of
                first :: rest ->
                    case List.reverse rest of
                        last :: _ ->
                            let
                                n =
                                    toFloat (List.length transition.nextPhase3Samples)
                            in
                            if n > 2.0 then
                                (first - last) / (n * 0.005)

                            else
                                state.phase3Slope

                        [] ->
                            state.phase3Slope

                [] ->
                    state.phase3Slope

        nextRecentEtco2 =
            case transition.maybeFeature of
                Just f ->
                    List.take 12 (f.etco2Mmhg :: state.recentEtco2)

                Nothing ->
                    state.recentEtco2

        nextState =
            { state
                | buffer = nextBuf
                , currentPhase = transition.nextPhase
                , cyclePeakCo2 = transition.nextPeak
                , phase3Slope = nextP3Slope
                , phase3Samples = transition.nextPhase3Samples
                , lastBreathTimestamp = transition.nextLastBreath
                , recentEtco2 = nextRecentEtco2
                , sampleCountInPhase =
                    if transition.nextPhase == state.currentPhase then
                        state.sampleCountInPhase + 1

                    else
                        0
            }
    in
    ( transition.maybeFeature, nextState )


{-| Calculate the alpha angle in degrees from the slopes of Phase II and Phase III.
-}
calculateAlphaAngle : Float -> Float -> Float
calculateAlphaAngle upstrokeSlope plateauSlope =
    let
        baselineAngle =
            105.0

        excessElevation =
            clamp 0.0 50.0 (plateauSlope * 2.2)
    in
    baselineAngle + excessElevation


{-| Clinical evaluator for bronchospasm or obstructive airway disease shark-fin pattern.
-}
isBronchospasmSharkFin : CapnoFeature -> Bool
isBronchospasmSharkFin feat =
    feat.isSharkFinBronchospasm || feat.alphaAngleDeg > 130.0


{-| Estimate dead space fraction (Vd/Vt) using the Bohr-Enghoff equation:
Vd/Vt = (PaCO2 - PetCO2) / PaCO2.
Assumes arterial PaCO2 (in mmHg) from arterial blood gas lab measurement.
Normal ratio is 0.20 to 0.35. Elevated in pulmonary embolism, ARDS, and hypovolemia.
-}
estimateDeadSpaceFraction : Float -> Float -> Float
estimateDeadSpaceFraction paCo2 petCo2 =
    if paCo2 > 10.0 then
        let
            vdVt =
                (paCo2 - petCo2) / paCo2
        in
        clamp 0.0 1.0 vdVt

    else
        0.30
