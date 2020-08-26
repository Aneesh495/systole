module Simulation.SignalGenerator exposing
    ( GeneratedSamples
    , GeneratorConfig
    , GeneratorState
    , defaultGeneratorConfig
    , initGeneratorState
    , synthesizeWaveforms
    )

{-| Continuous mathematical physiological signal synthesizer running at 200 Hz.
Implements a 3D vectorcardiographic cardiac dipole model projected across standard 12 leads,
arterial blood pressure pulse contour with dicrotic notch, photoplethysmography with respiratory
modulation, and expiratory capnogram with alveolar plateau.
-}

import Dsp.Types exposing (Lead(..), Timestamp)


{-| Configuration parameters for the waveform generator.
-}
type alias GeneratorConfig =
    { sampleRateHz : Float
    , noiseAmplitudeMv : Float
    , stElevationMv : Float
    , isArrhythmiaActive : Bool
    }


{-| Default nominal generator configuration.
-}
defaultGeneratorConfig : GeneratorConfig
defaultGeneratorConfig =
    { sampleRateHz = 200.0
    , noiseAmplitudeMv = 0.015
    , stElevationMv = 0.0
    , isArrhythmiaActive = False
    }


{-| Instantaneous synchronized sample packet emitted across all monitored channels.
-}
type alias GeneratedSamples =
    { leadI : Float
    , leadII : Float
    , leadIII : Float
    , leadAvr : Float
    , leadAvl : Float
    , leadAvf : Float
    , leadV1 : Float
    , leadV2 : Float
    , leadV3 : Float
    , leadV4 : Float
    , leadV5 : Float
    , leadV6 : Float
    , abpMmhg : Float
    , ppgRed : Float
    , ppgIr : Float
    , capnoMmhg : Float
    , cvpMmhg : Float
    , timestamp : Timestamp
    }


{-| Internal state registers for continuous phase integration.
-}
type alias GeneratorState =
    { config : GeneratorConfig
    , cardiacPhase : Float
    , respiratoryPhase : Float
    , sampleIndex : Int
    , pseudoRandomSeed : Int
    }


{-| Initialize generator state ready for execution.
-}
initGeneratorState : GeneratorConfig -> GeneratorState
initGeneratorState cfg =
    { config = cfg
    , cardiacPhase = 0.0
    , respiratoryPhase = 0.0
    , sampleIndex = 0
    , pseudoRandomSeed = 1337
    }


{-| Linear congruential pseudo-random noise generator for muscle artifact simulation.
-}
nextNoise : Int -> ( Float, Int )
nextNoise seed =
    let
        nextSeed =
            modBy 2147483647 (seed * 16807 + 1)

        norm =
            (toFloat nextSeed / 2147483647.0) * 2.0 - 1.0
    in
    ( norm, nextSeed )


{-| Synthesize synchronized waveform samples at the given timestamp.
Heart rate in BPM, SBP/DBP in mmHg, SpO2 in %, EtCO2 in mmHg, and CVP in mmHg.
-}
synthesizeWaveforms :
    Float
    -> Float
    -> Float
    -> Float
    -> Float
    -> Float
    -> Timestamp
    -> GeneratorState
    -> ( GeneratedSamples, GeneratorState )
synthesizeWaveforms hr sbp dbp spo2 etco2 cvp timestamp state =
    let
        fs =
            state.config.sampleRateHz

        -- Advance cardiac phase: period T_cardiac = 60.0 / HR seconds
        cardiacFreq =
            hr / 60.0

        dCardiacPhase =
            (2.0 * pi * cardiacFreq) / fs

        nextCardiacPhase =
            let
                p =
                    state.cardiacPhase + dCardiacPhase
            in
            if p >= 2.0 * pi then
                p - 2.0 * pi

            else
                p

        -- Advance respiratory phase: assumed normal adult 14 breaths/min
        respFreq =
            14.0 / 60.0

        dRespPhase =
            (2.0 * pi * respFreq) / fs

        nextRespPhase =
            let
                p =
                    state.respiratoryPhase + dRespPhase
            in
            if p >= 2.0 * pi then
                p - 2.0 * pi

            else
                p

        -- Noise component
        ( rawNoise, nextSeed ) =
            nextNoise state.pseudoRandomSeed

        noise =
            rawNoise * state.config.noiseAmplitudeMv

        -- 1. Synthesize 12-lead ECG using multi-Gaussian dipole projection
        ecg =
            synthesize12LeadEcg state.cardiacPhase state.config.stElevationMv noise

        -- 2. Synthesize Arterial Blood Pressure contour (systolic upstroke, dicrotic notch, runoff)
        abp =
            synthesizeAbpWave state.cardiacPhase sbp dbp state.respiratoryPhase

        -- 3. Synthesize PPG (Red and IR channels)
        ( ppgRed, ppgIr ) =
            synthesizePpgWaves state.cardiacPhase spo2 state.respiratoryPhase

        -- 4. Synthesize Capnogram (trapezoidal breath cycle)
        capno =
            synthesizeCapnoWave state.respiratoryPhase etco2

        -- 5. Synthesize Central Venous Pressure (a, c, v waves)
        cvpWave =
            synthesizeCvpWave state.cardiacPhase cvp state.respiratoryPhase

        samples =
            { leadI = ecg.leadI
            , leadII = ecg.leadII
            , leadIII = ecg.leadIII
            , leadAvr = ecg.leadAvr
            , leadAvl = ecg.leadAvl
            , leadAvf = ecg.leadAvf
            , leadV1 = ecg.leadV1
            , leadV2 = ecg.leadV2
            , leadV3 = ecg.leadV3
            , leadV4 = ecg.leadV4
            , leadV5 = ecg.leadV5
            , leadV6 = ecg.leadV6
            , abpMmhg = abp
            , ppgRed = ppgRed
            , ppgIr = ppgIr
            , capnoMmhg = capno
            , cvpMmhg = cvpWave
            , timestamp = timestamp
            }

        nextState =
            { state
                | cardiacPhase = nextCardiacPhase
                , respiratoryPhase = nextRespPhase
                , sampleIndex = state.sampleIndex + 1
                , pseudoRandomSeed = nextSeed
            }
    in
    ( samples, nextState )


{-| Multi-lead ECG record.
-}
type alias MultiLeadEcg =
    { leadI : Float
    , leadII : Float
    , leadIII : Float
    , leadAvr : Float
    , leadAvl : Float
    , leadAvf : Float
    , leadV1 : Float
    , leadV2 : Float
    , leadV3 : Float
    , leadV4 : Float
    , leadV5 : Float
    , leadV6 : Float
    }


{-| 3D vector dipole projection for standard 12 leads.
Phase phi is normalized [0, 2*pi).
-}
synthesize12LeadEcg : Float -> Float -> Float -> MultiLeadEcg
synthesize12LeadEcg phi stElev noise =
    let
        -- Gaussian wave packet helper: A * exp(-0.5 * ((phi - mu) / sigma)^2)
        gauss : Float -> Float -> Float -> Float
        gauss a mu sigma =
            let
                d =
                    (phi - mu) / sigma
            in
            a * (e ^ (-0.5 * d * d))

        -- Canonical timing in cardiac cycle: P at 0.7, Q at 1.4, R at 1.6, S at 1.8, T at 2.8
        pWave =
            gauss 0.15 0.7 0.12

        qWave =
            gauss -0.15 1.45 0.04

        rWave =
            gauss 1.45 1.58 0.05

        sWave =
            gauss -0.32 1.72 0.06

        tWave =
            gauss 0.32 2.75 0.28

        stSegment =
            if phi >= 1.8 && phi <= 2.5 then
                stElev

            else
                0.0

        leadIIBase =
            pWave + qWave + rWave + sWave + tWave + stSegment + noise

        -- Projections across leads based on standard cardiac electrical axis (~60 deg)
        leadI =
            leadIIBase * 0.65 + noise

        leadII =
            leadIIBase

        leadIII =
            leadIIBase * 0.45 + noise

        leadAvr =
            -0.85 * leadIIBase + noise

        leadAvl =
            0.35 * leadIIBase + noise

        leadAvf =
            0.75 * leadIIBase + noise

        -- Precordial chest leads (V1 to V6)
        leadV1 =
            -0.5 * rWave + 0.3 * sWave + 0.1 * tWave + (stElev * 0.4) + noise

        leadV2 =
            -0.2 * rWave + 0.5 * sWave + 0.2 * tWave + (stElev * 0.8) + noise

        leadV3 =
            0.6 * rWave - 0.3 * sWave + 0.3 * tWave + (stElev * 1.2) + noise

        leadV4 =
            1.2 * rWave - 0.2 * sWave + 0.35 * tWave + (stElev * 1.4) + noise

        leadV5 =
            1.3 * rWave - 0.15 * sWave + 0.32 * tWave + (stElev * 0.9) + noise

        leadV6 =
            1.0 * rWave - 0.1 * sWave + 0.28 * tWave + (stElev * 0.5) + noise
    in
    { leadI = leadI
    , leadII = leadII
    , leadIII = leadIII
    , leadAvr = leadAvr
    , leadAvl = leadAvl
    , leadAvf = leadAvf
    , leadV1 = leadV1
    , leadV2 = leadV2
    , leadV3 = leadV3
    , leadV4 = leadV4
    , leadV5 = leadV5
    , leadV6 = leadV6
    }


{-| Arterial blood pressure contour with dicrotic notch and respiratory swing.
-}
synthesizeAbpWave : Float -> Float -> Float -> Float -> Float
synthesizeAbpWave cardiacPhase sbp dbp respPhase =
    let
        -- Respiratory sinus pressure swing (+/- 4 mmHg)
        respMod =
            sin respPhase * 3.5

        effSbp =
            sbp + respMod

        effDbp =
            dbp + respMod * 0.5

        pp =
            effSbp - effDbp

        -- Cardiac cycle timing: systole occurs during phase [1.6, 3.2]
        abpVal =
            if cardiacPhase < 1.6 then
                -- Late diastole runoff
                let
                    frac =
                        cardiacPhase / 1.6
                in
                effDbp + (pp * 0.15 * (1.0 - frac))

            else if cardiacPhase <= 2.2 then
                -- Rapid systolic upstroke
                let
                    upFrac =
                        (cardiacPhase - 1.6) / 0.6
                in
                effDbp + (pp * sin (upFrac * (pi / 2.0)))

            else if cardiacPhase <= 2.8 then
                -- Systolic crest and descent to dicrotic notch
                let
                    downFrac =
                        (cardiacPhase - 2.2) / 0.6
                in
                effSbp - (pp * 0.38 * downFrac)

            else if cardiacPhase <= 3.2 then
                -- Dicrotic notch and rebound wave
                let
                    notchFrac =
                        (cardiacPhase - 2.8) / 0.4

                    rebound =
                        sin (notchFrac * pi) * (pp * 0.12)
                in
                effDbp + (pp * 0.62) - (pp * 0.15 * notchFrac) + rebound

            else
                -- Diastolic exponential decay
                let
                    decayFrac =
                        (cardiacPhase - 3.2) / (2.0 * pi - 3.2)
                in
                effDbp + (pp * 0.47 * (e ^ (-1.8 * decayFrac)))
    in
    abpVal


{-| Photoplethysmography (PPG) dual wavelength curves (Red and IR).
-}
synthesizePpgWaves : Float -> Float -> Float -> ( Float, Float )
synthesizePpgWaves cardiacPhase spo2 respPhase =
    let
        respMod =
            sin respPhase * 0.05

        -- Arterial pulsation template
        pulse =
            if cardiacPhase >= 1.8 && cardiacPhase <= 3.4 then
                let
                    phi =
                        (cardiacPhase - 1.8) / 1.6
                in
                sin (phi * pi)

            else
                0.0

        -- Infrared optical absorption (940 nm)
        dcIr =
            2.2

        acIr =
            0.18 * pulse * (1.0 + respMod)

        ppgIr =
            dcIr + acIr

        -- Red optical absorption (660 nm) scaled by oxygen saturation
        rRatio =
            (110.0 - spo2) / 25.0

        dcRed =
            1.8

        acRed =
            (acIr / dcIr) * dcRed * rRatio

        ppgRed =
            dcRed + acRed
    in
    ( ppgRed, ppgIr )


{-| Expiratory capnogram partial pressure wave in mmHg.
-}
synthesizeCapnoWave : Float -> Float -> Float
synthesizeCapnoWave respPhase etco2 =
    -- Expiration occupies first half of respiratory cycle [0, pi], inspiration [pi, 2*pi]
    if respPhase <= 0.25 then
        -- Phase I to II rapid expiratory upstroke
        let
            frac =
                respPhase / 0.25
        in
        etco2 * frac * 0.85

    else if respPhase <= pi then
        -- Phase III alveolar plateau (slight upward slope to EtCO2 peak)
        let
            frac =
                (respPhase - 0.25) / (pi - 0.25)
        in
        (etco2 * 0.85) + (etco2 * 0.15 * frac)

    else if respPhase <= pi + 0.3 then
        -- Phase IV rapid inspiratory downstroke
        let
            downFrac =
                (respPhase - pi) / 0.3
        in
        etco2 * (1.0 - downFrac)

    else
        -- Phase I inspiratory zero baseline
        0.0


{-| Central Venous Pressure wave in mmHg.
-}
synthesizeCvpWave : Float -> Float -> Float -> Float
synthesizeCvpWave cardiacPhase cvpBase respPhase =
    let
        -- Intrathoracic pressure respiratory variation (+/- 2.5 mmHg)
        respMod =
            sin respPhase * 2.0

        -- a-wave (atrial contraction, phase ~0.8), c-wave (~1.7), v-wave (~2.6)
        aWave =
            0.8 * (e ^ (-0.5 * (((cardiacPhase - 0.8) / 0.15) ^ 2.0)))

        cWave =
            0.5 * (e ^ (-0.5 * (((cardiacPhase - 1.7) / 0.12) ^ 2.0)))

        vWave =
            0.9 * (e ^ (-0.5 * (((cardiacPhase - 2.6) / 0.2) ^ 2.0)))
    in
    max 0.0 (cvpBase + respMod + aWave + cWave + vWave)
