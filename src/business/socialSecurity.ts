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

export const calculatePila = (daysWorked: number, includeHealth: boolean = true) => {
    const weeks = calculateContributionWeeks(daysWorked);

    // IBC for Weeks = (SMMLV / 4) * weeks
    // But strictly, IBC is calculated by weeks.
    // 1 week IBC = SMMLV / 4. 4 weeks IBC = SMMLV.
    const weeklyIBC = SMMLV_2026 / 4;
    const totalIBC = weeklyIBC * weeks;

    // TOTAL contributions (employer pays all, then deducts worker portion from salary)
    // Pension: 16% total (12% employer + 4% worker)
    const pension = totalIBC * 0.16;

    // Health: 12.5% total (8.5% employer + 4% worker) - optional if worker has SISBEN
    const health = includeHealth ? totalIBC * 0.125 : 0;

    // Caja: 4% (employer only)
    const caja = totalIBC * BENEFIT_PERCENTAGES.CAJA_EMPLOYER;

    // ARL is on full SMMLV (employer only)
    const arl = SMMLV_2026 * BENEFIT_PERCENTAGES.ARL_LEVEL_1_PERCENTAGE;

    return {
        weeks,
        totalIBC,
        pension,
        health,
        caja,
        arl,
        total: pension + health + caja + arl,
    };
};

/**
 * Calculate worker's PILA contribution (deducted from salary)
 * Worker contributes 8% of base salary (4% health + 4% pension)
 * Note: Transport allowance is NOT included in the base for this calculation
 */
export const calculateWorkerPilaContribution = (baseSalary: number) => {
    const health = baseSalary * 0.04;
    const pension = baseSalary * 0.04;

    return {
        health,
        pension,
        total: health + pension,
    };
};
