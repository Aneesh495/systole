module Dsp.Wavelet exposing
    ( WaveletFamily(..)
    , WaveletDecomposition
    , decompose1D
    , decomposeMultiLevel
    , reconstruct1D
    , hardThreshold
    , softThreshold
    , detectQrsWaveletPeaks
    )

{-| Discrete Wavelet Transform (DWT) multi-resolution signal analysis.
Implements Mallat pyramid algorithm for biomedical signal denoising and
morphological QRS complex delineation.
-}


{-| Supported orthogonal wavelet families.
-}
type WaveletFamily
    = Haar
    | Daubechies4


{-| Multi-level decomposition result storing approximation and detail coefficients.
-}
type alias WaveletDecomposition =
    { approximation : List Float
    , details : List (List Float)
    , family : WaveletFamily
    }


{-| Lowpass (scaling) filter coefficients h0 for wavelet families.
-}
scalingCoeffs : WaveletFamily -> List Float
scalingCoeffs family =
    case family of
        Haar ->
            let
                invSqrt2 =
                    1.0 / sqrt 2.0
            in
            [ invSqrt2, invSqrt2 ]

        Daubechies4 ->
            let
                sqrt3 =
                    sqrt 3.0

                denom =
                    4.0 * sqrt 2.0
            in
            [ (1.0 + sqrt3) / denom
            , (3.0 + sqrt3) / denom
            , (3.0 - sqrt3) / denom
            , (1.0 - sqrt3) / denom
            ]


{-| Highpass (wavelet) filter coefficients g0: g0[n] = (-1)^n * h0[L - 1 - n].
-}
waveletCoeffs : WaveletFamily -> List Float
waveletCoeffs family =
    case family of
        Haar ->
            let
                invSqrt2 =
                    1.0 / sqrt 2.0
            in
            [ invSqrt2, -invSqrt2 ]

        Daubechies4 ->
            let
                h =
                    scalingCoeffs Daubechies4

                hRev =
                    List.reverse h
            in
            List.indexedMap
                (\i c ->
                    if modBy 2 i == 0 then
                        c

                    else
                        -c
                )
                hRev


{-| Single-level forward Discrete Wavelet Transform (DWT) with periodic boundary extension.
Returns (Approximation, Detail) coefficients downsampled by 2.
-}
decompose1D : WaveletFamily -> List Float -> ( List Float, List Float )
decompose1D family signal =
    let
        h =
            scalingCoeffs family

        g =
            waveletCoeffs family

        sigLen =
            List.length signal

        filterLen =
            List.length h

        sigArray =
            ArrayFromList signal

        -- Convolve with stride 2
        stepIndex idx =
            let
                sampleAt k =
                    let
                        wrapped =
                            modBy sigLen k
                    in
                    getAt wrapped sigArray

                convol foldCoeffs =
                    List.indexedMap (\k coeff -> coeff * sampleAt (idx + k)) foldCoeffs
                        |> List.sum
            in
            ( convol h, convol g )

        halfLen =
            sigLen // 2

        results =
            List.range 0 (halfLen - 1)
                |> List.map (\step -> stepIndex (step * 2))
    in
    ( List.map Tuple.first results, List.map Tuple.second results )


{-| Multi-level pyramid wavelet decomposition down to level J.
-}
decomposeMultiLevel : Int -> WaveletFamily -> List Float -> WaveletDecomposition
decomposeMultiLevel levels family signal =
    let
        loop currentLevel currentSignal accumulatedDetails =
            if currentLevel <= 0 || List.length currentSignal < 4 then
                { approximation = currentSignal
                , details = List.reverse accumulatedDetails
                , family = family
                }

            else
                let
                    ( approx, detail ) =
                        decompose1D family currentSignal
                in
                loop (currentLevel - 1) approx (detail :: accumulatedDetails)
    in
    loop levels signal []


{-| Single-level inverse Discrete Wavelet Transform (reconstruction).
-}
reconstruct1D : WaveletFamily -> List Float -> List Float -> List Float
reconstruct1D family approx detail =
    let
        h =
            scalingCoeffs family

        g =
            waveletCoeffs family

        -- Dual synthesis filters
        n =
            List.length approx

        reconstructed =
            List.range 0 (2 * n - 1)
                |> List.map
                    (\i ->
                        let
                            calcSynth coeffs coeffsG =
                                let
                                    folder ( k, c ) acc =
                                        let
                                            coeffIdx =
                                                i - 2 * k

                                            filterWeight =
                                                if coeffIdx >= 0 && coeffIdx < List.length coeffs then
                                                    getAt coeffIdx (ArrayFromList coeffs)

                                                else
                                                    0.0
                                        in
                                        acc + c * filterWeight
                                in
                                List.foldl folder 0.0 (List.indexedMap (\k c -> ( k, c )) approx)
                        in
                        calcSynth h g
                    )
    in
    reconstructed


{-| Apply hard thresholding to suppress coefficients below lambda.
-}
hardThreshold : Float -> List Float -> List Float
hardThreshold lambda =
    List.map
        (\x ->
            if abs x >= lambda then
                x

            else
                0.0
        )


{-| Apply soft thresholding with shrinkage toward zero.
-}
softThreshold : Float -> List Float -> List Float
softThreshold lambda =
    List.map
        (\x ->
            if x > lambda then
                x - lambda

            else if x < -lambda then
                x + lambda

            else
                0.0
        )


{-| Detect QRS peaks by locating local maxima in detail level 3 coefficients (frequency band ~10 to 30 Hz).
-}
detectQrsWaveletPeaks : Float -> List Float -> List Int
detectQrsWaveletPeaks threshold signal =
    let
        decomp =
            decomposeMultiLevel 3 Daubechies4 signal

        d3 =
            case List.reverse decomp.details of
                thirdLevel :: _ ->
                    thirdLevel

                [] ->
                    []

        -- Detail level 3 downsampled by factor of 8
        scaleFactor =
            8

        findPeaks ( i, v ) acc =
            if abs v > threshold then
                (i * scaleFactor) :: acc

            else
                acc
    in
    List.indexedMap (\i v -> ( i, v )) d3
        |> List.foldl findPeaks []
        |> List.reverse


{-| Internal helper for indexed lookups in immutable lists.
-}
type ArrayHelper
    = ArrayFromList (List Float)


getAt : Int -> ArrayHelper -> Float
getAt idx (ArrayFromList list) =
    if idx < 0 then
        0.0

    else
        List.drop idx list
            |> List.head
            |> Maybe.withDefault 0.0
