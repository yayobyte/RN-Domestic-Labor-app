import {
    SMMLV_2026,
    BENEFIT_PERCENTAGES,
} from './constants';

export const calculateContributionWeeks = (daysWorked: number): number => {
    if (daysWorked < 1) return 0;
    if (daysWorked <= 7) return 1;
    if (daysWorked <= 14) return 2;
    if (daysWorked <= 21) return 3;
    return 4;
};

export const calculatePila = (daysWorked: number, includeHealth: boolean = true, smmlv: number = SMMLV_2026) => {
    const weeks = calculateContributionWeeks(daysWorked);

    // IBC for Weeks = (SMMLV / 4) * weeks
    const weeklyIBC = smmlv / 4;
    const totalIBC = weeklyIBC * weeks;

    // ARL is on full SMMLV (employer only)
    const arl = weeks > 0 ? smmlv * BENEFIT_PERCENTAGES.ARL_LEVEL_1_PERCENTAGE : 0;

    // Caja is 4% (employer only)
    const caja = totalIBC * BENEFIT_PERCENTAGES.CAJA_EMPLOYER;

    // Pension: 16% total (12% employer + 4% worker)
    const pensionEmployer = totalIBC * BENEFIT_PERCENTAGES.PENSION_EMPLOYER;
    const pensionWorker = totalIBC * BENEFIT_PERCENTAGES.PENSION_WORKER;

    // Health: 12.5% total (8.5% employer + 4% worker)
    const healthEmployer = includeHealth ? totalIBC * BENEFIT_PERCENTAGES.HEALTH_EMPLOYER : 0;
    const healthWorker = includeHealth ? totalIBC * BENEFIT_PERCENTAGES.HEALTH_WORKER : 0;

    const totalEmployer = arl + caja + pensionEmployer + healthEmployer;
    const totalWorker = pensionWorker + healthWorker;

    return {
        weeks,
        totalIBC,
        pension: pensionEmployer + pensionWorker,
        health: healthEmployer + healthWorker,
        caja,
        arl,
        employerPortion: totalEmployer,
        workerPortion: totalWorker,
        total: totalEmployer + totalWorker,
    };
};

/**
 * Calculate worker's PILA contribution (deducted from salary)
 * Aligned with the IBC system
 */
export const calculateWorkerPilaContribution = (totalIBC: number, includeHealth: boolean = true) => {
    const pension = totalIBC * BENEFIT_PERCENTAGES.PENSION_WORKER;
    const health = includeHealth ? totalIBC * BENEFIT_PERCENTAGES.HEALTH_WORKER : 0;

    return {
        pension,
        health,
        total: pension + health,
    };
};
