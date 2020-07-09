module Dsp.Types exposing
    ( BaselineState
    , BiquadCoeffs
    , BiquadState
    , CircularBuffer
    , FilteredSample
    , Lead(..)
    , MovingWindow
    , Sample
    , Timestamp
    , Waveform(..)
    , WaveformPoint
    , allLeads
    , emptyBuffer
    , emptyMovingWindow
    , leadToString
    , pushBuffer
    , pushMovingWindow
    , sumMovingWindow
    , toListBuffer
    )

{-| Core types and data structures for digital signal processing of physiological waveforms.
All algorithms operate in discrete time with deterministic floating-point representations.
Zero runtime exceptions are guaranteed by explicit model bounds and total functions.
-}


{-| Discrete timestamp in milliseconds since epoch or simulation onset.
-}
type alias Timestamp =
    Float


{-| Raw or calibrated analog signal sample value in engineering units (millivolts, mmHg, percent).
-}
type alias Sample =
    Float


{-| Standard clinical electrocardiographic leads for 12-lead diagnostic monitoring.
Includes Einthoven bipolar limb leads (I, II, III), Goldberger augmented unipolar leads
(aVR, aVL, aVF), and Wilson precordial chest leads (V1, V2, V3, V4, V5, V6).
-}
type Lead
    = LeadI
    | LeadII
    | LeadIII
    | LeadAVR
    | LeadAVL
    | LeadAVF
    | LeadV1
    | LeadV2
    | LeadV3
    | LeadV4
    | LeadV5
    | LeadV6


{-| Complete ordered enumeration of all twelve diagnostic leads.
-}
allLeads : List Lead
allLeads =
    [ LeadI
    , LeadII
    , LeadIII
    , LeadAVR
    , LeadAVL
    , LeadAVF
    , LeadV1
    , LeadV2
    , LeadV3
    , LeadV4
    , LeadV5
    , LeadV6
    ]


{-| Canonical clinical string representation for display and protocol encoding.
-}
leadToString : Lead -> String
leadToString lead =
    case lead of
        LeadI ->
            "I"

        LeadII ->
            "II"

        LeadIII ->
            "III"

        LeadAVR ->
            "aVR"

        LeadAVL ->
            "aVL"

        LeadAVF ->
            "aVF"

        LeadV1 ->
            "V1"

        LeadV2 ->
            "V2"

        LeadV3 ->
            "V3"

        LeadV4 ->
            "V4"

        LeadV5 ->
            "V5"

        LeadV6 ->
            "V6"


{-| Primary physiological waveform modalities monitored at the bedside.
-}
type Waveform
    = EcgWaveform Lead
    | AbpWaveform
    | PpgWaveform
    | CapnoWaveform
    | CvpWaveform


{-| Visual point on the bedside monitor sweepbar containing spatial coordinates and age.
-}
type alias WaveformPoint =
    { timestamp : Timestamp
    , value : Float
    , isRPeak : Bool
    }


{-| Coefficients for second-order Direct Form II Transposed biquad IIR filter sections.
Transfer function: H(z) = (b0 + b1*z^-1 + b2*z^-2) / (1 + a1*z^-1 + a2*z^-2).
-}
type alias BiquadCoeffs =
    { b0 : Float
    , b1 : Float
    , b2 : Float
    , a1 : Float
    , a2 : Float
    }


{-| State registers for a second-order biquad filter section.
-}
type alias BiquadState =
    { w1 : Float
    , w2 : Float
    }


{-| Filtered signal sample retaining both raw input and conditioned output.
-}
type alias FilteredSample =
    { raw : Float
    , filtered : Float
    , timestamp : Timestamp
    }


{-| Low-frequency baseline wander tracking state using a leaky integrator.
-}
type alias BaselineState =
    { estimate : Float
    , alpha : Float
    }


{-| Fixed-capacity circular buffer for finite impulse response and moving averages.
Implemented with an immutable list and fixed capacity budget.
-}
type alias CircularBuffer =
    { capacity : Int
    , size : Int
    , values : List Float
    }


{-| Initialize an empty circular buffer with maximum capacity.
-}
emptyBuffer : Int -> CircularBuffer
emptyBuffer cap =
    { capacity = cap
    , size = 0
    , values = []
    }


{-| Push a new sample into the buffer, discarding the oldest when full.
-}
pushBuffer : Float -> CircularBuffer -> CircularBuffer
pushBuffer val buf =
    if buf.size < buf.capacity then
        { buf
            | size = buf.size + 1
            , values = val :: buf.values
        }

    else
        { buf
            | values = val :: List.take (buf.capacity - 1) buf.values
        }


{-| Retrieve elements in chronological order (oldest to newest).
-}
toListBuffer : CircularBuffer -> List Float
toListBuffer buf =
    List.reverse buf.values


{-| Moving window structure maintaining running sum for O(1) boxcar integration.
-}
type alias MovingWindow =
    { windowSize : Int
    , buffer : CircularBuffer
    , runningSum : Float
    }


{-| Initialize an empty moving window.
-}
emptyMovingWindow : Int -> MovingWindow
emptyMovingWindow size =
    { windowSize = size
    , buffer = emptyBuffer size
    , runningSum = 0.0
    }


{-| Push a sample into the moving window, updating the running sum in constant time.
-}
pushMovingWindow : Float -> MovingWindow -> MovingWindow
pushMovingWindow val win =
    let
        oldest =
            if win.buffer.size >= win.windowSize then
                case List.drop (win.buffer.size - 1) win.buffer.values of
                    head :: _ ->
                        head

                    [] ->
                        0.0

            else
                0.0

        newBuffer =
            pushBuffer val win.buffer

        newSum =
            if win.buffer.size >= win.windowSize then
                win.runningSum - oldest + val

            else
                win.runningSum + val
    in
    { win
        | buffer = newBuffer
        , runningSum = newSum
    }


{-| Get the current sum of the moving window.
-}
sumMovingWindow : MovingWindow -> Float
sumMovingWindow win =
    win.runningSum
