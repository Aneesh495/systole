#include <stdio.h>
#include <stdlib.h>
#include <math.h>
#include <stdbool.h>
#include "systole_dsp.h"

static int g_tests_run = 0;
static int g_tests_passed = 0;

#define ASSERT_TRUE(expr) do { \
    g_tests_run++; \
    if (expr) { \
        g_tests_passed++; \
    } else { \
        printf("FAILED [line %d]: %s\n", __LINE__, #expr); \
    } \
} while(0)

#define ASSERT_NEAR(a, b, eps) do { \
    g_tests_run++; \
    double diff = fabs((double)(a) - (double)(b)); \
    if (diff <= (eps)) { \
        g_tests_passed++; \
    } else { \
        printf("FAILED [line %d]: %s (%f) != %s (%f), diff=%f > %f\n", \
               __LINE__, #a, (double)(a), #b, (double)(b), diff, (double)(eps)); \
    } \
} while(0)

void test_biquad_filtering(void) {
    systole_biquad_coeffs_t bp = systole_butterworth_bandpass(200.0, 10.0, 1.0);
    systole_biquad_state_t st;
    systole_biquad_init(&st);

    /* Feed 100 samples of DC step (0 Hz, should be blocked by bandpass) */
    double final_y = 0.0;
    for (int i = 0; i < 200; i++) {
        final_y = systole_biquad_step(&bp, 1.0, &st);
    }
    ASSERT_NEAR(final_y, 0.0, 0.01);
}

void test_pan_tompkins_qrs_detection(void) {
    systole_pan_tompkins_t pt;
    systole_pt_init(&pt, 200.0);

    int peaks_detected = 0;
    /* Synthesize 1600 samples (8.0 sec) at 75 BPM (period = 160 samples) */
    for (int i = 0; i < 1600; i++) {
        int phase = i % 160;
        double x = 0.0;
        if (phase >= 75 && phase <= 85) {
            double dist = (double)(phase - 80);
            x = 1.5 * exp(-0.5 * dist * dist);
        }
        double peak_val = 0.0;
        if (systole_pt_process(&pt, x, &peak_val)) {
            peaks_detected++;
        }
    }
    ASSERT_TRUE(peaks_detected >= 8 && peaks_detected <= 12);
}

void test_hemodynamics_math(void) {
    /* DuBois BSA: 70 kg, 175 cm */
    double bsa = systole_calculate_bsa_dubois(70.0, 175.0);
    ASSERT_NEAR(bsa, 1.85, 0.03);

    /* SVR: MAP=90, CVP=5, CO=5.25 */
    double svr = systole_calculate_svr(90.0, 5.0, 5.25);
    ASSERT_NEAR(svr, 1295.23, 1.0);

    /* Liljestrand-Zander SV: SBP=120, DBP=80, Area=13.0 */
    double sv = systole_estimate_stroke_volume(120.0, 80.0, 13.0);
    ASSERT_TRUE(sv >= 60.0 && sv <= 85.0);
}

void test_pharmacokinetics(void) {
    systole_pk_state_t pk;
    /* Marsh Propofol 70 kg: V1 = 15.96 L */
    systole_pk_init(&pk, 15.96, 32.41, 202.51, 0.119, 0.112, 0.055, 0.0033, 0.0019, 0.26);

    /* Inject 63,840 mcg bolus (target 4.0 mcg/mL) */
    pk.mass_central = 63840.0;

    double cp = 0.0, ce = 0.0;
    systole_pk_step(&pk, 0.0, 0.05, &cp, &ce);
    ASSERT_TRUE(cp >= 3.8 && cp <= 4.1);

    /* Sigmoid Emax: Propofol BIS at Ce = 3.5 */
    double bis = systole_sigmoid_emax(98.0, -98.0, 3.2, 2.4, 3.5);
    ASSERT_TRUE(bis >= 35.0 && bis <= 55.0);

    /* Norepinephrine MAP boost at Ce = 2.5 ng/mL (EC50) */
    double boost = systole_sigmoid_emax(0.0, 50.0, 2.5, 1.6, 2.5);
    ASSERT_NEAR(boost, 25.0, 0.5);
}

int main(void) {
    printf("====================================================\n");
    printf("Systole C Fastpath Numerical Equivalence Test Runner\n");
    printf("====================================================\n");

    test_biquad_filtering();
    test_pan_tompkins_qrs_detection();
    test_hemodynamics_math();
    test_pharmacokinetics();

    printf("\nTests run:    %d\n", g_tests_run);
    printf("Tests passed: %d\n", g_tests_passed);

    if (g_tests_passed == g_tests_run) {
        printf("RESULT: ALL C VERIFICATION TESTS PASSED\n");
        return 0;
    } else {
        printf("RESULT: FAILURES DETECTED (%d/%d passed)\n", g_tests_passed, g_tests_run);
        return 1;
    }
}
