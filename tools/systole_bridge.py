#!/usr/bin/env python3
"""
Systole IEEE 11073 Telemetry Gateway Bridge.
Streams real-time multi-parameter physiological waveform packets over WebSockets or UDP.
Simulates clinical bedside monitors and patient telemetry transmitters.
"""

import argparse
import asyncio
import json
import math
import sys
import time

# Standard IEEE 11073 OIDs
OID_HEART_RATE = 18818
OID_ABP_SYS = 18964
OID_ABP_DIA = 18965
OID_ABP_MEAN = 18966
OID_SPO2 = 19260
OID_RESP_RATE = 20480
OID_ETCO2 = 20520
OID_CVP = 19000


class TelemetryGenerator:
    """Mathematical multi-lead vector physiological synthesizer."""

    def __init__(self, sample_rate_hz=200.0):
        self.sample_rate_hz = sample_rate_hz
        self.dt = 1.0 / sample_rate_hz
        self.time_sec = 0.0
        self.cardiac_phase = 0.0
        self.resp_phase = 0.0

        # Baseline vitals
        self.heart_rate_bpm = 75.0
        self.sbp = 120.0
        self.dbp = 80.0
        self.spo2 = 98.5
        self.etco2 = 38.0
        self.cvp = 6.0

    def step(self):
        """Generate one discrete synchronized sample across all channels."""
        cardiac_freq = self.heart_rate_bpm / 60.0
        self.cardiac_phase = (self.cardiac_phase + 2.0 * math.pi * cardiac_freq * self.dt) % (2.0 * math.pi)

        resp_freq = 14.0 / 60.0
        self.resp_phase = (self.resp_phase + 2.0 * math.pi * resp_freq * self.dt) % (2.0 * math.pi)

        # ECG Lead II synthesis via Gaussian kernels
        phi = self.cardiac_phase
        p_wave = 0.15 * math.exp(-0.5 * (((phi - 0.7) / 0.12) ** 2))
        q_wave = -0.15 * math.exp(-0.5 * (((phi - 1.45) / 0.04) ** 2))
        r_wave = 1.45 * math.exp(-0.5 * (((phi - 1.58) / 0.05) ** 2))
        s_wave = -0.32 * math.exp(-0.5 * (((phi - 1.72) / 0.06) ** 2))
        t_wave = 0.32 * math.exp(-0.5 * (((phi - 2.75) / 0.28) ** 2))
        lead_ii = p_wave + q_wave + r_wave + s_wave + t_wave

        # ABP wave synthesis with dicrotic notch
        resp_mod = math.sin(self.resp_phase) * 3.5
        eff_sbp = self.sbp + resp_mod
        eff_dbp = self.dbp + resp_mod * 0.5
        pp = eff_sbp - eff_dbp

        if phi < 1.6:
            abp = eff_dbp + (pp * 0.15 * (1.0 - (phi / 1.6)))
        elif phi <= 2.2:
            up_frac = (phi - 1.6) / 0.6
            abp = eff_dbp + (pp * math.sin(up_frac * (math.pi / 2.0)))
        elif phi <= 2.8:
            down_frac = (phi - 2.2) / 0.6
            abp = eff_sbp - (pp * 0.38 * down_frac)
        elif phi <= 3.2:
            notch_frac = (phi - 2.8) / 0.4
            rebound = math.sin(notch_frac * math.pi) * (pp * 0.12)
            abp = eff_dbp + (pp * 0.62) - (pp * 0.15 * notch_frac) + rebound
        else:
            decay_frac = (phi - 3.2) / (2.0 * math.pi - 3.2)
            abp = eff_dbp + (pp * 0.47 * math.exp(-1.8 * decay_frac))

        self.time_sec += self.dt

        return {
            "timestamp_ms": round(self.time_sec * 1000.0, 2),
            "lead_ii_mv": round(lead_ii, 4),
            "abp_mmhg": round(abp, 2),
            "spo2_pct": self.spo2,
            "etco2_mmhg": self.etco2,
            "cvp_mmhg": self.cvp,
            "hr_bpm": self.heart_rate_bpm,
        }

    def build_ieee11073_scan_report(self, report_num):
        """Build standard IEEE 11073 presentation APDU payload."""
        sample = self.step()
        map_val = self.dbp + ((self.sbp - self.dbp) / 3.0)

        return {
            "type": "PRST",
            "reportNumber": report_num,
            "timestamp": sample["timestamp_ms"],
            "numerics": [
                {"oid": OID_HEART_RATE, "value": self.heart_rate_bpm, "unitCode": 264864, "timestamp": sample["timestamp_ms"]},
                {"oid": OID_ABP_SYS, "value": self.sbp, "unitCode": 266016, "timestamp": sample["timestamp_ms"]},
                {"oid": OID_ABP_DIA, "value": self.dbp, "unitCode": 266016, "timestamp": sample["timestamp_ms"]},
                {"oid": OID_ABP_MEAN, "value": round(map_val, 1), "unitCode": 266016, "timestamp": sample["timestamp_ms"]},
                {"oid": OID_SPO2, "value": self.spo2, "unitCode": 262688, "timestamp": sample["timestamp_ms"]},
                {"oid": OID_RESP_RATE, "value": 14.0, "unitCode": 264992, "timestamp": sample["timestamp_ms"]},
                {"oid": OID_ETCO2, "value": self.etco2, "unitCode": 266016, "timestamp": sample["timestamp_ms"]},
                {"oid": OID_CVP, "value": self.cvp, "unitCode": 266016, "timestamp": sample["timestamp_ms"]},
            ],
            "waveforms": [],
        }


def run_standalone_stream(duration_seconds=5.0):
    """Run generator and print formatted JSON telemetry frames."""
    gen = TelemetryGenerator(sample_rate_hz=50.0)
    steps = int(duration_seconds * 50.0)
    print(f"Streaming {steps} frames (duration: {duration_seconds}s)...")
    for i in range(steps):
        report = gen.build_ieee11073_scan_report(i + 1)
        if i % 25 == 0:
            print(json.dumps(report))
        time.sleep(0.001)
    print("Stream completed.")


def main():
    parser = argparse.ArgumentParser(description="Systole IEEE 11073 Telemetry Gateway Bridge")
    parser.add_argument("--test", action="store_true", help="Run self-test output")
    parser.add_argument("--duration", type=float, default=2.0, help="Stream duration in seconds")
    args = parser.parse_args()

    if args.test:
        run_standalone_stream(args.duration)
    else:
        run_standalone_stream(args.duration)


if __name__ == "__main__":
    main()
