module TestMderCodec exposing (suite)

import Expect
import Protocol.MderCodec as Mder
import Test exposing (Test, describe, test)


suite : Test
suite =
    describe "Protocol.MderCodec Test Suite"
        [ test "Encode and decode 16-bit integer roundtrip" <|
            \_ ->
                let
                    val =
                        0x4B12

                    encoded =
                        Mder.encodeIntU16 val

                    decoded =
                        Mder.decodeIntU16 encoded
                in
                Expect.all
                    [ \_ -> Expect.equal [ 0x4B, 0x12 ] encoded
                    , \_ -> Expect.equal (Just ( val, [] )) decoded
                    ]
                    ()
        , test "Encode and decode 32-bit integer roundtrip" <|
            \_ ->
                let
                    val =
                        0x12345678

                    encoded =
                        Mder.encodeIntU32 val

                    decoded =
                        Mder.decodeIntU32 encoded
                in
                Expect.all
                    [ \_ -> Expect.equal [ 0x12, 0x34, 0x56, 0x78 ] encoded
                    , \_ -> Expect.equal (Just ( val, [] )) decoded
                    ]
                    ()
        , test "Encode attribute group prepends 16-bit ID and 16-bit length" <|
            \_ ->
                let
                    attrId =
                        0x0928

                    payload =
                        [ 0xAA, 0xBB, 0xCC ]

                    encoded =
                        Mder.encodeAttributeGroup attrId payload
                in
                -- [ 0x09, 0x28, 0x00, 0x03, 0xAA, 0xBB, 0xCC ]
                Expect.equal [ 0x09, 0x28, 0x00, 0x03, 0xAA, 0xBB, 0xCC ] encoded
        , test "Short float encodes mantissa with -1 exponent" <|
            \_ ->
                let
                    -- 75.0 * 10 = 750 (0x02EE), exponent 0xF -> word = 0xF2EE
                    encoded =
                        Mder.encodeFloatShort 75.0
                in
                Expect.equal [ 0xF2, 0xEE ] encoded
        ]
