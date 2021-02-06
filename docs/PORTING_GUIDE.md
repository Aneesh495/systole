# Embedded Porting and Hardware Integration Guide

This guide describes how to port the Systole physiological signal processing pipeline and hemodynamics algorithms to embedded microcontrollers, real-time operating systems (RTOS), and WebAssembly targets.

---

## 1. Dual-Engine Architecture

Systole is engineered with an intentionally decoupled dual-engine design:
1. **Pure Elm Core**: Complete, verified reference implementation designed for browser workstations, high-acuity central nursing stations, and interactive diagnostic terminals.
2. **C11 Fastpath (`c_fastpath/`)**: Pure ISO C11 reference library with zero external dependencies (standard C library `<math.h>` and `<stdbool.h>` only). Designed for direct compilation on bare-metal firmware or RTOS microcontrollers.

Both engines share identical state formulations, mathematical equations, and execution sequences, verified to agree within $10^{-6}$ relative numerical error.

---

## 2. Embedded Target Recommendations

The C fastpath library is optimized for low-power embedded microcontrollers equipped with single or double precision Floating Point Units (FPU):

* **ARM Cortex-M4F / Cortex-M7**: STM32F4/F7/H7 series. Ideal for bedside patient monitors and wearable telemetry transmitters.
* **Espressif ESP32-S3**: Dual Xtensa LX7 cores with hardware vector instructions and integrated Wi-Fi/Bluetooth LE for wireless telemetry streaming.
* **Nordic nRF5340**: Dual-core ARM Cortex-M33 with dedicated BLE network core for wearable patch monitors.

### Memory Footprint

* Code Size (.text): Less than 18 KB compiled with `-O3`
* BSS / Static State (.bss): Less than 2 KB for single-lead Pan-Tompkins and pulse contour buffers
* Dynamic Heap Allocation: Exactly 0 bytes during steady-state processing. All buffers are statically allocated or stack-allocated.

---

## 3. Analog Front-End (AFE) Hardware Interfacing

To interface Systole with physical physiological sensors, configure standard medical AFE integrated circuits via SPI or I2C:

### 1. Electrocardiogram (ECG)

* **Recommended IC**: Texas Instruments ADS1298 (8-channel, 24-bit simultaneous sampling biopotential AFE with integrated Right Leg Drive amplifier and lead-off detection).
* **Sampling Rate**: Configure internal ADC decimation to 500 Hz or 250 Hz.
* **Downsampling to 200 Hz**: Apply a discrete FIR anti-aliasing filter before feeding samples to `systole_pt_process`.

### 2. Invasive Blood Pressure (ABP)

* **Recommended Sensor**: Edwards Lifesciences TruWave disposable pressure transducer interfaced via differential instrumentation amplifier (e.g. Analog Devices INA333).
* **Sampling Rate**: 200 Hz continuous acquisition.

### 3. Photoplethysmography (SpO2)

* **Recommended IC**: Maxim Integrated MAX30102 (high-sensitivity pulse oximeter and optical heart-rate sensor).
* **Acquisition**: Red (660 nm) and Infrared (940 nm) LEDs pulsed alternately at 200 Hz.

---

## 4. WebAssembly (Wasm) Compilation

For web browsers and hybrid desktop applications (Electron, Tauri) requiring microsecond-level DSP execution across multi-bed ward telemetry, compile `c_fastpath` to WebAssembly using Emscripten:

```bash
emcc -O3 \
    -s WASM=1 \
    -s SIDE_MODULE=1 \
    -s EXPORTED_FUNCTIONS="['_systole_biquad_step','_systole_pt_process','_systole_pk_step']" \
    c_fastpath/systole_dsp.c -o web/systole_dsp.wasm
```

The generated Wasm module interfaces seamlessly with Elm via outgoing and incoming ports.
