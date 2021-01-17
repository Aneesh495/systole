# IEEE 11073-20601 Medical Device Communication Specification

This specification documents the implementation of the ISO/IEEE 11073-20601 Optimized Exchange Protocol and IEEE 11073-10101 Clinical Nomenclature in Systole.

---

## 1. Protocol Architecture and Domain Information Model (DIM)

The IEEE 11073 standard organizes medical instrumentation into an object-oriented Domain Information Model (DIM):

```
       +---------------------------------------------+
       | Medical Device System (MDS Object)          |
       | Handle: 0, System-Id, Dev-Configuration-Id  |
       +---------------------------------------------+
                              |
                              v
       +---------------------------------------------+
       | Virtual Medical Device (VMD: Telemetry)    |
       | Handle: 1, System-Type: ICU Telemetry Hub   |
       +---------------------------------------------+
                              |
                              v
       +---------------------------------------------+
       | Channel Object (Channel 1: Vital Signs)     |
       +---------------------------------------------+
            |               |               |
            v               v               v
     +--------------+ +--------------+ +--------------+
     | Numeric      | | RealTime     | | Enumeration  |
     | Metric: HR   | | SampleArray: | | Metric:      |
     | MDC_PULS_RATE| | ECG Lead II  | | Arrhythmia   |
     +--------------+ +--------------+ +--------------+
```

### Supported Metric Objects and Nomenclature OIDs

Conforming to IEEE 11073-10101 clinical nomenclature:

| Metric Name | DIM Object Class | Nomenclature Code | OID Code (16-bit) | Unit String (UCUM) |
| :--- | :--- | :--- | :--- | :--- |
| **Heart Rate** | Numeric | `MDC_ECG_HEART_RATE` | `0x4822` | `/min` |
| **Arterial Pressure (Sys)** | Numeric | `MDC_PRESS_BLD_SYS` | `0x4A10` | `mm[Hg]` |
| **Arterial Pressure (Dia)** | Numeric | `MDC_PRESS_BLD_DIA` | `0x4A11` | `mm[Hg]` |
| **Arterial Pressure (Mean)**| Numeric | `MDC_PRESS_BLD_MEAN`| `0x4A12` | `mm[Hg]` |
| **Pulse Oxygen Saturation** | Numeric | `MDC_PULS_OXIM_SAT_O2`| `0x4B12` | `%` |
| **End-Tidal CO2** | Numeric | `MDC_AWAY_CO2_ET` | `0x5014` | `mm[Hg]` |
| **Central Venous Pressure** | Numeric | `MDC_PRESS_INTRA_THOR_CVP`| `0x4A40` | `mm[Hg]` |
| **ECG Waveform Lead II** | RealTimeSampleArray | `MDC_ECG_LEAD_II` | `0x0102` | `mV` |
| **Arterial Blood Waveform** | RealTimeSampleArray | `MDC_PRESS_BLD_ART` | `0x4A00` | `mmHg` |
| **Plethysmogram Waveform** | RealTimeSampleArray | `MDC_PULS_OXIM_PLETH`| `0x4B00` | `Relative` |

---

## 2. Framing and Physical Layer Transport

Telemetry packets are encapsulated in binary frames designed for robust transmission over RS-422, USB, or WebSocket connections:

```
+------------+------------+---------------+----------------+-------------------+------------+
| Preamble   | Sequence   | Payload Length| MDER APDU      | CRC-16-CCITT      | Postamble  |
| 0xAA55     | (16-bit)   | (16-bit)      | (Variable N)   | Syndrome (16-bit) | 0x55AA     |
| [2 Bytes]  | [2 Bytes]  | [2 Bytes]     | [N Bytes]      | [2 Bytes]         | [2 Bytes]  |
+------------+------------+---------------+----------------+-------------------+------------+
```

### Frame Fields

1. **Preamble (Sync Word)**: `0xAA55` (2 octets) establishes packet boundary synchronization.
2. **Sequence Number**: 16-bit monotonically increasing sequence identifier for packet loss detection.
3. **Payload Length**: 16-bit unsigned integer denoting total byte count of the encapsulated APDU payload.
4. **Payload**: Abstract Syntax Notation One (ASN.1) encoded Application Protocol Data Unit (APDU).
5. **CRC-16-CCITT Checksum**: 16-bit cyclic redundancy check computed across Sequence, Length, and Payload octets using the generator polynomial:

$$G(x) = x^{16} + x^{12} + x^5 + 1 \quad (\text{Hexadecimal: } 0x1021)$$

Initial seed value is `0xFFFF`.
6. **Postamble**: `0x55AA` (2 octets) terminates frame verification.

---

## 3. Medical Device Encoding Rules (MDER)

IEEE 11073-20601 Annex F specifies the Medical Device Encoding Rules (MDER) transfer syntax. Unlike heavyweight XML, JSON, or BER (Basic Encoding Rules), MDER uses fixed-field binary alignment without tag overhead for known object attributes:

### Primitive Transfer Syntaxes

* `INT-U8`: 1 octet (unsigned integer 0 to 255)
* `INT-U16`: 2 octets in Big-Endian (network byte order)
* `INT-U32`: 4 octets in Big-Endian
* `FLOAT-Type`: 32-bit floating point composed of 8-bit signed exponent followed by 24-bit signed mantissa
* `SFLOAT-Type`: 16-bit short floating point composed of 4-bit signed exponent followed by 12-bit signed mantissa:

$$Value = Mantissa \times 10^{Exponent}$$

Special reserved SFLOAT values:
* `0x07FE`: Positive Infinity
* `0x07FF`: Not a Number (NaN)
* `0x0800`: Not at User Configured Resolution (NaoR)
* `0x0802`: Negative Infinity

### Event Report APDU (prst/roiv-cmip-confirmed-event-report)

Real-time telemetry samples are streamed via periodic Confirmed Event Reports containing ScanReportPerFixed groups. Each report delivers:
* Scan-Report-Number (16-bit integer)
* Observation-Scan-Fixed List (ordered array of Handle, Timestamp, and Metric Value entries)
