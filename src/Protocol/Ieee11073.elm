module Protocol.Ieee11073 exposing
    ( Apdu(..)
    , MetricType(..)
    , NumericMetric
    , RtsaMetric
    , ScanReport
    , decodeApdu
    , encodeApdu
    , oidToMetric
    )

{-| IEEE 11073-20601 Domain Information Model (DIM) and Medical Device Encoding Rules (MDER).
Encodes and decodes point-of-care medical device communication packets for interoperable
bedside telemetry streaming and central station decommutation.
-}

import Dsp.Types exposing (Timestamp)
import Json.Decode as Decode exposing (Decoder)
import Json.Encode as Encode


{-| Standard IEEE 11073-10101 medical nomenclature Object Identifiers (OIDs).
-}
type MetricType
    = HeartRateOid
    | ArterialSystolicOid
    | ArterialDiastolicOid
    | ArterialMeanOid
    | SpO2Oid
    | RespirationRateOid
    | EndTidalCo2Oid
    | CentralVenousPressureOid
    | UnknownOid Int


{-| Map 16-bit integer OID to standard clinical metric type.
-}
oidToMetric : Int -> MetricType
oidToMetric oid =
    case oid of
        18818 ->
            HeartRateOid

        18964 ->
            ArterialSystolicOid

        18965 ->
            ArterialDiastolicOid

        18966 ->
            ArterialMeanOid

        19260 ->
            SpO2Oid

        20480 ->
            RespirationRateOid

        20520 ->
            EndTidalCo2Oid

        19000 ->
            CentralVenousPressureOid

        _ ->
            UnknownOid oid


{-| Numeric metric object carrying an instantaneous clinical scalar measurement.
-}
type alias NumericMetric =
    { oid : MetricType
    , value : Float
    , unitCode : Int
    , timestamp : Timestamp
    }


{-| Real-Time Sample Array (RTSA) metric object carrying high-frequency waveform samples.
-}
type alias RtsaMetric =
    { oid : MetricType
    , sampleRateHz : Float
    , samples : List Float
    , timestamp : Timestamp
    }


{-| Periodic scan report containing observed metrics across multiple channels.
-}
type alias ScanReport =
    { scanReportNumber : Int
    , numerics : List NumericMetric
    , waveforms : List RtsaMetric
    , timestamp : Timestamp
    }


{-| IEEE 11073 Application Protocol Data Unit (APDU).
-}
type Apdu
    = AssociationRequest { systemId : String }
    | AssociationResponse { accepted : Bool, systemId : String }
    | PresentationData ScanReport
    | ReleaseRequest


{-| JSON representation encoder for IEEE 11073 presentation APDUs over WebSocket bridges.
-}
encodeApdu : Apdu -> Encode.Value
encodeApdu apdu =
    case apdu of
        AssociationRequest req ->
            Encode.object
                [ ( "type", Encode.string "AARQ" )
                , ( "systemId", Encode.string req.systemId )
                ]

        AssociationResponse resp ->
            Encode.object
                [ ( "type", Encode.string "AARE" )
                , ( "accepted", Encode.bool resp.accepted )
                , ( "systemId", Encode.string resp.systemId )
                ]

        PresentationData report ->
            Encode.object
                [ ( "type", Encode.string "PRST" )
                , ( "reportNumber", Encode.int report.scanReportNumber )
                , ( "timestamp", Encode.float report.timestamp )
                , ( "numerics", Encode.list encodeNumeric report.numerics )
                ]

        ReleaseRequest ->
            Encode.object [ ( "type", Encode.string "RLRQ" ) ]


encodeNumeric : NumericMetric -> Encode.Value
encodeNumeric n =
    Encode.object
        [ ( "oid", Encode.int (metricToOid n.oid) )
        , ( "value", Encode.float n.value )
        , ( "unitCode", Encode.int n.unitCode )
        , ( "timestamp", Encode.float n.timestamp )
        ]


metricToOid : MetricType -> Int
metricToOid m =
    case m of
        HeartRateOid ->
            18818

        ArterialSystolicOid ->
            18964

        ArterialDiastolicOid ->
            18965

        ArterialMeanOid ->
            18966

        SpO2Oid ->
            19260

        RespirationRateOid ->
            20480

        EndTidalCo2Oid ->
            20520

        CentralVenousPressureOid ->
            19000

        UnknownOid custom ->
            custom


{-| Decoder for incoming IEEE 11073 telemetry packets.
-}
decodeApdu : Decoder Apdu
decodeApdu =
    Decode.field "type" Decode.string
        |> Decode.andThen
            (\apduType ->
                case apduType of
                    "AARQ" ->
                        Decode.map (\id -> AssociationRequest { systemId = id })
                            (Decode.field "systemId" Decode.string)

                    "AARE" ->
                        Decode.map2 (\acc id -> AssociationResponse { accepted = acc, systemId = id })
                            (Decode.field "accepted" Decode.bool)
                            (Decode.field "systemId" Decode.string)

                    "PRST" ->
                        Decode.map PresentationData decodeScanReport

                    _ ->
                        Decode.succeed ReleaseRequest
            )


decodeScanReport : Decoder ScanReport
decodeScanReport =
    Decode.map4 ScanReport
        (Decode.field "reportNumber" Decode.int)
        (Decode.field "numerics" (Decode.list decodeNumericMetric))
        (Decode.succeed [])
        (Decode.field "timestamp" Decode.float)


decodeNumericMetric : Decoder NumericMetric
decodeNumericMetric =
    Decode.map4
        (\oidVal val unit ts ->
            { oid = oidToMetric oidVal
            , value = val
            , unitCode = unit
            , timestamp = ts
            }
        )
        (Decode.field "oid" Decode.int)
        (Decode.field "value" Decode.float)
        (Decode.field "unitCode" Decode.int)
        (Decode.field "timestamp" Decode.float)
