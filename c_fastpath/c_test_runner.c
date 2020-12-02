#include "systole_dsp.h"
#include <stdio.h>
#include <math.h>
#include <assert.h>

#define EPSILON 1e-6

static void test_biquad_numerical_identity(void) {
    systole_biquad_coeffs_t coeffs = {1.0, 0.0, 0.0, 0.0, 0.0};
    systole_biquad_state_t state;
    systole_biquad_init(&state);

    double output = systole_biquad_step(&coeffs, 42.5, &state);
    assert(fabs(output - 42.5) < EPSILON);
    printf("PASS: test_biquad_numerical_identity\n");
}

static void test_biquad_cascade(void) {
    systole_biquad_coeffs_t stages[2];
    stages[0] = (systole_biquad_coeffs_t){2.0, 0.0, 0.0, 0.0, 0.0};
    stages[1] = (systole_biquad_coeffs_t){3.0, 0.0, 0.0, 0.0, 0.0};

    systole_cascade_t casc;
    systole_cascade_init(&casc, 2, stages);

    double out = systole_cascade_step(&casc, 5.0);
    /* 5.0 * 2.0 * 3.0 = 30.0 */
    assert(fabs(out - 30.0) < EPSILON);
    printf("PASS: test_biquad_cascade\n");
}

static void test_dwt_haar(void) {
    double in[4] = {1.0, 1.0, 2.0, 2.0};
    double approx[2];
    double detail[2];

    systole_dwt_haar_step(in, 4, approx, detail);

    /* (1 + 1)/sqrt(2) = sqrt(2) ~ 1.41421356 */
    assert(fabs(approx[0] - sqrt(2.0)) < EPSILON);
    /* (1 - 1)/sqrt(2) = 0 */
    assert(fabs(detail[0] - 0.0) < EPSILON);
    printf("PASS: test_dwt_haar\n");
}

static void test_pv_loop_mechanics(void) {
    double ees = 2.2;
    double v0 = 10.0;
    double vol = 120.0;

    double p_espvr = systole_pv_espvr(ees, v0, vol);
    /* 2.2 * (120 - 10) = 242.0 */
    assert(fabs(p_espvr - 242.0) < EPSILON);

    double ea = systole_pv_arterial_elastance(100.0, 50.0);
    assert(fabs(ea - 2.0) < EPSILON);

    double vac = systole_pv_vac(ea, ees);
    /* 2.0 / 2.2 ~ 0.9090909 */
    assert(fabs(vac - (2.0 / 2.2)) < EPSILON);
    printf("PASS: test_pv_loop_mechanics\n");
}

static void test_ventilator_equation_of_motion(void) {
    double peep = 8.0;
    double flow_lps = 0.5;
    double raw = 10.0;
    double vol_ml = 500.0;
    double cstat = 50.0;

    /* Paw = PEEP + (V / Cstat) + (flow * Raw) = 8 + (500/50) + (0.5 * 10) = 8 + 10 + 5 = 23.0 cmH2O */
    double paw = systole_vent_airway_pressure(peep, flow_lps, raw, vol_ml, cstat);
    assert(fabs(paw - 23.0) < EPSILON);
    printf("PASS: test_ventilator_equation_of_motion\n");
}

static void test_pan_tompkins_qrs_detection(void) {
    systole_pan_tompkins_t pt;
    systole_pt_init(&pt, 200.0);

    int peaks_found = 0;
    /* Synthesize 1600 samples (8.0 sec) at 75 BPM (period = 160 samples) */
    for (int i = 0; i < 1600; ++i) {
        int phase = i % 160;
        double ecg = 0.0;
        if (phase >= 75 && phase <= 85) {
            double dist = (double)(phase - 80);
            ecg = 1.5 * exp(-0.5 * dist * dist);
        }

        double peak_val = 0.0;
        if (systole_pt_process(&pt, ecg, &peak_val)) {
            peaks_found++;
        }
    }

    assert(peaks_found >= 8 && peaks_found <= 12);
    printf("PASS: test_pan_tompkins_qrs_detection (detected %d peaks)\n", peaks_found);
}

static void test_bsa_dubois(void) {
    double bsa = systole_calculate_bsa_dubois(70.0, 175.0);
    assert(fabs(bsa - 1.85412) < 0.01);
    printf("PASS: test_bsa_dubois\n");
}

static void test_svr_calculation(void) {
    double svr = systole_calculate_svr(90.0, 5.0, 5.0);
    assert(fabs(svr - 1360.0) < EPSILON);
    printf("PASS: test_svr_calculation\n");
}

static void test_pk_compartment_kinetics(void) {
    systole_pk_state_t pk;
    systole_pk_init(&pk, 15.9, 26.3, 144.0, 0.119, 0.114, 0.055, 0.042, 0.0033, 0.26);

    double cp = 0.0, ce = 0.0;
    for (int t = 0; t < 10; ++t) {
        systole_pk_step(&pk, 5000.0, 1.0, &cp, &ce);
    }

    assert(cp > 1.0 && cp < 6.0);
    assert(ce > 0.5 && ce < 6.0);
    printf("PASS: test_pk_compartment_kinetics (Cp=%.2f, Ce=%.2f ug/mL)\n", cp, ce);
}

static void test_pharmacodynamics_bis(void) {
    double bis = systole_sigmoid_emax(98.0, -84.0, 3.4, 2.8, 3.4);
    assert(fabs(bis - (98.0 - 42.0)) < 0.1);
    printf("PASS: test_pharmacodynamics_bis (BIS=%.1f)\n", bis);
}

int main(void) {
    printf("Executing Systole C Fastpath Numerical Equivalence Verification Suite...\n");
    test_biquad_numerical_identity();
    test_biquad_cascade();
    test_dwt_haar();
    test_pv_loop_mechanics();
    test_ventilator_equation_of_motion();
    test_pan_tompkins_qrs_detection();
    test_bsa_dubois();
    test_svr_calculation();
    test_pk_compartment_kinetics();
    test_pharmacodynamics_bis();
    printf("All 10 C Fastpath unit verification tests completed successfully with zero defects.\n");
    return 0;
}
