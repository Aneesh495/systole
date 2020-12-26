# Digital Signal Processing Formulations

This document provides rigorous mathematical derivations and discrete-time transfer functions implemented across the Systole digital signal processing pipeline.

---

## 1. Direct Form II Transposed Biquad IIR Filters

Second-order biquad sections represent the foundational building block for real-time IIR filtering in Systole. Direct Form II Transposed (DF2T) architecture is selected over Direct Form I and Standard Direct Form II because transposed sections exhibit superior numerical stability under finite precision arithmetic and require only two delay registers ($w_1, w_2$).

### Transfer Function

In the complex $z$-domain, a second-order section is defined as:

$$H(z) = \frac{Y(z)}{X(z)} = \frac{b_0 + b_1 z^{-1} + b_2 z^{-2}}{1 + a_1 z^{-1} + a_2 z^{-2}}$$

Normalized such that $a_0 = 1.0$.

### Discrete Difference Equations

The transposed state equations executed per sample $n$ are:

$$y[n] = b_0 x[n] + w_1[n-1]$$

$$w_1[n] = b_1 x[n] - a_1 y[n] + w_2[n-1]$$

$$w_2[n] = b_2 x[n] - a_2 y[n]$$

### Bilinear Transform with Frequency Pre-Warping

Continuous analog prototype filters $H(s)$ are mapped to discrete time using the bilinear transform:

$$s \leftarrow \frac{2}{T} \frac{1 - z^{-1}}{1 + z^{-1}} = 2 f_s \frac{1 - z^{-1}}{1 + z^{-1}}$$

To compensate for frequency compression approaching the Nyquist frequency $f_s / 2$, critical cutoff frequencies are pre-warped:

$$\omega_0 = 2 \pi \frac{f_c}{f_s}$$

$$\alpha = \frac{\sin(\omega_0)}{2 Q}$$

For a standard second-order Butterworth lowpass response ($Q = 1/\sqrt{2} \approx 0.70710678$):

$$a_0 = 1.0 + \alpha$$

$$b_0 = \frac{1.0 - \cos(\omega_0)}{2 a_0}, \quad b_1 = \frac{1.0 - \cos(\omega_0)}{a_0}, \quad b_2 = \frac{1.0 - \cos(\omega_0)}{2 a_0}$$

$$a_1 = \frac{-2.0 \cos(\omega_0)}{a_0}, \quad a_2 = \frac{1.0 - \alpha}{a_0}$$

---

## 2. Pan-Tompkins Real-Time QRS Detection Algorithm

The Pan-Tompkins algorithm delineates ventricular depolarization (QRS complexes) by cascading linear filtering, non-linear differentiation, squaring, moving-window integration, and dual-threshold decision logic.

### Stage 1: Bandpass Filtering (5 to 15 Hz)

Attenuates low-frequency baseline wander (P-waves, T-waves, respiratory drift) and high-frequency noise (60 Hz powerline hum, electrosurgical unit interference, skeletal muscle electromyogram). Implemented via second-order Butterworth bandpass centered at 10.0 Hz with $Q = 1.0$.

### Stage 2: Five-Point Derivative

Suppresses low-frequency components while highlighting steep QRS slopes:

$$y[n] = \frac{1}{8 T} (2 x[n] + x[n-1] - x[n-3] - 2 x[n-4])$$

### Stage 3: Non-Linear Squaring

Amplifies large derivative excursions non-linearly while suppressing small spurious transients:

$$y[n] = (x[n])^2$$

### Stage 4: Moving Window Integration

Computes the moving average energy over a 150 ms physiological window ($N = \lfloor 0.150 \times f_s \rfloor = 30$ samples at 200 Hz):

$$y[n] = \frac{1}{N} \sum_{k=0}^{N-1} x[n-k]$$

### Stage 5: Dual Adaptive Energy Thresholds

Two running signal energy levels are maintained:
* $SPKI$: Signal Peak level
* $NPKI$: Noise Peak level

When a candidate peak $PEAK$ is detected:

If $PEAK > THRESHOLD_{I1}$ and refractory period ($200$ ms) has elapsed:
* Classified as QRS complex (R-peak)
* $SPKI \leftarrow 0.125 \times PEAK + 0.875 \times SPKI$

Else:
* Classified as noise peak
* $NPKI \leftarrow 0.125 \times PEAK + 0.875 \times NPKI$

Thresholds adapt dynamically:

$$THRESHOLD_{I1} = NPKI + 0.25 \times (SPKI - NPKI)$$

$$THRESHOLD_{I2} = 0.5 \times THRESHOLD_{I1}$$

---

## 3. Discrete Wavelet Transform (Mallat Multi-Resolution Analysis)

To extract transient micro-potentials and delineate pathological QRS broadening without phase distortion, Systole implements the Mallat pyramid discrete wavelet transform.

### Wavelet Filter Bank

Given orthogonal scaling filter coefficients $h_0[k]$ and wavelet filter coefficients $g_0[k] = (-1)^k h_0[L - 1 - k]$:

Forward single-level decomposition downsampled by 2:

$$cA_{j+1}[n] = \sum_{k} h_0[k - 2n] cA_j[k]$$

$$cD_{j+1}[n] = \sum_{k} g_0[k - 2n] cA_j[k]$$

### Daubechies-4 Coefficients

Daubechies-4 (Db4) wavelets exhibit 2 vanishing moments and compact support, closely matching physiological QRS wave morphology:

$$h_0 = \left[ \frac{1+\sqrt{3}}{4\sqrt{2}}, \frac{3+\sqrt{3}}{4\sqrt{2}}, \frac{3-\sqrt{3}}{4\sqrt{2}}, \frac{1-\sqrt{3}}{4\sqrt{2}} \right]$$

Ventricular QRS energy concentrates primarily in detail level 3 ($cD_3$, corresponding to 12.5 Hz to 25 Hz at $f_s = 200$ Hz).

---

## 4. Arterial Blood Pressure Pulse Contour Analysis

Invasive arterial blood pressure (ABP) arterial lines provide continuous real-time stroke volume and fluid responsiveness estimates via the Liljestrand-Zander formulation and the Windkessel compliance model.

### Liljestrand-Zander Stroke Volume Estimation

Stroke Volume ($SV$) is proportional to pulse pressure ($PP = SBP - DBP$) and the systolic ejection area ($A_{sys} = \int_{onset}^{notch} (P(t) - DBP) \, dt$):

$$SV \approx k \cdot \frac{A_{sys}}{SBP + DBP} \left(1 + \frac{PP}{SBP}\right)$$

### Respiratory Variations: PPV and SVV

In mechanically ventilated patients under closed-chest conditions, heart-lung interactions induce cyclic variations in stroke volume and pulse pressure:

$$PPV = \frac{PP_{max} - PP_{min}}{(PP_{max} + PP_{min}) / 2} \times 100\%$$

$$SVV = \frac{SV_{max} - SV_{min}}{(SV_{max} + SV_{min}) / 2} \times 100\%$$

Clinical decision threshold: $PPV > 13\%$ indicates high fluid responsiveness, predicting a significant increase in cardiac output following intravenous fluid bolus administration.

---

## 5. Dual-Wavelength Pulse Oximetry (SpO2)

Photoplethysmography measures light transmission through vascular tissue at two distinct wavelengths:
* Red ($660$ nm): Deoxyhemoglobin absorption peak
* Infrared ($940$ nm): Oxyhemoglobin absorption peak

### Extinction Ratio of Ratios

Each optical channel is separated into an oscillatory pulsatile arterial component ($AC$) and a non-pulsatile baseline tissue/venous component ($DC$):

$$R = \frac{(AC / DC)_{660}}{(AC / DC)_{940}}$$

### Calibration Formulation

Arterial functional oxygen saturation is computed from the empirical quadratic calibration equation:

$$SpO_2 = 110.0 - 25.0 \times R$$

### Perfusion Index and Pleth Variability Index

$$PI = \frac{AC_{IR}}{DC_{IR}} \times 100\%$$

$$PVI = \frac{PI_{max} - PI_{min}}{PI_{max}} \times 100\%$$

---

## 6. Microstream Capnography and Alveolar Dead Space

Capnographic analysis tracks partial pressure of expired carbon dioxide ($P_{CO_2}$) across the respiratory cycle:

* Phase I: Anatomical dead space gas ($P_{CO_2} \approx 0$ mmHg)
* Phase II: Rapid expiratory upstroke (bronchial/alveolar mixing)
* Phase III: Alveolar plateau (pure alveolar gas)
* Phase IV: Rapid inspiratory downstroke

### Dead Space Ratio (Bohr-Enghoff Equation)

Alveolar dead space fraction ($V_D / V_T$) quantifies ventilation-perfusion ($V/Q$) mismatch:

$$\frac{V_D}{V_T} = \frac{P_{aCO_2} - P_{EtCO_2}}{P_{aCO_2}}$$

Normal resting baseline: $V_D / V_T < 0.30$. Elevated values ($> 0.45$) indicate severe pulmonary embolism, ARDS, or low-cardiac-output shock.
