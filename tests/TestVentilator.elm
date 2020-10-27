module TestVentilator exposing (suite)

import Expect
import Simulation.Ventilator as Vent
import Test exposing (Test, describe, test)


suite : Test
suite =
    describe "Simulation.Ventilator Test Suite"
        [ test "Initial ventilator step outputs baseline PEEP airway pressure" <|
            \_ ->
                let
                    settings =
                        Vent.defaultSettings

                    mechanics =
                        Vent.defaultMechanics

                    initState =
                        Vent.initVentilatorState 100.0

                    ( scalars, _ ) =
                        Vent.stepVentilator settings mechanics initState
                in
                -- Airway pressure should be >= PEEP (8 cmH2O)
                Expect.equal True (scalars.airwayPressureCmH2o >= settings.peepCmH2o)
        , test "Delivered tidal volume rises during inspiration" <|
            \_ ->
                let
                    settings =
                        Vent.defaultSettings

                    mechanics =
                        Vent.defaultMechanics

                    initState =
                        Vent.initVentilatorState 100.0

                    -- Step forward 50 samples (0.5s into inspiration)
                    folder _ ( _, st ) =
                        Vent.stepVentilator settings mechanics st

                    ( scalars, _ ) =
                        List.foldl folder ( { airwayPressureCmH2o = 0.0, flowLitersPerMin = 0.0, deliveredVolumeMl = 0.0, peakInspiratoryPressureCmH2o = 0.0, plateauPressureCmH2o = 0.0, meanAirwayPressureCmH2o = 0.0 }, initState ) (List.range 1 50)
                in
                Expect.all
                    [ \_ -> Expect.equal True (scalars.deliveredVolumeMl > 50.0)
                    , \_ -> Expect.equal True (scalars.flowLitersPerMin > 0.0)
                    , \_ -> Expect.equal True (scalars.airwayPressureCmH2o > settings.peepCmH2o)
                    ]
                    ()
        , test "Reduced lung compliance elevates peak inspiratory pressure" <|
            \_ ->
                let
                    settings =
                        Vent.defaultSettings

                    normalMech =
                        Vent.defaultMechanics

                    stiffMech =
                        { normalMech | staticComplianceMlPerCmH2o = 20.0 }

                    initState =
                        Vent.initVentilatorState 100.0

                    folder mech _ ( _, st ) =
                        Vent.stepVentilator settings mech st

                    ( normalScalars, _ ) =
                        List.foldl (folder normalMech) ( { airwayPressureCmH2o = 0.0, flowLitersPerMin = 0.0, deliveredVolumeMl = 0.0, peakInspiratoryPressureCmH2o = 0.0, plateauPressureCmH2o = 0.0, meanAirwayPressureCmH2o = 0.0 }, initState ) (List.range 1 80)

                    ( stiffScalars, _ ) =
                        List.foldl (folder stiffMech) ( { airwayPressureCmH2o = 0.0, flowLitersPerMin = 0.0, deliveredVolumeMl = 0.0, peakInspiratoryPressureCmH2o = 0.0, plateauPressureCmH2o = 0.0, meanAirwayPressureCmH2o = 0.0 }, initState ) (List.range 1 80)
                in
                Expect.equal True (stiffScalars.airwayPressureCmH2o > normalScalars.airwayPressureCmH2o)
        ]
