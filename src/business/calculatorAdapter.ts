import { calculateDirectPay } from './salary';
import { calculateAccruals } from './benefits';
import { calculatePila, calculateWorkerPilaContribution } from './socialSecurity';
import type { Settings } from '../context/SettingsContext';

export interface DayData {
    hours: number;
    isNight: boolean;
}

export type SelectedDays = Record<string, DayData>;

// Re-write to return detailed breakdown by accumulating all fields.
export const calculateDetailedMonthTotals = (selectedDays: SelectedDays, settings: Settings) => {
    let totalGrossPay = 0;

    let totalBaseSalary = 0;
    let totalTransport = 0;
    let totalSurcharge = 0;
    let totalHours = 0;
    let totalWorkerPilaDeduction = 0;

    let totalPrima = 0;
    let totalCesantias = 0;
    let totalIntereses = 0;
    let totalVacations = 0;
    let totalAccruals = 0;

    const days = Object.keys(selectedDays);
    const dayCount = days.length;

    days.forEach(dateStr => {
        const [year, month, day] = dateStr.split('-').map(Number);
        const date = new Date(year, month - 1, day, 12, 0, 0);
        const { hours, isNight } = selectedDays[dateStr];

        // Pay (with custom SMMLV)
        const payResult = calculateDirectPay(hours, isNight, date, settings.minimumSalary);
        const baseSalaryForDay = payResult.baseRate * hours;

        totalGrossPay += payResult.totalPay;
        totalBaseSalary += baseSalaryForDay;
        totalTransport += (payResult.transportHour * hours);
        if (isNight) {
            totalSurcharge += (payResult.baseRate * 0.35 * hours);
        }
        totalHours += hours;

        // Accruals
        const accrualResult = calculateAccruals(
            payResult.baseRate,
            payResult.transportHour,
            hours
        );

        totalPrima += accrualResult.prima;
        totalCesantias += accrualResult.cesantias;
        totalIntereses += accrualResult.intereses;
        totalVacations += accrualResult.vacations;
        totalAccruals += accrualResult.totalAccruals;
    });

    const pilaResult = calculatePila(dayCount, settings.includeHealth, settings.minimumSalary);

    // Worker PILA is taken from the discrete weeks/IBC calculation
    totalWorkerPilaDeduction = pilaResult.workerPortion;
    const netPay = totalGrossPay - totalWorkerPilaDeduction;

    return {
        pay: {
            baseRate: 0, // Not relevant for aggregate
            transportHour: 0, // Not relevant
            totalHourlyPay: 0, // Not relevant
            hours: totalHours,
            isNight: false, // Mixed
            grossPay: totalGrossPay,
            netPay: netPay,
            workerPilaDeduction: totalWorkerPilaDeduction,
            // Custom breakdown fields
            baseSalary: totalBaseSalary,
            transport: totalTransport,
            surcharge: totalSurcharge,
            effectiveHourlyRate: totalHours > 0 ? totalBaseSalary / totalHours : 0,
            daysWorked: dayCount
        },
        accruals: {
            prima: totalPrima,
            cesantias: totalCesantias,
            intereses: totalIntereses,
            vacations: totalVacations,
            totalAccruals: totalAccruals,
        },
        pila: pilaResult
    };
};
