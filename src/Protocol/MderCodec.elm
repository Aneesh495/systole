module Protocol.MderCodec exposing
    ( MderByte
    , encodeIntU8
    , encodeIntU16
    , encodeIntU32
    , encodeFloatShort
    , encodeOid
    , encodeAttributeGroup
    , decodeIntU16
    , decodeIntU32
    )

{-| Medical Device Encoding Rules (MDER) binary serialization.
Implements IEEE 11073-20601 Annex F transfer syntax for low-overhead
binary transport of physiological telemetry and medical device alerts.
-}

import Bitwise


{-| Unsigned 8-bit octet (0 to 255).
-}
type alias MderByte =
    Int


{-| Encode 8-bit unsigned integer into 1 octet.
-}
encodeIntU8 : Int -> List MderByte
encodeIntU8 val =
    [ Bitwise.and val 0xFF ]


{-| Encode 16-bit unsigned integer into 2 octets (Big Endian network order).
-}
encodeIntU16 : Int -> List MderByte
encodeIntU16 val =
    [ Bitwise.shiftRightBy 8 val |> Bitwise.and 0xFF
    , Bitwise.and val 0xFF
    ]


{-| Encode 32-bit unsigned integer into 4 octets (Big Endian network order).
-}
encodeIntU32 : Int -> List MderByte
encodeIntU32 val =
    [ Bitwise.shiftRightBy 24 val |> Bitwise.and 0xFF
    , Bitwise.shiftRightBy 16 val |> Bitwise.and 0xFF
    , Bitwise.shiftRightBy 8 val |> Bitwise.and 0xFF
    , Bitwise.and val 0xFF
    ]


{-| Encode 16-bit short float (SFLOAT) format:
4-bit signed exponent followed by 12-bit signed mantissa.
-}
encodeFloatShort : Float -> List MderByte
encodeFloatShort val =
    let
        -- For physiological vitals like HR 75.0: mantissa = 750, exponent = -1 (0xF)
        -- Represent val * 10 with exponent -1
        scaledMantissa =
            round (val * 10.0)

        exponentNibble =
            0x0F -- -1 in 4-bit two's complement

        mantissa12 =
            Bitwise.and scaledMantissa 0x0FFF

        sfloatWord =
            Bitwise.or (Bitwise.shiftLeftBy 12 exponentNibble) mantissa12
    in
    encodeIntU16 sfloatWord


{-| Encode IEEE 11073 Object Identifier (OID-Type): 16-bit unsigned integer code.
-}
encodeOid : Int -> List MderByte
encodeOid oidCode =
    encodeIntU16 oidCode


{-| Encode ASN.1 Attribute Group with length prefix:
[ AttributeId (16-bit), Length (16-bit), ValueOctets... ]
-}
encodeAttributeGroup : Int -> List MderByte -> List MderByte
encodeAttributeGroup attrId valueOctets =
    let
        lengthBytes =
            encodeIntU16 (List.length valueOctets)

        idBytes =
            encodeIntU16 attrId
    in
    List.concat [ idBytes, lengthBytes, valueOctets ]


{-| Decode 16-bit unsigned integer from 2 octets (Big Endian).
-}
decodeIntU16 : List MderByte -> Maybe ( Int, List MderByte )
decodeIntU16 bytes =
    case bytes of
        b0 :: b1 :: rest ->
            let
                val =
                    Bitwise.or (Bitwise.shiftLeftBy 8 (Bitwise.and b0 0xFF)) (Bitwise.and b1 0xFF)
            in
            Just ( val, rest )

        _ ->
            Nothing


{-| Decode 32-bit unsigned integer from 4 octets (Big Endian).
-}
decodeIntU32 : List MderByte -> Maybe ( Int, List MderByte )
decodeIntU32 bytes =
    case bytes of
        b0 :: b1 :: b2 :: b3 :: rest ->
            let
                p0 =
                    Bitwise.shiftLeftBy 24 (Bitwise.and b0 0xFF)

                p1 =
                    Bitwise.shiftLeftBy 16 (Bitwise.and b1 0xFF)

                p2 =
                    Bitwise.shiftLeftBy 8 (Bitwise.and b2 0xFF)

                p3 =
                    Bitwise.and b3 0xFF

                val =
                    Bitwise.or p0 (Bitwise.or p1 (Bitwise.or p2 p3))
            in
            Just ( val, rest )

        _ ->
            Nothing
