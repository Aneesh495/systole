module Protocol.Packet exposing
    ( PacketFrame
    , calculateCrc16
    , decodePacket
    , encodePacket
    , verifyChecksum
    )

{-| Framing and CRC-16 verification for point-of-care serial and UDP packet transport.
Implements CRC-16-CCITT (polynomial 0x1021) with bitwise syndrome checking.
-}

import Bitwise


{-| Standardized telemetry packet container.
-}
type alias PacketFrame =
    { syncWord : Int
    , sequenceNumber : Int
    , payloadLength : Int
    , payloadBytes : List Int
    , checksum : Int
    }


{-| Compute CRC-16-CCITT (polynomial 0x1021, initial value 0xFFFF).
-}
calculateCrc16 : List Int -> Int
calculateCrc16 bytes =
    let
        updateByte byte crc =
            let
                shifted =
                    Bitwise.xor crc (Bitwise.shiftLeftBy 8 (Bitwise.and byte 0xFF))

                stepBit _ currentCrc =
                    if Bitwise.and currentCrc 0x8000 /= 0 then
                        Bitwise.and 0xFFFF (Bitwise.xor (Bitwise.shiftLeftBy 1 currentCrc) 0x1021)

                    else
                        Bitwise.and 0xFFFF (Bitwise.shiftLeftBy 1 currentCrc)
            in
            List.foldl stepBit shifted (List.range 0 7)
    in
    List.foldl updateByte 0xFFFF bytes


{-| Pack payload bytes into an armored frame with sync word 0xAA55 and CRC-16 trailer.
-}
encodePacket : Int -> List Int -> PacketFrame
encodePacket seq payload =
    let
        len =
            List.length payload

        headerBytes =
            [ Bitwise.shiftRightBy 8 seq
            , Bitwise.and seq 0xFF
            , Bitwise.shiftRightBy 8 len
            , Bitwise.and len 0xFF
            ]

        dataToHash =
            headerBytes ++ payload

        crc =
            calculateCrc16 dataToHash
    in
    { syncWord = 0xAA55
    , sequenceNumber = seq
    , payloadLength = len
    , payloadBytes = payload
    , checksum = crc
    }


{-| Verify integrity of received packet against its CRC-16 trailer.
-}
verifyChecksum : PacketFrame -> Bool
verifyChecksum pkt =
    let
        headerBytes =
            [ Bitwise.shiftRightBy 8 pkt.sequenceNumber
            , Bitwise.and pkt.sequenceNumber 0xFF
            , Bitwise.shiftRightBy 8 pkt.payloadLength
            , Bitwise.and pkt.payloadLength 0xFF
            ]

        computedCrc =
            calculateCrc16 (headerBytes ++ pkt.payloadBytes)
    in
    computedCrc == pkt.checksum


{-| Decode raw byte stream into a verified packet frame.
-}
decodePacket : List Int -> Maybe PacketFrame
decodePacket rawBytes =
    case rawBytes of
        0xAA :: 0x55 :: sHigh :: sLow :: lHigh :: lLow :: rest ->
            let
                seq =
                    Bitwise.or (Bitwise.shiftLeftBy 8 sHigh) sLow

                len =
                    Bitwise.or (Bitwise.shiftLeftBy 8 lHigh) lLow

                payload =
                    List.take len rest

                trailer =
                    List.drop len rest
            in
            case trailer of
                cHigh :: cLow :: _ ->
                    let
                        crc =
                            Bitwise.or (Bitwise.shiftLeftBy 8 cHigh) cLow

                        frame =
                            { syncWord = 0xAA55
                            , sequenceNumber = seq
                            , payloadLength = len
                            , payloadBytes = payload
                            , checksum = crc
                            }
                    in
                    if verifyChecksum frame then
                        Just frame

                    else
                        Nothing

                _ ->
                    Nothing

        _ ->
            Nothing
