#!/usr/bin/env python3
"""
Unit verification suite for Systole Python operational tooling.
Tests IEEE 11073 payload synthesis, waveform generator stability, and PhysioNet conversion.
"""

import os
import tempfile
import unittest

from tools.systole_bridge import TelemetryGenerator, OID_HEART_RATE, OID_ABP_SYS
from tools.physionet_converter import convert_to_systole_stream


class TestSystoleTools(unittest.TestCase):
    """Test suite for operational Python telemetry scripts."""

    def test_telemetry_generator_step(self):
        """Verify waveform generator synthesizes valid scalar bounds."""
        gen = TelemetryGenerator(sample_rate_hz=200.0)
        # Advance 200 samples (1 second)
        samples = [gen.step() for _ in range(200)]
        self.assertEqual(len(samples), 200)

        # Ensure physiological ranges
        max_abp = max(s["abp_mmhg"] for s in samples)
        min_abp = min(s["abp_mmhg"] for s in samples)
        self.assertGreater(max_abp, 110.0)
        self.assertLess(max_abp, 135.0)
        self.assertGreater(min_abp, 70.0)
        self.assertLess(min_abp, 90.0)

    def test_ieee11073_scan_report_format(self):
        """Verify IEEE 11073 APDU report conforms to specification."""
        gen = TelemetryGenerator(sample_rate_hz=100.0)
        report = gen.build_ieee11073_scan_report(1)

        self.assertEqual(report["type"], "PRST")
        self.assertEqual(report["reportNumber"], 1)
        self.assertTrue(len(report["numerics"]) >= 7)

        oids = [n["oid"] for n in report["numerics"]]
        self.assertIn(OID_HEART_RATE, oids)
        self.assertIn(OID_ABP_SYS, oids)

    def test_physionet_converter_synthetic(self):
        """Verify synthetic PhysioNet conversion generates valid JSONL lines."""
        records = [
            {"timestamp_sec": 0.005 * i, "lead_ii": 1.2 * (i % 20 == 0)}
            for i in range(50)
        ]
        with tempfile.NamedTemporaryFile(suffix=".jsonl", delete=False) as tmp:
            tmp_path = tmp.name

        try:
            convert_to_systole_stream(records, tmp_path)
            self.assertTrue(os.path.exists(tmp_path))
            with open(tmp_path, "r", encoding="utf-8") as f:
                lines = f.readlines()
            self.assertEqual(len(lines), 50)
        finally:
            if os.path.exists(tmp_path):
                os.remove(tmp_path)


if __name__ == "__main__":
    unittest.main()
