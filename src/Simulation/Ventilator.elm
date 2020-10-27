module Simulation.Ventilator exposing
    ( FlowWaveform(..)
    , VentilationMode(..)
    , VentilatorMechanics
    , VentilatorScalars
    , VentilatorSettings
    , VentilatorState
    , defaultSettings
    , defaultMechanics
    , initVentilatorState
    , stepVentilator
    )

{-| Mechanical ventilator waveform generator and respiratory mechanics engine.
Synthesizes continuous scalar waveforms for airway pressure (Paw), flow (Vdot),
and delivered volume (V) governed by the clinical Equation of Motion of the Lungs:
Paw(t) = PEEP + Vdot(t) * Raw + V(t) / Cstat
-}


{-| Mechanical ventilation mode.
-}
type VentilationMode
    = VolumeControl
    | PressureControl
    | PressureSupport


{-| Inspiratory flow delivery profile.
-}
type FlowWaveform
    = SquareFlow
    | DeceleratingRamp


{-| Operator-set ventilator parameters.
-}
type alias VentilatorSettings =
    { mode : VentilationMode
    , respiratoryRateBpm : Float
    , tidalVolumeTargetMl : Float
    , inspiratoryPressureTargetCmH2o : Float
    , peepCmH2o : Float
    , iERatio : Float
    -- Inspiratory to expiratory time ratio (e.g. 0.5 for 1:2)
    , inspiratoryPauseFraction : Float
    -- End-inspiratory pause for plateau pressure measurement
    , flowProfile : FlowWaveform
    , fio2Percent : Float
    }


{-| Intrinsic patient lung and chest wall mechanics.
-}
type alias VentilatorMechanics =
    { staticComplianceMlPerCmH2o : Float
    -- Normal ~ 50 to 80 mL/cmH2O in mechanically ventilated patients
    , airwayResistanceCmH2oPerLPerSec : Float
    -- Normal ~ 5 to 15 cmH2O/(L/s) in intubated patients
    , autoPeepCmH2o : Float
    }


{-| Instantaneous scalar output at a single discrete time step.
-}
type alias VentilatorScalars =
    { airwayPressureCmH2o : Float
    , flowLitersPerMin : Float
    , deliveredVolumeMl : Float
    , peakInspiratoryPressureCmH2o : Float
    , plateauPressureCmH2o : Float
    , meanAirwayPressureCmH2o : Float
    }


{-| Internal state for the discrete ventilator solver.
-}
type alias VentilatorState =
    { sampleRate : Float
    , phaseTimeSec : Float
    , currentCycleSec : Float
    , pipTracker : Float
    , platTracker : Float
    , lastPip : Float
    , lastPlat : Float
    }


{-| Default adult ICU ventilator settings (VCV 450 mL, 14 bpm, PEEP 8 cmH2O).
-}
defaultSettings : VentilatorSettings
defaultSettings =
    { mode = VolumeControl
    , respiratoryRateBpm = 14.0
    , tidalVolumeTargetMl = 450.0
    , inspiratoryPressureTargetCmH2o = 18.0
    , peepCmH2o = 8.0
    , iERatio = 0.5
    , inspiratoryPauseFraction = 0.1
    , flowProfile = DeceleratingRamp
    , fio2Percent = 40.0
    }


{-| Default adult lung mechanics with mild ARDS stiffness.
-}
defaultMechanics : VentilatorMechanics
defaultMechanics =
    { staticComplianceMlPerCmH2o = 40.0
    , airwayResistanceCmH2oPerLPerSec = 10.0
    , autoPeepCmH2o = 1.0
    }


{-| Initialize discrete ventilator simulation state.
-}
initVentilatorState : Float -> VentilatorState
initVentilatorState sampleRate =
    { sampleRate = sampleRate
    , phaseTimeSec = 0.0
    , currentCycleSec = 0.0
    , pipTracker = 15.0
    , platTracker = 12.0
    , lastPip = 22.0
    , lastPlat = 18.0
    }


{-| Step the mechanical ventilator engine by one discrete time step dt.
-}
stepVentilator : VentilatorSettings -> VentilatorMechanics -> VentilatorState -> ( VentilatorScalars, VentilatorState )
stepVentilator settings mechanics state =
    let
        dt =
            1.0 / state.sampleRate

        totalCycleDuration =
            60.0 / max 1.0 settings.respiratoryRateBpm

        -- Calculate inspiratory duration Ti from I:E ratio (I:E = ratio, so Ti = Ttot * (ratio / (1 + ratio)))
        ti =
            totalCycleDuration * (settings.iERatio / (1.0 + settings.iERatio))

        tPause =
            ti * settings.inspiratoryPauseFraction

        tActiveInsp =
            ti - tPause

        te =
            totalCycleDuration - ti

        newCycleSec =
            state.currentCycleSec + dt

        isEndOfCycle =
            newCycleSec >= totalCycleDuration

        cycleTime =
            if isEndOfCycle then
                0.0

            else
                newCycleSec

        -- Determine respiratory phase
        isInspiration =
            cycleTime < tActiveInsp

        isInspiratoryPause =
            cycleTime >= tActiveInsp && cycleTime < ti

        isExpiration =
            cycleTime >= ti

        -- Flow calculation (Liters / sec)
        -- Peak flow required to deliver tidal volume during active inspiration
        rawFlowLps =
            if isInspiration then
                let
                    alpha =
                        cycleTime / max 0.01 tActiveInsp
                in
                case settings.flowProfile of
                    SquareFlow ->
                        (settings.tidalVolumeTargetMl / 1000.0) / max 0.01 tActiveInsp

                    DeceleratingRamp ->
                        let
                            peakFlow =
                                2.0 * (settings.tidalVolumeTargetMl / 1000.0) / max 0.01 tActiveInsp
                        in
                        peakFlow * (1.0 - 0.7 * alpha)

            else if isInspiratoryPause then
                0.0

            else
                -- Passive exhalation modeled as exponential decay
                let
                    texp =
                        cycleTime - ti

                    timeConstantRc =
                        (mechanics.staticComplianceMlPerCmH2o / 1000.0) * mechanics.airwayResistanceCmH2oPerLPerSec

                    peakExpFlow =
                        (settings.tidalVolumeTargetMl / 1000.0) / max 0.1 timeConstantRc
                in
                -peakExpFlow * (e ^ (-texp / max 0.1 timeConstantRc))

        -- Volume delivery (mL)
        volumeMl =
            if isInspiration then
                let
                    alpha =
                        cycleTime / max 0.01 tActiveInsp
                in
                settings.tidalVolumeTargetMl * alpha

            else if isInspiratoryPause then
                settings.tidalVolumeTargetMl

            else
                let
                    texp =
                        cycleTime - ti

                    timeConstantRc =
                        (mechanics.staticComplianceMlPerCmH2o / 1000.0) * mechanics.airwayResistanceCmH2oPerLPerSec
                in
                max 0.0 (settings.tidalVolumeTargetMl * (e ^ (-texp / max 0.1 timeConstantRc)))

        -- Airway pressure via Equation of Motion:
        -- Paw = PEEP + (V / Cstat) + (Vdot * Raw)
        elasticPressure =
            volumeMl / max 1.0 mechanics.staticComplianceMlPerCmH2o

        resistivePressure =
            max 0.0 rawFlowLps * mechanics.airwayResistanceCmH2oPerLPerSec

        peepTotal =
            settings.peepCmH2o + mechanics.autoPeepCmH2o

        airwayPressure =
            peepTotal + elasticPressure + resistivePressure

        flowLpm =
            rawFlowLps * 60.0

        -- Track peak and plateau pressures over cycle
        newPip =
            max state.pipTracker airwayPressure

        newPlat =
            if isInspiratoryPause then
                airwayPressure

            else
                state.platTracker

        cycleUpdates =
            if isEndOfCycle then
                { finalPip = newPip
                , finalPlat = newPlat
                , nextPipTracker = 0.0
                , nextPlatTracker = 0.0
                }

            else
                { finalPip = state.lastPip
                , finalPlat = state.lastPlat
                , nextPipTracker = newPip
                , nextPlatTracker = newPlat
                }

        -- Estimated mean airway pressure
        pmean =
            peepTotal + (ti / totalCycleDuration) * (cycleUpdates.finalPlat - peepTotal)

        nextState =
            { state
                | currentCycleSec = cycleTime
                , pipTracker = cycleUpdates.nextPipTracker
                , platTracker = cycleUpdates.nextPlatTracker
                , lastPip = cycleUpdates.finalPip
                , lastPlat = cycleUpdates.finalPlat
            }

        scalars =
            { airwayPressureCmH2o = airwayPressure
            , flowLitersPerMin = flowLpm
            , deliveredVolumeMl = volumeMl
            , peakInspiratoryPressureCmH2o = cycleUpdates.finalPip
            , plateauPressureCmH2o = cycleUpdates.finalPlat
            , meanAirwayPressureCmH2o = pmean
            }
    in
    ( scalars, nextState )
