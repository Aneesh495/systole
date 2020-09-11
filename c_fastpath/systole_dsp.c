#include "systole_dsp.h"
#include <math.h>
#include <string.h>

#ifndef M_PI
#define M_PI 3.14159265358979323846
#endif

void systole_biquad_init(systole_biquad_state_t *st) {
    if (st) {
        st->w1 = 0.0;
        st->w2 = 0.0;
    }
}

double systole_biquad_step(const systole_biquad_coeffs_t *c, double x, systole_biquad_state_t *st) {
    double y = c->b0 * x + st->w1;
    st->w1 = c->b1 * x - c->a1 * y + st->w2;
    st->w2 = c->b2 * x - c->a2 * y;
    return y;
}

systole_biquad_coeffs_t systole_butterworth_bandpass(double fs, double f0, double q) {
    systole_biquad_coeffs_t c;
    double w0 = 2.0 * M_PI * (f0 / fs);
    double cos_w0 = cos(w0);
    double sin_w0 = sin(w0);
    double alpha = sin_w0 / (2.0 * q);

    double b0 = alpha;
    double b1 = 0.0;
    double b2 = -alpha;
    double a0 = 1.0 + alpha;
    double a1 = -2.0 * cos_w0;
    double a2 = 1.0 - alpha;

    c.b0 = b0 / a0;
    c.b1 = b1 / a0;
    c.b2 = b2 / a0;
    c.a1 = a1 / a0;
    c.a2 = a2 / a0;
    return c;
}

void systole_pt_init(systole_pan_tompkins_t *pt, double fs) {
    if (!pt) return;
    memset(pt, 0, sizeof(systole_pan_tompkins_t));
    pt->sample_rate_hz = fs;
    pt->window_size = 30;
    pt->refractory_samples = 40;
    pt->bandpass = systole_butterworth_bandpass(fs, 10.0, 1.0);
    systole_biquad_init(&pt->bp_state);
    pt->spki = 0.02;
    pt->npki = 0.001;
    pt->threshold_i1 = 0.005;
    pt->threshold_i2 = 0.0025;
    pt->last_r_peak_idx = -1000;
}

bool systole_pt_process(systole_pan_tompkins_t *pt, double raw_sample, double *out_peak_val) {
    if (!pt) return false;

    /* 1. Bandpass filter */
    double bp = systole_biquad_step(&pt->bandpass, raw_sample, &pt->bp_state);

    /* 2. 5-point derivative */
    for (int i = SYSTOLE_DIFF_BUF_SIZE - 1; i > 0; i--) {
        pt->diff_buf[i] = pt->diff_buf[i - 1];
    }
    pt->diff_buf[0] = bp;
    if (pt->diff_count < SYSTOLE_DIFF_BUF_SIZE) pt->diff_count++;

    double deriv = 0.0;
    if (pt->diff_count == SYSTOLE_DIFF_BUF_SIZE) {
        deriv = (2.0 * pt->diff_buf[0] + pt->diff_buf[1] - pt->diff_buf[3] - 2.0 * pt->diff_buf[4]) / 8.0;
    }

    /* 3. Squaring */
    double sq = deriv * deriv;

    /* 4. Moving window integration */
    double oldest = 0.0;
    if (pt->int_count >= pt->window_size) {
        oldest = pt->int_buf[pt->window_size - 1];
    }
    for (int i = SYSTOLE_INT_BUF_SIZE - 1; i > 0; i--) {
        pt->int_buf[i] = pt->int_buf[i - 1];
    }
    pt->int_buf[0] = sq;
    if (pt->int_count < pt->window_size) pt->int_count++;

    if (pt->int_count >= pt->window_size) {
        pt->running_sum = pt->running_sum - oldest + sq;
        if (pt->running_sum < 0.0) pt->running_sum = 0.0;
    } else {
        pt->running_sum += sq;
    }

    double integrated = pt->running_sum / (double)(pt->int_count > 0 ? pt->int_count : 1);

    /* 5. Local peak detection */
    for (int i = SYSTOLE_CAND_BUF_SIZE - 1; i > 0; i--) {
        pt->cand_buf[i] = pt->cand_buf[i - 1];
    }
    pt->cand_buf[0] = integrated;
    if (pt->cand_count < SYSTOLE_CAND_BUF_SIZE) pt->cand_count++;

    pt->sample_idx++;
    bool is_peak = false;

    if (pt->cand_count == SYSTOLE_CAND_BUF_SIZE) {
        double curr = pt->cand_buf[0];
        double mid = pt->cand_buf[1];
        double prev = pt->cand_buf[2];

        bool is_local_max = (mid > prev && mid > curr);
        int since_last = pt->sample_idx - pt->last_r_peak_idx;
        bool beyond_refractory = (since_last >= pt->refractory_samples);

        if (is_local_max && beyond_refractory && (mid > pt->threshold_i1)) {
            is_peak = true;
            pt->last_r_peak_idx = pt->sample_idx;
            pt->spki = 0.125 * mid + 0.875 * pt->spki;
            pt->threshold_i1 = pt->npki + 0.25 * (pt->spki - pt->npki);
            pt->threshold_i2 = 0.5 * pt->threshold_i1;
            if (out_peak_val) *out_peak_val = mid;
        } else if (is_local_max && beyond_refractory) {
            pt->npki = 0.125 * mid + 0.875 * pt->npki;
            pt->threshold_i1 = pt->npki + 0.25 * (pt->spki - pt->npki);
            pt->threshold_i2 = 0.5 * pt->threshold_i1;
        }
    }

    return is_peak;
}

double systole_estimate_stroke_volume(double sbp, double dbp, double systolic_area) {
    double sum = sbp + dbp;
    if (sum <= 0.0) return 70.0;
    double sv = 1150.0 * (systolic_area / sum);
    if (sv < 20.0) return 20.0;
    if (sv > 160.0) return 160.0;
    return sv;
}

double systole_calculate_bsa_dubois(double weight_kg, double height_cm) {
    if (weight_kg <= 0.0 || height_cm <= 0.0) return 1.85;
    return 0.007184 * pow(weight_kg, 0.425) * pow(height_cm, 0.725);
}

double systole_calculate_svr(double map, double cvp, double co) {
    if (co <= 0.1) co = 0.1;
    return ((map - cvp) / co) * 80.0;
}

void systole_pk_init(systole_pk_state_t *pk, double v1, double v2, double v3, double k10, double k12, double k21, double k13, double k31, double ke0) {
    if (!pk) return;
    memset(pk, 0, sizeof(systole_pk_state_t));
    pk->v1_liters = v1;
    pk->v2_liters = v2;
    pk->v3_liters = v3;
    pk->k10 = k10;
    pk->k12 = k12;
    pk->k21 = k21;
    pk->k13 = k13;
    pk->k31 = k31;
    pk->ke0 = ke0;
}

void systole_pk_step(systole_pk_state_t *pk, double infusion_rate_mcg_min, double dt_minutes, double *out_cp, double *out_ce) {
    if (!pk) return;

    int steps = (int)ceil(dt_minutes / 0.01);
    if (steps < 1) steps = 1;
    double sub_dt = dt_minutes / (double)steps;

    double v1_ml = pk->v1_liters * 1000.0;

    for (int i = 0; i < steps; i++) {
        double c1 = pk->mass_central / (v1_ml > 100.0 ? v1_ml : 100.0);

        double flux_elim = pk->k10 * pk->mass_central;
        double flux_12 = pk->k12 * pk->mass_central;
        double flux_21 = pk->k21 * pk->mass_fast;
        double flux_13 = pk->k13 * pk->mass_central;
        double flux_31 = pk->k31 * pk->mass_slow;

        double d_mass1 = infusion_rate_mcg_min - flux_elim - flux_12 + flux_21 - flux_13 + flux_31;
        double d_mass2 = flux_12 - flux_21;
        double d_mass3 = flux_13 - flux_31;
        double d_ce = pk->ke0 * (c1 - pk->effect_site_conc);

        pk->mass_central += d_mass1 * sub_dt;
        if (pk->mass_central < 0.0) pk->mass_central = 0.0;

        pk->mass_fast += d_mass2 * sub_dt;
        if (pk->mass_fast < 0.0) pk->mass_fast = 0.0;

        pk->mass_slow += d_mass3 * sub_dt;
        if (pk->mass_slow < 0.0) pk->mass_slow = 0.0;

        pk->effect_site_conc += d_ce * sub_dt;
        if (pk->effect_site_conc < 0.0) pk->effect_site_conc = 0.0;
    }

    if (out_cp) *out_cp = pk->mass_central / (v1_ml > 100.0 ? v1_ml : 100.0);
    if (out_ce) *out_ce = pk->effect_site_conc;
}

double systole_sigmoid_emax(double e0, double emax, double ec50, double gamma, double ce) {
    if (ce <= 0.0 || ec50 <= 0.0) return e0;
    double ce_pow = pow(ce, gamma);
    double ec50_pow = pow(ec50, gamma);
    return e0 + (emax * ce_pow) / (ec50_pow + ce_pow);
}
