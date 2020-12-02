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

    double a0 = 1.0 + alpha;
    c.b0 = (sin_w0 / 2.0) / a0;
    c.b1 = 0.0;
    c.b2 = (-sin_w0 / 2.0) / a0;
    c.a1 = (-2.0 * cos_w0) / a0;
    c.a2 = (1.0 - alpha) / a0;
    return c;
}

systole_biquad_coeffs_t systole_butterworth_lowpass(double fs, double fc) {
    systole_biquad_coeffs_t c;
    double w0 = 2.0 * M_PI * (fc / fs);
    double cos_w0 = cos(w0);
    double sin_w0 = sin(w0);
    double q = 0.7071067811865475;
    double alpha = sin_w0 / (2.0 * q);

    double a0 = 1.0 + alpha;
    c.b0 = ((1.0 - cos_w0) / 2.0) / a0;
    c.b1 = (1.0 - cos_w0) / a0;
    c.b2 = ((1.0 - cos_w0) / 2.0) / a0;
    c.a1 = (-2.0 * cos_w0) / a0;
    c.a2 = (1.0 - alpha) / a0;
    return c;
}

systole_biquad_coeffs_t systole_butterworth_highpass(double fs, double fc) {
    systole_biquad_coeffs_t c;
    double w0 = 2.0 * M_PI * (fc / fs);
    double cos_w0 = cos(w0);
    double sin_w0 = sin(w0);
    double q = 0.7071067811865475;
    double alpha = sin_w0 / (2.0 * q);

    double a0 = 1.0 + alpha;
    c.b0 = ((1.0 + cos_w0) / 2.0) / a0;
    c.b1 = (-(1.0 + cos_w0)) / a0;
    c.b2 = ((1.0 + cos_w0) / 2.0) / a0;
    c.a1 = (-2.0 * cos_w0) / a0;
    c.a2 = (1.0 - alpha) / a0;
    return c;
}

void systole_cascade_init(systole_cascade_t *casc, int num_stages, const systole_biquad_coeffs_t *stages) {
    if (!casc) return;
    casc->num_stages = (num_stages > SYSTOLE_MAX_CASCADE_STAGES) ? SYSTOLE_MAX_CASCADE_STAGES : num_stages;
    for (int i = 0; i < casc->num_stages; ++i) {
        casc->coeffs[i] = stages[i];
        systole_biquad_init(&casc->states[i]);
    }
}

double systole_cascade_step(systole_cascade_t *casc, double x) {
    if (!casc) return x;
    double current = x;
    for (int i = 0; i < casc->num_stages; ++i) {
        current = systole_biquad_step(&casc->coeffs[i], current, &casc->states[i]);
    }
    return current;
}

void systole_dwt_haar_step(const double *in, int len, double *approx_out, double *detail_out) {
    if (!in || !approx_out || !detail_out || len < 2) return;
    double inv_sqrt2 = 1.0 / sqrt(2.0);
    int half = len / 2;
    for (int i = 0; i < half; ++i) {
        double s0 = in[2 * i];
        double s1 = in[2 * i + 1];
        approx_out[i] = (s0 + s1) * inv_sqrt2;
        detail_out[i] = (s0 - s1) * inv_sqrt2;
    }
}

void systole_pt_init(systole_pan_tompkins_t *pt, double fs) {
    memset(pt, 0, sizeof(systole_pan_tompkins_t));
    pt->sample_rate_hz = fs;
    pt->window_size = (int)(0.150 * fs + 0.5);
    if (pt->window_size > SYSTOLE_INT_BUF_SIZE) pt->window_size = SYSTOLE_INT_BUF_SIZE;
    pt->refractory_samples = (int)(0.200 * fs + 0.5);
    pt->bandpass = systole_butterworth_bandpass(fs, 10.0, 1.0);
    systole_biquad_init(&pt->bp_state);
    pt->spki = 0.02;
    pt->npki = 0.001;
    pt->threshold_i1 = 0.005;
    pt->threshold_i2 = 0.0025;
    pt->last_r_peak_idx = -1000;
}

bool systole_pt_process(systole_pan_tompkins_t *pt, double raw_sample, double *out_peak_val) {
    double filtered = systole_biquad_step(&pt->bandpass, raw_sample, &pt->bp_state);

    double x_nm4 = pt->diff_buf[4];
    double x_nm3 = pt->diff_buf[3];
    double x_nm1 = pt->diff_buf[1];
    double derivative = (2.0 * filtered + x_nm1 - x_nm3 - 2.0 * x_nm4) / 8.0;

    for (int i = 4; i > 0; --i) {
        pt->diff_buf[i] = pt->diff_buf[i - 1];
    }
    pt->diff_buf[0] = filtered;

    double squared = derivative * derivative;

    double old_int = pt->int_buf[pt->window_size - 1];
    pt->running_sum = pt->running_sum + squared - old_int;
    if (pt->running_sum < 0.0) pt->running_sum = 0.0;

    for (int i = pt->window_size - 1; i > 0; --i) {
        pt->int_buf[i] = pt->int_buf[i - 1];
    }
    pt->int_buf[0] = squared;

    double integrated = pt->running_sum / pt->window_size;

    double prev = pt->cand_buf[1];
    double mid = pt->cand_buf[0];
    pt->cand_buf[2] = pt->cand_buf[1];
    pt->cand_buf[1] = pt->cand_buf[0];
    pt->cand_buf[0] = integrated;

    pt->sample_idx++;
    bool is_local_max = (mid > prev) && (mid >= integrated);
    bool refractory_passed = (pt->sample_idx - pt->last_r_peak_idx) > pt->refractory_samples;

    if (is_local_max && refractory_passed && (mid > pt->threshold_i1)) {
        pt->spki = 0.125 * mid + 0.875 * pt->spki;
        pt->threshold_i1 = pt->npki + 0.25 * (pt->spki - pt->npki);
        pt->threshold_i2 = 0.5 * pt->threshold_i1;
        pt->last_r_peak_idx = pt->sample_idx;
        if (out_peak_val) *out_peak_val = mid;
        return true;
    } else if (is_local_max) {
        pt->npki = 0.125 * mid + 0.875 * pt->npki;
        pt->threshold_i1 = pt->npki + 0.25 * (pt->spki - pt->npki);
        pt->threshold_i2 = 0.5 * pt->threshold_i1;
    }

    return false;
}

double systole_estimate_stroke_volume(double sbp, double dbp, double systolic_area) {
    double pp = sbp - dbp;
    if (pp < 5.0) pp = 5.0;
    double sv = (systolic_area / (sbp + dbp)) * (1.0 + (pp / sbp));
    return sv;
}

double systole_calculate_bsa_dubois(double weight_kg, double height_cm) {
    return 0.007184 * pow(weight_kg, 0.425) * pow(height_cm, 0.725);
}

double systole_calculate_svr(double map, double cvp, double co) {
    if (co < 0.1) return 0.0;
    return 80.0 * (map - cvp) / co;
}

double systole_pv_espvr(double ees, double v0, double volume) {
    double p = ees * (volume - v0);
    return (p > 0.0) ? p : 0.0;
}

double systole_pv_edpvr(double beta, double alpha, double volume) {
    double exp_val = alpha * volume;
    if (exp_val > 10.0) exp_val = 10.0;
    if (exp_val < -10.0) exp_val = -10.0;
    double p = beta * (exp(exp_val) - 1.0);
    return (p > 0.0) ? p : 0.0;
}

double systole_pv_arterial_elastance(double esp, double sv) {
    if (sv < 0.1) return 0.0;
    return esp / sv;
}

double systole_pv_vac(double ea, double ees) {
    if (ees < 0.001) return 0.0;
    return ea / ees;
}

double systole_vent_airway_pressure(double peep, double flow_lps, double raw, double vol_ml, double cstat) {
    if (cstat < 0.1) cstat = 0.1;
    double elastic = vol_ml / cstat;
    double resistive = (flow_lps > 0.0 ? flow_lps : 0.0) * raw;
    return peep + elastic + resistive;
}

void systole_pk_init(systole_pk_state_t *pk, double v1, double v2, double v3, double k10, double k12, double k21, double k13, double k31, double ke0) {
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
    int sub_steps = 10;
    double h = dt_minutes / sub_steps;

    for (int step = 0; step < sub_steps; ++step) {
        double d_m1 = infusion_rate_mcg_min - (pk->k10 + pk->k12 + pk->k13) * pk->mass_central + pk->k21 * pk->mass_fast + pk->k31 * pk->mass_slow;
        double d_m2 = pk->k12 * pk->mass_central - pk->k21 * pk->mass_fast;
        double d_m3 = pk->k13 * pk->mass_central - pk->k31 * pk->mass_slow;

        pk->mass_central += d_m1 * h;
        pk->mass_fast += d_m2 * h;
        pk->mass_slow += d_m3 * h;

        if (pk->mass_central < 0.0) pk->mass_central = 0.0;
        if (pk->mass_fast < 0.0) pk->mass_fast = 0.0;
        if (pk->mass_slow < 0.0) pk->mass_slow = 0.0;

        double cp = pk->mass_central / (pk->v1_liters * 1000.0);
        double d_ce = pk->ke0 * (cp - pk->effect_site_conc);
        pk->effect_site_conc += d_ce * h;
        if (pk->effect_site_conc < 0.0) pk->effect_site_conc = 0.0;
    }

    if (out_cp) *out_cp = pk->mass_central / (pk->v1_liters * 1000.0);
    if (out_ce) *out_ce = pk->effect_site_conc;
}

double systole_sigmoid_emax(double e0, double emax, double ec50, double gamma, double ce) {
    if (ce <= 0.0) return e0;
    double ce_gamma = pow(ce, gamma);
    double ec50_gamma = pow(ec50, gamma);
    return e0 + (emax * ce_gamma) / (ce_gamma + ec50_gamma);
}
