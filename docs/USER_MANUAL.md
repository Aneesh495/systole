# Bedside Telemetry Operator Guide and User Manual

This operator guide provides instructions for clinical nursing staff, intensive care physicians, and biomedical engineers operating the Systole physiological telemetry workstation.

---

## 1. Workstation Interface Layout

The Systole display is divided into five dedicated functional zones:

```
+----------------------------------------------------------------------------------+
| 1. IEC 60601-1-8 ALARM PRESENTATION BANNER (Top Banner)                          |
| Active Priority Alert Ticker | Silence [ESC] | Audio Mute Countdown | Ack All   |
+----------------------------------------------------------------------------------+
| 2. PATIENT DEMOGRAPHIC AND CONNING HEADER                                        |
| Bed Number | Name | Age/Sex/BSA | Diagnosis | NEWS2 Score | SOFA Score | Time    |
+-----------------------------------------------------------------+----------------+
| 3. MULTI-CHANNEL VECTOR SWEEPBAR OSCILLOSCOPE                   | 4. NUMERIC     |
| - Channel 1: Lead II ECG (Neon Green, -0.5 to 1.8 mV)           | CALLOUT TILES  |
| - Channel 2: Arterial Blood Pressure (Red, 0 to 180 mmHg)       | - HR & Rhythm  |
| - Channel 3: SpO2 Photoplethysmogram (Cyan, Pulsatile)          | - ABP Sys/Dia  |
| - Channel 4: Microstream Capnography (Yellow, 0 to 60 mmHg)     | - SpO2 & PI    |
| - Channel 5: Central Venous Pressure (Royal Blue, 0 to 25 mmHg) | - EtCO2 & RR   |
|                                                                 | - CVP & Temp   |
+-----------------------------------------------------------------+----------------+
| 5. CLINICAL CONTROL TOOLBAR (Bottom Bar)                                         |
| Play/Pause | Speed (1x, 2x, 5x) | Scenarios | Modals (1-8) | Ward | Emergencies |
+----------------------------------------------------------------------------------+
```

---

## 2. Keyboard Navigation and Hotkeys

To facilitate rapid bedside access without requiring mouse input during emergency resuscitations, all diagnostic modals and emergency actions feature dedicated single-key shortcuts:

| Key | Action / Workstation Function | Description |
| :--- | :--- | :--- |
| `Space` | **Toggle Pause / Resume** | Freezes simulation waveforms for caliper inspection. |
| `Escape` | **Silence Alarms / Close Modal** | Silences audio alarms for 120 seconds or closes active modal. |
| `1` | **Diagnostic 12-Lead ECG Modal** | Standard 4x3 diagnostic ECG with Lead II rhythm strip. |
| `2` | **Hemodynamics Dashboard** | Frank-Starling curve and SVR vs CI state-space quadrant. |
| `3` | **Smart Infusion Pump** | Three-compartment TCI syringe pump interface. |
| `4` | **PV Loop Analysis** | Left ventricular Pressure-Volume loop with elastance lines. |
| `5` | **Ventilator Graphics** | Scalar Paw, Flow, and Volume tracks with mechanics metrics. |
| `6` | **Retrospective Trends** | Longitudinal multi-parameter vital sign trends and tabular log. |
| `7` | **HRV Spectral Density** | Power spectral density and autonomic tone (LF/HF ratio). |
| `8` | **EHR Clinical Export** | HL7 FHIR R4 JSON observation bundle and progress summary. |
| `W` | **Toggle Ward Overview** | Switches between single-patient bedside view and 8-bed ward station. |

---

## 3. Operating the Diagnostic Modals

### 12-Lead ECG Workstation (`Key 1`)

Displays simultaneous recordings across all 12 clinical leads (I, II, III, aVR, aVL, aVF, V1, V2, V3, V4, V5, V6) calibrated to standard clinical paper settings:
* Paper Speed: $25 \text{ mm/sec}$
* Voltage Sensitivity: $10 \text{ mm/mV}$ ($1.0 \text{ mV}$ square calibration pulse rendered on margin)
* Automated Metrics: Evaluates ST-segment elevation across anterior leads (V1-V4), measures QTc interval via Bazett and Fridericia formulas, and computes frontal plane mean electrical axis.

### Hemodynamics Workstation (`Key 2`)

Visualizes left ventricular performance on the Frank-Starling functional curve (Stroke Volume Index vs Central Venous Pressure / PAWP) and the SVR vs Cardiac Index state-space plane. Diagnostic classifications automatically detect shock archetypes:
* Cardiogenic Shock (depressed CI, elevated SVR)
* Distributive Septic Shock (hyperdynamic CI, depressed SVR)
* Hypovolemic Shock (depressed CI, elevated SVR, low filling pressures)

### Smart Syringe Infusion Pump Workstation (`Key 3`)

Simulates target-controlled infusion (TCI) for anesthesia and critical care infusions:
1. Select drug agent (Propofol Marsh, Propofol Schnider, Norepinephrine, Dobutamine, Fentanyl)
2. Enter target effect-site concentration ($C_e$) or adjust mass infusion rate ($\mu g/min$)
3. View real-time predicted plasma ($C_p$) and effect-site ($C_e$) concentration curves
4. Monitor simulated Bispectral Index (BIS) depth of hypnosis (target: 40 to 60 for surgical anesthesia)
5. Administer emergency bolus when indicated

### Mechanical Ventilator Graphics (`Key 5`)

Provides dedicated pulmonary monitoring for intubated patients:
* Three synchronized scalar waveforms: Airway Pressure ($P_{aw}$), Flow ($\dot{V}$), and Delivered Volume ($V$)
* Modes: Volume-Controlled (VCV), Pressure-Controlled (PCV), and Pressure Support (PSV)
* Real-time pulmonary mechanics calculations: Peak Inspiratory Pressure (PIP), Plateau Pressure ($P_{plat}$), Static Compliance ($C_{stat}$), and Airway Resistance ($R_{aw}$)

---

## 4. Alarm Silence and Alarm Management

When an alarm triggers:
1. Identify the priority banner:
   * **Red Flashing Banner**: Immediate crisis requiring urgent patient assessment.
   * **Yellow Flashing Banner**: Warning condition requiring prompt diagnostic attention.
   * **Cyan Banner**: Technical advisory (e.g. electrode displacement).
2. Press `Escape` or click `Silence Alarms` to silence acoustic chimes for 120 seconds while attending to the patient.
3. If an electrode becomes disconnected, the Bayesian fusion gate will indicate `EcgLeadOff` instead of triggering a false cardiac arrest alarm, provided arterial or plethysmographic pulses remain active.
