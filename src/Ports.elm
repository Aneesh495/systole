port module Ports exposing
    ( audioAlarm
    , exportEhr
    , streamIn
    , streamOut
    )

{-| JavaScript interop ports for Web Audio API alarm synthesis,
WebSocket telemetry streaming, and electronic health record (EHR) export.
-}

import Json.Encode as Encode


{-| Send audio alarm chime trigger to Web Audio API synthesizer.
Payload is priority string: "CRISIS", "WARNING", "ADVISORY", or "MUTE".
-}
port audioAlarm : String -> Cmd msg


{-| Outbound telemetry packet port.
-}
port streamOut : Encode.Value -> Cmd msg


{-| Inbound external IEEE 11073 telemetry stream subscription.
-}
port streamIn : (Encode.Value -> msg) -> Sub msg


{-| Export patient clinical observations to client browser download or clipboard.
-}
port exportEhr : Encode.Value -> Cmd msg
