import { BENEFIT_PERCENTAGES } from './constants';

export const calculateAccruals = (
    baseHourlyRate: number,
    transportHourlyRate: number,
    hours: number
) => {
    const salaryBase = (baseHourlyRate + transportHourlyRate) * hours;

    const prima = salaryBase * BENEFIT_PERCENTAGES.PRIMA;
    const cesantias = salaryBase * BENEFIT_PERCENTAGES.CESANTIAS;
    const intereses = cesantias * BENEFIT_PERCENTAGES.INTERESES_CESANTIAS;

    // Vacations: Transport is excluded.
    const vacations = (baseHourlyRate * hours) * BENEFIT_PERCENTAGES.VACATIONS;

    return {
        prima,
        cesantias,
        intereses,
        vacations,
        totalAccruals: prima + cesantias + intereses + vacations,
    };
};
