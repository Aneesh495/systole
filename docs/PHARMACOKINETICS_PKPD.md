# Pharmacokinetics and Pharmacodynamics (PK/PD) Mathematical Specification

This document details the multi-compartment differential equations, demographic covariate scaling formulas, Target-Controlled Infusion (TCI) stepped rate schedulers, and pharmacodynamic Hill equations governing intravenous drug simulation in Systole.

---

## 1. Linear Three-Compartment Mamillary Model

Intravenous anesthetic agents, analgesics, and inotropic infusions distribute across three functional fluid compartments:
1. Central Compartment ($V_1$): Intravascular plasma volume and vessel-rich organs (brain, heart, liver, kidneys)
2. Rapid Peripheral Compartment ($V_2$): Skeletal muscle and lean tissue
3. Slow Peripheral Compartment ($V_3$): Adipose tissue and poorly perfused structural organs
4. Effect Site ($V_e$): Virtual biophase compartment representing central nervous system receptor binding sites (negligible volume)

```
        +----------------------------------------+
        | Infusion Rate I(t)                    |
        +----------------------------------------+
                           |
                           v
        +----------------------------------------+     k1e
        | Central Compartment (V1, Mass M1)     | ------------> [ Effect Site Ce ]
        | Concentration Cp = M1 / V1            | <------------
        +----------------------------------------+     ke0
             ^   |                  ^   |
         k21 |   | k12          k31 |   | k13
             |   v                  |   v
     +---------------+          +---------------+
     | Fast (V2, M2) |          | Slow (V3, M3) |
     +---------------+          +---------------+
                 |
                 v k10
          [ Elimination ]
```

### System of Differential Equations

The time evolution of drug mass across each compartment is governed by the coupled linear ordinary differential equation system:

$$\frac{dM_1}{dt} = I(t) - (k_{10} + k_{12} + k_{13}) M_1(t) + k_{21} M_2(t) + k_{31} M_3(t)$$

$$\frac{dM_2}{dt} = k_{12} M_1(t) - k_{21} M_2(t)$$

$$\frac{dM_3}{dt} = k_{13} M_1(t) - k_{31} M_3(t)$$

Plasma concentration is:

$$C_p(t) = \frac{M_1(t)}{V_1}$$

Effect-site concentration equilibration is governed by the first-order rate constant $k_{e0}$:

$$\frac{dC_e}{dt} = k_{e0} \cdot (C_p(t) - C_e(t))$$

### Intercompartmental Rate Constants

Rate constants are derived from physiological clearances ($Cl_1, Cl_2, Cl_3$ in L/min) and compartment volumes ($V_1, V_2, V_3$ in Liters):

$$k_{10} = \frac{Cl_1}{V_1}, \quad k_{12} = \frac{Cl_2}{V_1}, \quad k_{21} = \frac{Cl_2}{V_2}, \quad k_{13} = \frac{Cl_3}{V_1}, \quad k_{31} = \frac{Cl_3}{V_3}$$

---

## 2. Propofol Model Parameter Sets

### 1. Marsh Model

The classical Marsh model parameters scale proportionally with total body weight ($W$ in kg):

$$V_1 = 0.228 \times W \quad (L)$$

$$V_2 = 0.463 \times W \quad (L)$$

$$V_3 = 2.893 \times W \quad (L)$$

$$k_{10} = 0.119 \text{ min}^{-1}, \quad k_{12} = 0.112 \text{ min}^{-1}, \quad k_{21} = 0.055 \text{ min}^{-1}$$

$$k_{13} = 0.042 \text{ min}^{-1}, \quad k_{31} = 0.0033 \text{ min}^{-1}, \quad k_{e0} = 0.26 \text{ min}^{-1}$$

### 2. Schnider Model

The Schnider model incorporates age, height, and Lean Body Mass ($LBM$) calculated via the James equations:

For adult males:

$$LBM = 1.10 \times W - 128 \times \left(\frac{W}{H}\right)^2$$

For adult females:

$$LBM = 1.07 \times W - 148 \times \left(\frac{W}{H}\right)^2$$

Schnider volume parameters are fixed:

$$V_1 = 4.27 \quad (L)$$

$$V_2 = 18.9 - 0.391 \times (Age - 53) \quad (L)$$

$$V_3 = 238.0 \quad (L)$$

Clearances scale with weight and lean body mass:

$$Cl_1 = 1.89 + 0.0456 \times (W - 77) - 0.0681 \times (LBM - 59) + 0.0264 \times (H - 177) \quad (L/min)$$

$$k_{e0} = 0.456 \text{ min}^{-1}$$

### 3. General Purpose Eleveld Model

The Eleveld model provides a unified parameter set valid from premature neonates to centenarians, incorporating allometric weight scaling and post-menstrual maturation:

$$PMA = 40.0 + (Age \times 52.14) \quad (\text{weeks})$$

$$Maturation = \frac{PMA^{3.92}}{PMA^{3.92} + 61.0^{3.92}}$$

All clearances scale allometrically:

$$Cl \propto \left(\frac{W}{70}\right)^{0.75} \times Maturation$$

---

## 3. Target-Controlled Infusion (TCI) Titration Mathematics

Target-Controlled Infusion algorithms calculate the infusion rate profile required to achieve and maintain a user-selected target effect-site concentration ($C_{target}$).

### Initial Loading Bolus

Delivered instantaneously to fill the central volume:

$$Bolus = C_{target} \times V_1$$

### Stepped Maintenance Infusion Rates (BET Formulation)

To counteract elimination and intercompartmental redistribution, the required infusion rate $I(t)$ follows a three-stage exponential decay (Bolus, Elimination, Transfer):

$$I(t) = C_{target} \times Cl_1 + C_{target} \times Cl_2 \cdot e^{-k_{21} t} + C_{target} \times Cl_3 \cdot e^{-k_{31} t}$$

Systole implements stepped titration intervals:
* 0 to 10 min: High replacement rate ($I_1 = C_{target} \times (Cl_1 + Cl_2 + Cl_3)$)
* 10 to 60 min: Medium redistribution rate ($I_2 = C_{target} \times (Cl_1 + Cl_3)$)
* Greater than 60 min: Steady-state elimination rate ($I_3 = C_{target} \times Cl_1$)

---

## 4. Pharmacodynamics (Sigmoid Emax Hill Equations)

Drug concentration at the effect site ($C_e$) maps non-linearly to clinical physiological end-points via the Sigmoid $E_{max}$ Hill equation:

$$E(C_e) = E_0 + \frac{E_{max} \cdot C_e^\gamma}{C_e^\gamma + EC_{50}^\gamma}$$

Where:
* $E_0$: Baseline physiological response in the absence of drug
* $E_{max}$: Maximum drug effect capacity (positive for stimulants, negative for depressants)
* $EC_{50}$: Effect-site concentration producing 50% of maximum effect
* $\gamma$: Hill cooperativity coefficient determining curve steepness

### Clinical Drug Pharmacodynamic Parameters

| Drug | Target Clinical Metric | $E_0$ | $E_{max}$ | $EC_{50}$ | $\gamma$ | Clinical Range |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Propofol** | Bispectral Index (BIS) | 98.0 | -84.0 | 3.4 $\mu g/mL$ | 2.8 | 40 to 60 (General Anesthesia) |
| **Norepinephrine** | Mean Arterial Pressure | 65.0 mmHg | +55.0 mmHg | 0.08 $\mu g/kg/min$ | 1.8 | MAP 65 to 85 mmHg |
| **Dobutamine** | Cardiac Output Boost | 4.2 L/min | +4.5 L/min | 0.06 $\mu g/kg/min$ | 1.5 | CI 2.5 to 4.0 $L/min/m^2$ |
| **Fentanyl** | Analgesia / Respiratory Depression | 100.0% | -80.0% | 2.0 $ng/mL$ | 2.2 | 1.5 to 3.0 $ng/mL$ |
