module TestIeee11073 exposing (suite)

{-| Verification test suite for IEEE 11073 DIM protocol and CRC-16 transport framing.
Validates binary CRC-16 syndrome verification, packet serialization, and FHIR export.
-}

import Expect
import Json.Decode as Decode
import Protocol.Hl7Fhir as Fhir
import Protocol.Ieee11073 as Ieee
import Protocol.Packet as Packet
import Test exposing (Test, describe, test)


suite : Test
suite =
    describe "Protocol & Medical Interoperability Verification Suite"
        [ test "CRC-16-CCITT encodes and verifies valid packet" <|
            \_ ->
                let
                    payload =
                        [ 0x12, 0x34, 0x56, 0x78, 0x9A ]

                    frame =
                        Packet.encodePacket 42 payload

                    isValid =
                        Packet.verifyChecksum frame
                in
                Expect.equal True isValid
        , test "CRC-16 detects single-bit corruption in payload" <|
            \_ ->
                let
                    payload =
                        [ 0x12, 0x34, 0x56, 0x78, 0x9A ]

                    frame =
                        Packet.encodePacket 42 payload

                    -- Corrupt a single bit in the payload
                    corrupted =
                        { frame | payloadBytes = [ 0x12, 0x35, 0x56, 0x78, 0x9A ] }

                    isValid =
                        Packet.verifyChecksum corrupted
                in
                Expect.equal False isValid
        , test "Packet byte decoding reconstitutes valid frame" <|
            \_ ->
                let
                    payload =
                        [ 0xAA, 0xBB, 0xCC ]

                    frame =
                        Packet.encodePacket 1 payload

                    rawBytes =
                        [ 0xAA
                        , 0x55
                        , 0x00
                        , 0x01
                        , 0x00
                        , 0x03
                        , 0xAA
                        , 0xBB
                        , 0xCC
                        , frame.checksum // 256
                        , modBy 256 frame.checksum
                        ]

                    decoded =
                        Packet.decodePacket rawBytes
                in
                case decoded of
                    Just f ->
                        Expect.equal payload f.payloadBytes

                    Nothing ->
                        Expect.fail "Expected packet to decode successfully"
        , test "IEEE 11073 Presentation APDU roundtrips through JSON serialization" <|
            \_ ->
                let
                    report : Ieee.ScanReport
                    report =
                        { scanReportNumber = 101
                        , numerics =
                            [ { oid = Ieee.HeartRateOid
                              , value = 72.0
                              , unitCode = 264864
                              , timestamp = 5000.0
                              }
                            ]
                        , waveforms = []
                        , timestamp = 5000.0
                        }

                    apdu =
                        Ieee.PresentationData report

                    encoded =
                        Ieee.encodeApdu apdu

                    decoded =
                        Decode.decodeValue Ieee.decodeApdu encoded
                in
                case decoded of
                    Ok (Ieee.PresentationData r) ->
                        Expect.equal 101 r.scanReportNumber

                    _ ->
                        Expect.fail "Expected APDU to decode successfully"
        , test "HL7 FHIR Observation formats valid LOINC and UCUM codes" <|
            \_ ->
                let
                    obs =
                        Fhir.buildObservation "obs-hr-1" Fhir.loincHeartRate "Heart Rate" 75.0 "beats/minute" "/min" 12000.0
                in
                Expect.all
                    [ \_ -> Expect.equal "8867-4" obs.loincCode
                    , \_ -> Expect.equal 75.0 obs.valueQuantity
                    , \_ -> Expect.equal "final" obs.status
                    ]
                    ()
        ]
