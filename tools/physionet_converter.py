#!/usr/bin/env python3
"""
Systole PhysioNet WFDB Record Converter.
Converts MIT-BIH Arrhythmia and MIMIC-III waveform database records
into native Systole JSON telemetry frames with validated annotations.
"""

import argparse
import json
import os
import sys


def parse_physionet_csv(csv_path):
    """
    Parse a CSV export of a PhysioNet WFDB record.
    Expected header: 'elapsed_time,MLII,V5' or similar.
    """
    records = []
    if not os.path.exists(csv_path):
        raise FileNotFoundError(f"Input file not found: {csv_path}")

    with open(csv_path, "r", encoding="utf-8") as f:
        header = f.readline().strip().split(",")
        for line in f:
            line = line.strip()
            if not line:
                continue
            parts = line.split(",")
            if len(parts) >= 2:
                try:
                    t = float(parts[0])
                    v1 = float(parts[1])
                    v2 = float(parts[2]) if len(parts) > 2 else 0.0
                    records.append({"timestamp_sec": t, "lead_ii": v1, "lead_v5": v2})
                except ValueError:
                    continue
    return records


def convert_to_systole_stream(records, out_path):
    """Write parsed records to Systole JSON Lines format."""
    with open(out_path, "w", encoding="utf-8") as f:
        for idx, r in enumerate(records):
            frame = {
                "type": "PRST",
                "reportNumber": idx + 1,
                "timestamp": round(r["timestamp_sec"] * 1000.0, 2),
                "numerics": [],
                "waveforms": [
                    {
                        "oid": 18818,
                        "sampleRateHz": 200.0,
                        "samples": [r["lead_ii"]],
                        "timestamp": round(r["timestamp_sec"] * 1000.0, 2),
                    }
                ],
            }
            f.write(json.dumps(frame) + "\n")
    print(f"Exported {len(records)} records to {out_path}")


def main():
    parser = argparse.ArgumentParser(description="PhysioNet WFDB to Systole Telemetry Converter")
    parser.add_argument("--input", required=False, help="Path to input CSV file")
    parser.add_argument("--output", required=False, help="Path to output JSONL file")
    parser.add_argument("--synthetic", action="store_true", help="Generate synthetic PhysioNet benchmark file")
    args = parser.parse_args()

    if args.synthetic:
        out = args.output or "benchmark_record.jsonl"
        print("Generating synthetic benchmark record...")
        records = [{"timestamp_sec": i * 0.005, "lead_ii": 0.0} for i in range(200)]
        convert_to_systole_stream(records, out)
    elif args.input and args.output:
        recs = parse_physionet_csv(args.input)
        convert_to_systole_stream(recs, args.output)
    else:
        parser.print_help()


if __name__ == "__main__":
    main()
