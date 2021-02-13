#!/usr/bin/env python3
"""
Systole DSP Throughput and Performance Benchmark Harness.
Measures discrete-time filtering, differentiation, squaring, and Pan-Tompkins
QRS complex processing throughput across millions of physiological samples.
"""

import math
import sys
import time

def run_benchmark(num_samples=1000000):
    print("=======================================================================")
    print("Systole DSP Throughput Benchmark (1,000,000 samples @ 200 Hz)")
    print("=======================================================================")

    # Biquad state registers
    w1 = 0.0
    w2 = 0.0

    # 10 Hz bandpass filter coefficients (fs = 200 Hz, Q = 1.0)
    w0 = 2.0 * math.pi * (10.0 / 200.0)
    alpha = math.sin(w0) / 2.0
    a0 = 1.0 + alpha
    b0 = (math.sin(w0) / 2.0) / a0
    b1 = 0.0
    b2 = (-math.sin(w0) / 2.0) / a0
    a1 = (-2.0 * math.cos(w0)) / a0
    a2 = (1.0 - alpha) / a0

    # Five-point derivative ring buffer
    diff_buf = [0.0] * 5

    # Moving window integrator buffer
    int_len = 30
    int_buf = [0.0] * int_len
    running_sum = 0.0

    t_start = time.perf_counter()

    peaks_detected = 0
    spki = 0.02
    npki = 0.001
    thresh1 = 0.005
    last_peak_idx = -1000

    cand_prev = 0.0
    cand_mid = 0.0

    for i in range(num_samples):
        # Generate synthetic ECG tone with QRS spike every 160 samples (75 bpm)
        phase = i % 160
        if 75 <= phase <= 85:
            dist = float(phase - 80)
            raw = 1.5 * math.exp(-0.5 * dist * dist)
        else:
            raw = 0.05 * math.sin(2.0 * math.pi * 0.5 * float(i) / 200.0)

        # Step 1: Direct Form II Transposed Biquad
        y = b0 * raw + w1
        w1 = b1 * raw - a1 * y + w2
        w2 = b2 * raw - a2 * y

        # Step 2: Five-point derivative
        diff = (2.0 * y + diff_buf[1] - diff_buf[3] - 2.0 * diff_buf[4]) / 8.0
        diff_buf[4] = diff_buf[3]
        diff_buf[3] = diff_buf[2]
        diff_buf[2] = diff_buf[1]
        diff_buf[1] = diff_buf[0]
        diff_buf[0] = y

        # Step 3: Non-linear squaring
        sq = diff * diff

        # Step 4: Moving window integration
        running_sum = running_sum + sq - int_buf[-1]
        if running_sum < 0.0:
            running_sum = 0.0
        int_buf.pop()
        int_buf.insert(0, sq)
        integrated = running_sum / float(int_len)

        # Step 5: Peak detection
        cand_next = integrated
        is_local_max = (cand_mid > cand_prev) and (cand_mid >= cand_next)
        cand_prev = cand_mid
        cand_mid = cand_next

        if is_local_max and (i - last_peak_idx > 40) and (cand_prev > thresh1):
            peaks_detected += 1
            spki = 0.125 * cand_prev + 0.875 * spki
            thresh1 = npki + 0.25 * (spki - npki)
            last_peak_idx = i

    t_elapsed = time.perf_counter() - t_start
    throughput_samples_per_sec = float(num_samples) / t_elapsed
    speedup_vs_realtime = throughput_samples_per_sec / 200.0

    print(f"Elapsed Time:       {t_elapsed:.4f} seconds")
    print(f"Total Samples:      {num_samples:,}")
    print(f"Peaks Detected:     {peaks_detected:,}")
    print(f"DSP Throughput:     {throughput_samples_per_sec:,.0f} samples/sec")
    print(f"Real-Time Speedup:  {speedup_vs_realtime:,.0f}x faster than 200 Hz continuous acquisition")
    print("=======================================================================")

if __name__ == "__main__":
    count = int(sys.argv[1]) if len(sys.argv) > 1 else 500000
    run_benchmark(count)
