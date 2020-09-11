#ifndef SYSTOLE_DSP_H
#define SYSTOLE_DSP_H

#include <stddef.h>
#include <stdbool.h>

#ifdef __cplusplus
extern "C" {
#endif

/*
 * Second-order Direct Form II Transposed Biquad Section.
 * Difference equations:
 *   y[n] = b0 * x[n] + w1[n-1]
 *   w1[n] = b1 * x[n] - a1 * y[n] + w2[n-1]
 *   w2[n] = b2 * x[n] - a2 * y[n]
 */
typedef struct {
    double b0, b1, b2;
    double a1, a2;
} systole_biquad_coeffs_t;

typedef struct {
    double w1;
    double w2;
} systole_biquad_state_t;

/*
 * Pan-Tompkins real-time QRS detector state.
 */
#define SYSTOLE_DIFF_BUF_SIZE 5
#define SYSTOLE_INT_BUF_SIZE 30
#define SYSTOLE_CAND_BUF_SIZE 3

typedef struct {
    double sample_rate_hz;
    int window_size;
    int refractory_samples;
    systole_biquad_coeffs_t bandpass;
    systole_biquad_state_t bp_state;
    double diff_buf[SYSTOLE_DIFF_BUF_SIZE];
    int diff_count;
    double int_buf[SYSTOLE_INT_BUF_SIZE];
    int int_count;
    double running_sum;
    double cand_buf[SYSTOLE_CAND_BUF_SIZE];
    int cand_count;
    double spki;
    double npki;
    double threshold_i1;
    double threshold_i2;
    int last_r_peak_idx;
    int sample_idx;
} systole_pan_tompkins_t;

/*
 * Three-compartment pharmacokinetic state.
 */
typedef struct {
    double v1_liters;
    double v2_liters;
    double v3_liters;
    double k10;
    double k12;
    double k21;
    double k13;
    double k31;
    double ke0;
    double mass_central;
    double mass_fast;
    double mass_slow;
    double effect_site_conc;
} systole_pk_state_t;

/* Filter APIs */
void systole_biquad_init(systole_biquad_state_t *st);
double systole_biquad_step(const systole_biquad_coeffs_t *c, double x, systole_biquad_state_t *st);
systole_biquad_coeffs_t systole_butterworth_bandpass(double fs, double f0, double q);

/* Pan-Tompkins Detector APIs */
void systole_pt_init(systole_pan_tompkins_t *pt, double fs);
bool systole_pt_process(systole_pan_tompkins_t *pt, double raw_sample, double *out_peak_val);

/* Hemodynamic & Pulse Contour APIs */
double systole_estimate_stroke_volume(double sbp, double dbp, double systolic_area);
double systole_calculate_bsa_dubois(double weight_kg, double height_cm);
double systole_calculate_svr(double map, double cvp, double co);

/* Pharmacokinetics APIs */
void systole_pk_init(systole_pk_state_t *pk, double v1, double v2, double v3, double k10, double k12, double k21, double k13, double k31, double ke0);
void systole_pk_step(systole_pk_state_t *pk, double infusion_rate_mcg_min, double dt_minutes, double *out_cp, double *out_ce);
double systole_sigmoid_emax(double e0, double emax, double ec50, double gamma, double ce);

#ifdef __cplusplus
}
#endif

#endif /* SYSTOLE_DSP_H */
