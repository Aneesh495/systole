# Clinical Hemodynamics and Cardiovascular Mechanics

This guide outlines the mathematical formulations, physiological principles, and diagnostic interpretation protocols embedded in Systole's clinical hemodynamics engine.

---

## 1. Body Surface Area (BSA) Normalization

Cardiovascular measurements vary widely across body sizes. To standardize comparisons, all volumetric and resistance metrics are indexed to Body Surface Area ($BSA$ in $m^2$).

### DuBois and DuBois Formulation

$$BSA_{DuBois} = 0.007184 \times W^{0.425} \times H^{0.725}$$

Where $W$ is weight in kilograms and $H$ is height in centimeters.

### Mosteller Simplification

$$BSA_{Mosteller} = \sqrt{\frac{W \times H}{3600}}$$

---

## 2. Fundamental Hemodynamic Indices

### Mean Arterial Pressure (MAP)

In the absence of high-fidelity arterial line pulse contour integration, MAP is approximated from cuff sphygmomanometry:

$$MAP \approx DBP + \frac{1}{3} (SBP - DBP)$$

Under arterial line monitoring, MAP is calculated via discrete integration of the arterial pressure wave:

$$MAP = \frac{1}{T_{cycle}} \int_{0}^{T_{cycle}} P_{art}(t) \, dt$$

### Cardiac Output and Cardiac Index

$$CO = \frac{HR \times SV}{1000} \quad (L/min)$$

$$CI = \frac{CO}{BSA} \quad (L/min/m^2)$$

Normal resting target: $2.5 \le CI \le 4.2 \text{ L/min/m}^2$.

---

## 3. Vascular Resistances

### Systemic Vascular Resistance (SVR and SVRI)

Systemic vascular resistance measures left ventricular afterload imposed by the systemic arteriolar bed:

$$SVR = 80 \times \frac{MAP - CVP}{CO} \quad (\text{dynes}\cdot\text{s}/\text{cm}^5)$$

$$SVRI = 80 \times \frac{MAP - CVP}{CI} \quad (\text{dynes}\cdot\text{s}\cdot\text{m}^2/\text{cm}^5)$$

Normal target interval: $800 \le SVR \le 1200 \text{ dynes}\cdot\text{s}/\text{cm}^5$.

### Pulmonary Vascular Resistance (PVR and PVRI)

Pulmonary vascular resistance measures right ventricular afterload across the pulmonary capillary bed:

$$PVR = 80 \times \frac{MPAP - PAWP}{CO} \quad (\text{dynes}\cdot\text{s}/\text{cm}^5)$$

$$PVRI = 80 \times \frac{MPAP - PAWP}{CI} \quad (\text{dynes}\cdot\text{s}\cdot\text{m}^2/\text{cm}^5)$$

Normal target interval: $100 \le PVR \le 250 \text{ dynes}\cdot\text{s}/\text{cm}^5$.

---

## 4. Ventricular Work Indices

### Left Ventricular Stroke Work Index (LVSWI)

Quantifies mechanical work performed by the left ventricle per square meter of body surface area during each cardiac cycle:

$$LVSWI = 0.0136 \times SVI \times (MAP - PAWP) \quad (g\cdot m/m^2)$$

Where $0.0136$ converts $mmHg \cdot mL$ into gram-meters ($g \cdot m$).
Normal resting baseline: $45 \le LVSWI \le 65 \text{ g}\cdot\text{m/m}^2$.

---

## 5. Suga-Sagawa Pressure-Volume Loops and Elastance

The Left Ventricular Pressure-Volume (PV) plane provides an afterload-independent assessment of intrinsic myocardial contractility and ventriculo-arterial coupling.

### End-Systolic Pressure-Volume Relationship (ESPVR)

Governed by end-systolic elastance ($E_{es}$), representing myocardial inotropic state:

$$P_{es} = E_{es} \cdot (V_{es} - V_0)$$

Where $V_0$ is the extrapolated volume axis intercept at zero intracavity pressure.

### End-Diastolic Pressure-Volume Relationship (EDPVR)

Reflects passive diastolic ventricular stiffness and chamber compliance:

$$P_{ed} = \beta \cdot (e^{\alpha \cdot V_{ed}} - 1)$$

Where $\alpha$ represents the chamber stiffness constant and $\beta$ is a curve-scaling coefficient.

### Effective Arterial Elastance ($E_a$) and Ventriculo-Arterial Coupling

Arterial elastance characterizes the net afterload presented by the arterial system:

$$E_a = \frac{P_{es}}{SV}$$

Ventriculo-Arterial Coupling ($VAC$) is defined as:

$$VAC = \frac{E_a}{E_{es}}$$

* Optimal Energetic Efficiency Coupling: $0.6 \le VAC \le 1.2$.
* Uncoupled Afterload Mismatch ($VAC > 1.5$): Observed in cardiogenic shock and acute heart failure.
* Hyperdynamic Uncoupling ($VAC < 0.6$): Observed in distributive septic shock and profound vasodilation.

---

## 6. Fick Oxygen Transport and Consumption Dynamics

Oxygen delivery ($DO_2$) and consumption ($VO_2$) quantify systemic tissue perfusion and cellular metabolic demand.

### Arterial and Venous Oxygen Contents

$$CaO_2 = (Hb \times 1.34 \times \frac{SaO_2}{100}) + (PaO_2 \times 0.0031) \quad (mL/dL)$$

$$CvO_2 = (Hb \times 1.34 \times \frac{SvO_2}{100}) + (PvO_2 \times 0.0031) \quad (mL/dL)$$

Where:
* $1.34$ mL is the maximum oxygen binding capacity per gram of hemoglobin (Hufner constant)
* $0.0031$ mL/dL/mmHg is the physical solubility coefficient of dissolved oxygen in plasma at 37 degrees Celsius

### Oxygen Delivery Index ($DO_2I$)

$$DO_2I = 10 \times CI \times CaO_2 \quad (mL/min/m^2)$$

Normal target interval: $500 \le DO_2I \le 600 \text{ mL/min/m}^2$.

### Oxygen Consumption Index ($VO_2I$)

$$VO_2I = 10 \times CI \times (CaO_2 - CvO_2) \quad (mL/min/m^2)$$

Normal target interval: $110 \le VO_2I \le 160 \text{ mL/min/m}^2$.

### Oxygen Extraction Ratio ($O_2ER$)

$$O_2ER = \frac{CaO_2 - CvO_2}{CaO_2} \times 100\%$$

Normal resting baseline: $22\% \le O_2ER \le 30\%$.
An $O_2ER > 40\%$ signifies severe cellular hypoxia and compensatory tissue extraction.

---

## 7. Vasoactive-Inotropic Score (VIS)

Quantifies pharmacological cardiovascular support intensity:

$$VIS = Dopamine + Dobutamine + (100 \times Epinephrine) + (10 \times Milrinone) + (10000 \times Vasopressin) + (100 \times Norepinephrine)$$

Where catecholamines and inotropes are measured in $\mu g/kg/min$, and vasopressin is measured in $units/kg/min$.

* $VIS < 10$: Low cardiovascular support requirement
* $10 \le VIS \le 20$: Moderate inotropic/vasopressor dependency
* $VIS > 20$: High-acuity refractory circulatory failure with elevated ICU mortality risk
