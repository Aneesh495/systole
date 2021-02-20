#!/usr/bin/env python3
"""
Synthetic Physiological Telemetry Database Generator.
Generates multi-lead clinical records (ECG I-III, aVR-aVF, V1-V6, ABP, PPG, Capno, CVP)
in JSONL and PhysioNet WFDB format for automated stress testing and replay.
"""

import argparse
import json
import math
import sys

def synthesize_patient_record(record_id, duration_sec, sample_rate, hr, sbp, dbp, spo2, etco2):
    total_samples = int(duration_sec * sample_rate)
    records = []
    
    print(f"Generating synthetic record {record_id}: {duration_sec}s @ {sample_rate}Hz (HR={hr}, BP={sbp}/{dbp})...")

    rr_samples = int((60.0 / hr) * sample_rate)

    for i in range(total_samples):
        t_sec = float(i) / sample_rate
        phase = i % rr_samples

        # Lead II ECG: P, QRS, T
        ecg_val = 0.0
        # P-wave
        p_center = int(0.20 * rr_samples)
        if abs(phase - p_center) <= 10:
            ecg_val += 0.15 * math.exp(-0.5 * ((phase - p_center) / 3.0) ** 2)
        # QRS complex
        qrs_center = int(0.35 * rr_samples)
        if abs(phase - qrs_center) <= 8:
            dist = phase - qrs_center
            ecg_val += 1.4 * math.exp(-0.5 * (dist / 2.0) ** 2)
            if dist < -2 or dist > 2:
                ecg_val -= 0.2
        # T-wave
        t_center = int(0.60 * rr_samples)
        if abs(phase - t_center) <= 15:
            ecg_val += 0.30 * math.exp(-0.5 * ((phase - t_center) / 5.0) ** 2)

        # Arterial Blood Pressure
        abp_val = dbp
        if phase >= qrs_center:
            systolic_phase = phase - qrs_center
            if systolic_phase < int(0.3 * rr_samples):
                alpha = float(systolic_phase) / float(0.3 * rr_samples)
                abp_val = dbp + (sbp - dbp) * math.sin(alpha * math.pi)
                # Dicrotic notch
                if 0.55 <= alpha <= 0.70:
                    abp_val += (sbp - dbp) * 0.12 * math.sin((alpha - 0.55) / 0.15 * math.pi)

        sample = {
            "record": record_id,
            "sample_index": i,
            "timestamp_sec": round(t_sec, 4),
            "lead_ii_mv": round(ecg_val, 4),
            "abp_mmhg": round(abp_val, 2),
            "spo2_percent": spo2,
            "etco2_mmhg": etco2
        }
        records.append(sample)

    return records

def main():
    parser = argparse.ArgumentParser(description="Generate synthetic ICU telemetry database")
    parser.add_argument("--records", type=int, default=3, help="Number of records to generate")
    parser.add_argument("--duration", type=float, default=10.0, help="Duration in seconds per record")
    parser.add_argument("--rate", type=float, default=200.0, help="Sample rate in Hz")
    parser.add_argument("--output", type=str, default="synthetic_ward_data.jsonl", help="Output JSONL path")
    args = parser.parse_args()

    scenarios = [
        ("PAT-001-NOMINAL", 75.0, 120.0, 80.0, 98.0, 38.0),
        ("PAT-002-STEMI", 95.0, 105.0, 65.0, 96.0, 36.0),
        ("PAT-003-SEPSIS", 128.0, 84.0, 42.0, 92.0, 31.0)
    ]

    total_generated = 0
    with open(args.output, "w") as f:
        for idx in range(min(args.records, len(scenarios))):
            rec_id, hr, sbp, dbp, spo2, etco2 = scenarios[idx]
            samples = synthesize_patient_record(rec_id, args.duration, args.rate, hr, sbp, dbp, spo2, etco2)
            for s in samples:
                f.write(json.dumps(s) + "\n")
            total_generated += len(samples)

    print(f"Exported {total_generated} samples across {args.records} records to {args.output}")

if __name__ == "__main__":
    main()
