export const SMMLV_2026 = 1750905;
// export const SMMLV_2026 = 1423500;
export const TRANSPORT_ALLOWANCE_2026 = 249095;

export const MONTHLY_HOURS_H1 = 220; // Jan 1 - Jul 14
export const MONTHLY_HOURS_H2 = 210; // Jul 15 - Dec 31

export const HOURLY_RATE_H1 = SMMLV_2026 / MONTHLY_HOURS_H1;
export const HOURLY_RATE_H2 = SMMLV_2026 / MONTHLY_HOURS_H2;

export const TRANSPORT_HOURLY_H1 = 1132;
export const TRANSPORT_HOURLY_H2 = 1186;

export const NIGHT_SURCHARGE_PERCENTAGE = 0.35;

export const BENEFIT_PERCENTAGES = {
    PRIMA: 0.0833, // 8.33%
    CESANTIAS: 0.0833, // 8.33%
    INTERESES_CESANTIAS: 0.12, // 12% of accumulated Cesantías (yearly)
    VACATIONS: 0.0417, // 4.17%
    PENSION_EMPLOYER: 0.12, // 12%
    PENSION_WORKER: 0.04, // 4%
    HEALTH_EMPLOYER: 0.085, // 8.5%
    HEALTH_WORKER: 0.04, // 4%
    CAJA_EMPLOYER: 0.04, // 4%
    ARL_LEVEL_1_PERCENTAGE: 0.00522, // 0.522% of SMMLV
};
