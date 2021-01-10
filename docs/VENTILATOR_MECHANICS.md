# Mechanical Ventilation Mechanics and Pulmonary Graphics

This document outlines the biophysical models, respiratory system equation of motion, mechanical ventilation modes, and waveform scalar analysis implemented in Systole.

---

## 1. Equation of Motion of the Respiratory System

In an intubated patient receiving positive pressure mechanical ventilation, total airway pressure ($P_{aw}(t)$ in $cmH_2O$) required to deliver gas into the lungs is governed by the classical Equation of Motion:

$$P_{aw}(t) = P_{mus}(t) + PEEP_{tot} + P_{resistive}(t) + P_{elastic}(t)$$

Assuming passive mechanical ventilation without spontaneous patient muscular effort ($P_{mus}(t) = 0$):

$$P_{aw}(t) = PEEP_{tot} + \dot{V}(t) \cdot R_{aw} + \frac{V(t)}{C_{stat}}$$

Where:
* $PEEP_{tot} = PEEP_{applied} + PEEP_{auto}$ (total positive end-expiratory pressure, $cmH_2O$)
* $\dot{V}(t)$: Instantaneous gas flow rate ($L/s$)
* $R_{aw}$: Airway resistance ($cmH_2O / (L/s)$)
* $V(t)$: Instantaneous delivered volume above end-expiratory equilibrium ($mL$ or $L$)
* $C_{stat}$: Static compliance of the total respiratory system (lungs and chest wall, $mL / cmH_2O$)

---

## 2. Ventilation Modes

### 1. Volume-Controlled Ventilation (VCV)

* Control Variable: Tidal volume ($V_T$) and inspiratory flow profile ($\dot{V}$).
* Dependent Variable: Airway pressure ($P_{aw}$).
* Flow Delivery Options:
  * Square Flow: Constant flow $\dot{V} = V_T / T_i$. Airway pressure rises linearly with volume.
  * Decelerating Ramp: Peak flow occurs immediately at inspiratory onset, tapering linearly toward zero by end-inspiration. Matches natural physiological inspiratory effort.

### 2. Pressure-Controlled Ventilation (PCV)

* Control Variable: Inspiratory driving pressure ($\Delta P = P_{insp} - PEEP$).
* Dependent Variable: Delivered tidal volume ($V_T$) and flow ($\dot{V}$).
* Flow Dynamics: Follows an exponential decay governed by the respiratory time constant $\tau = R_{aw} \cdot C_{stat}$:

$$\dot{V}(t) = \frac{\Delta P}{R_{aw}} e^{-t / \tau}$$

### 3. Pressure Support Ventilation (PSV)

* Patient-Triggered: Triggered by patient inspiratory effort (pressure drop or flow deflection).
* Flow-Cycled: Terminates inspiration and switches to expiration when inspiratory flow decays to a set fraction (e.g. 25%) of peak inspiratory flow.

---

## 3. Diagnostic Clinical Parameters

### Peak Inspiratory Pressure (PIP)

Maximum airway pressure measured at the end of active gas flow:

$$PIP = PEEP + \dot{V}_{peak} \cdot R_{aw} + \frac{V_T}{C_{stat}}$$

Target: Keep $PIP < 35 \text{ cmH}_2O$ to avoid barotrauma and alveolar rupture.

### Plateau Pressure ($P_{plat}$)

Measured during an end-inspiratory pause when gas flow ceases ($\dot{V} = 0$), eliminating resistive pressure drops across the endotracheal tube:

$$P_{plat} = PEEP + \frac{V_T}{C_{stat}}$$

Target: Keep $P_{plat} \le 30 \text{ cmH}_2O$ to prevent lung overdistension and volutrauma.

### Driving Pressure ($\Delta P$)

$$\Delta P = P_{plat} - PEEP = \frac{V_T}{C_{stat}}$$

Target: Keep $\Delta P < 15 \text{ cmH}_2O$. Elevated driving pressure is strongly associated with increased ARDS mortality.

### Static Compliance ($C_{stat}$)

$$C_{stat} = \frac{V_T}{P_{plat} - PEEP_{tot}} \quad (mL / cmH_2O)$$

* Normal Ventilated Lung: 50 to 80 $mL/cmH_2O$
* Moderate ARDS: 30 to 45 $mL/cmH_2O$
* Severe ARDS ("Baby Lung"): Less than 25 $mL/cmH_2O$

### Airway Resistance ($R_{aw}$)

$$R_{aw} = \frac{PIP - P_{plat}}{\dot{V}_{peak}} \quad (cmH_2O / (L/s))$$

* Normal Intubated Adult: 5 to 12 $cmH_2O/(L/s)$
* Severe Bronchospasm / COPD Exacerbation: Greater than 20 $cmH_2O/(L/s)$

### Intrinsic PEEP (Auto-PEEP)

Occurs when expiratory time ($T_e$) is insufficient for the lungs to reach functional residual capacity before the next breath initiates:

$$Auto\text{-}PEEP = P_{total\text{-}exp} - PEEP_{applied}$$

---

## 4. Patient-Ventilator Asynchrony Detection

Systole analyzes real-time scalar flow-time and pressure-time curves to detect dyssynchronous breathing:

1. **Ineffective Triggering**: Patient inspiratory dip observed in airway pressure during expiration without triggering an assisted breath. Common in severe COPD with high auto-PEEP.
2. **Double Triggering (Breath Stacking)**: A second mandatory breath is triggered within the preceding breath expiratory phase ($< 100$ ms pause), stacking two tidal volumes and generating dangerous peak airway pressures.
3. **Delayed Cycling**: Inspiratory time $T_i$ exceeds the patient neural inspiratory time, causing active expiratory muscle activation against the ventilator inspiratory valve.
