# Clinical Emergency Scenarios and Pathophysiological Protocols

Systole incorporates seven deterministic clinical crisis simulation scenarios modeling complex cardiovascular, respiratory, and metabolic emergencies encountered in critical care medicine.

---

## Scenario 1: Nominal Resting Baseline

* **Clinical Vignette**: 58-year-old male admitted for post-operative observational telemetry following elective laparoscopic cholecystectomy. Hemodynamically stable, extubated, breathing room air.
* **Hemodynamics**: HR 75 bpm (Normal Sinus Rhythm), BP 120/80 mmHg (MAP 93 mmHg), CVP 6 mmHg, Cardiac Output 5.2 L/min, SVR 1338 dynes*s/cm5.
* **Ventilation**: SpO2 98%, EtCO2 38 mmHg, RR 14 bpm.
* **ECG Morphology**: Normal upright P-waves, narrow QRS (84 ms), normal ST segments without elevation or depression.
* **Protocol Target**: Baseline stability surveillance; low risk.

---

## Scenario 2: Acute Anterior STEMI (Myocardial Infarction)

* **Pathophysiology**: Acute thrombotic occlusion of the proximal Left Anterior Descending (LAD) coronary artery causing transmural ischemia of the anterior left ventricular wall and interventricular septum.
* **Diagnostic Criteria**:
  * ST-segment elevation $\ge 0.35$ mV in precordial leads V1, V2, V3, and V4
  * Reciprocal ST-segment depression in inferior leads II, III, and aVF
  * Hyperacute symmetrical T-waves evolving into pathological Q-waves
* **Hemodynamics**: HR 95 bpm, BP 105/65 mmHg (MAP 78 mmHg), CVP 10 mmHg, Cardiac Output 3.8 L/min (impaired LV contractility), LVSWI reduced to 34 g*m/m2.
* **Alarm Cascade**: High-priority ST Elevation Alert followed by warning alerts for ventricular premature contractions.
* **Intervention Protocol**: Immediate cardiac catheterization activation (Primary PCI), dual antiplatelet therapy (Aspirin + Ticagrelor), anticoagulation (Heparin), and intravenous nitroglycerin titration.

---

## Scenario 3: Septic Shock (Hyperdynamic Distributive)

* **Pathophysiology**: Severe bacterial sepsis (e.g. urosepsis or pneumonia) triggering systemic inflammatory cascade, widespread endothelial nitric oxide release, profound peripheral arteriolar vasodilation, and capillary leak syndrome.
* **Hemodynamics**:
  * Marked tachycardia: HR 128 bpm
  * Profound hypotension: BP 84/42 mmHg (MAP 56 mmHg)
  * Low SVR: 480 dynes*s/cm5 (severe loss of vascular tone)
  * Compensatory high Cardiac Index: CI 4.8 L/min/m2 (warm shock)
  * Elevated serum lactate: 4.8 mmol/L
* **Alarm Cascade**: Crisis Severe Hypotension (MAP < 65 mmHg) and Warning Extreme Tachycardia.
* **Intervention Protocol**: Surviving Sepsis Campaign bundle: 30 mL/kg balanced crystalloid fluid resuscitation, broad-spectrum antibiotics, and central line titration of Norepinephrine to restore target MAP $\ge 65$ mmHg.

---

## Scenario 4: Tension Pneumothorax

* **Pathophysiology**: One-way valve laceration of the visceral pleura allowing air accumulation within the pleural space during positive pressure ventilation. Progressive intrathoracic pressure elevation causes total ipsilateral lung collapse, mediastinal shift, and severe compression of the superior and inferior vena cava.
* **Hemodynamics**:
  * Obstructive shock: BP 72/48 mmHg (MAP 56 mmHg)
  * Marked CVP elevation: 18 mmHg (impaired venous return from caval kinking)
  * Acute right ventricular afterload spike
* **Ventilation**:
  * Severe hypoxemia: SpO2 76%
  * High peak inspiratory pressure: PIP > 45 cmH2O
  * Severe drop in static lung compliance: Cstat < 18 mL/cmH2O
* **Alarm Cascade**: Crisis Critical Desaturation, Crisis Severe Hypotension, High PIP Ventilator Alarm.
* **Intervention Protocol**: Immediate emergency needle thoracostomy (decompression) at 2nd intercostal space mid-clavicular line, followed by tube thoracostomy (chest tube) placement.

---

## Scenario 5: Severe Hemorrhagic Shock (Class III/IV)

* **Pathophysiology**: Massive internal or external hemorrhage resulting in rapid loss of greater than 30% to 40% of intravascular circulating blood volume.
* **Hemodynamics**:
  * Severe tachycardia: HR 135 bpm
  * Marked hypotension: BP 78/54 mmHg (narrow pulse pressure $PP = 24$ mmHg)
  * Extremely low CVP: 1.5 mmHg (profound preload depletion)
  * Compensatory intense vasoconstriction: SVR 1850 dynes*s/cm5
  * Depressed Cardiac Output: CO 2.8 L/min, DO2I reduced to 260 mL/min/m2
* **Ventilation**: Tachypnea: RR 28 bpm, compensatory respiratory alkalosis with lactic acidosis.
* **Alarm Cascade**: Crisis Severe Hypotension, Crisis Extreme Tachycardia, Warning Narrow Pulse Pressure.
* **Intervention Protocol**: Massive Transfusion Protocol (MTP) activation with 1:1:1 ratio of Packed Red Blood Cells, Fresh Frozen Plasma, and Platelets; Tranexamic acid (TXA); surgical damage control for definitive hemostasis.

---

## Scenario 6: Opioid-Induced Respiratory Depression

* **Pathophysiology**: Excessive central nervous system mu-opioid receptor stimulation causing blunted brainstem respiratory chemoreceptor sensitivity to carbon dioxide.
* **Ventilation**:
  * Severe bradypnea: RR 4 to 6 breaths per minute
  * Alveolar hypoventilation leading to marked hypercapnia: EtCO2 62 mmHg
  * Progressive secondary hypoxemia: SpO2 84%
  * Acute respiratory acidosis: pH 7.18, PaCO2 68 mmHg
* **Hemodynamics**: Moderate bradycardia (HR 48 bpm) and mild hypotension.
* **Alarm Cascade**: Crisis Apnea Detected (>20s breath pause), Warning Severe Hypercapnia, Crisis Hypoxemia.
* **Intervention Protocol**: Bag-valve-mask manual ventilation with 100% oxygen; incremental intravenous Naloxone titration (0.04 mg to 0.4 mg) to restore spontaneous ventilation without precipitating acute withdrawal.

---

## Scenario 7: Malignant Hyperthermia Crisis

* **Pathophysiology**: Pharmacogenetic hypermetabolic crisis triggered by volatile halogenated anesthetics (Isoflurane/Sevoflurane) or succinylcholine in individuals with Ryanodine Receptor (RYR1) gene mutations. Uncontrolled sarcoplasmic reticulum calcium release causes sustained skeletal muscle rigidity, massive cellular oxygen consumption, and hyperthermia.
* **Diagnostic Signs**:
  * Earliest, most sensitive indicator: Sudden dramatic doubling of expired carbon dioxide (EtCO2 > 70 mmHg) refractory to hyperventilation
  * Severe sinus tachycardia: HR 145 bpm
  * Hyperthermia: Temperature rapidly escalating past 40.5 degrees Celsius (105 degrees Fahrenheit)
  * Profound combined metabolic and respiratory acidosis with hyperkalemia
* **Alarm Cascade**: Crisis Extreme Hyperthermia, Crisis Extreme Hypercapnia, Warning Extreme Tachycardia.
* **Intervention Protocol**:
  1. Immediately discontinue all volatile anesthetics; hyperventilate with 100% oxygen at 10 L/min
  2. Administer intravenous Dantrolene sodium (2.5 mg/kg bolus, repeating every 10 minutes until symptoms abate)
  3. Active surface and core cooling (iced saline lavage, cooling blankets)
  4. Correct hyperkalemia with intravenous calcium chloride, insulin, and glucose
