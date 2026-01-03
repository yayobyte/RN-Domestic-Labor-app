import { calculateDirectPay } from './salary';
import { calculateAccruals } from './benefits';
import { calculatePila, calculateWorkerPilaContribution } from './socialSecurity';
import type { Settings } from '../context/SettingsContext';

export interface DayData {
    hours: number;
    isNight: boolean;
}

export type SelectedDays = Record<string, DayData>;

export const calculateMonthTotals = (selectedDays: SelectedDays) => {
    let totalDirectPay = 0;
    let totalAccruals = 0;

    // For Breakdown (Aggregation)
    let totalBasePay = 0; // Salary part
    let totalTransport = 0;
    let totalSurcharge = 0;
    let totalHours = 0;

    const days = Object.keys(selectedDays);
    const dayCount = days.length;

    days.forEach(dateStr => {
        // Create date object at noon to avoid timezone shift issues affecting the day
        const [year, month, day] = dateStr.split('-').map(Number);
        const date = new Date(year, month - 1, day, 12, 0, 0);

        const { hours, isNight } = selectedDays[dateStr];

        // 1. Pay for this specific day (handles H1/H2 rates correctly per date)
        const payResult = calculateDirectPay(hours, isNight, date);

        // Accumulate Pay
        totalDirectPay += payResult.totalPay;
        totalBasePay += (payResult.baseRate * hours);
        totalTransport += (payResult.transportHour * hours);
        if (isNight) {
            totalSurcharge += (payResult.baseRate * 0.35 * hours);
        }
        totalHours += hours;

        // 2. Accruals for this day
        const accrualResult = calculateAccruals(
            payResult.baseRate,
            payResult.transportHour,
            hours
        );
        totalAccruals += accrualResult.totalAccruals;
    });

    // 3. PILA is based on total DAYS worked in the month range
    // We assume the selection is for a relevant period (e.g. month).
    const pilaResult = calculatePila(dayCount);

    return {
        totals: {
            directPay: totalDirectPay,
            accruals: totalAccruals,
            pila: pilaResult.total,
        },
        breakdown: {
            pay: {
                baseSalary: totalBasePay,
                transport: totalTransport,
                surcharge: totalSurcharge,
                totalHours,
                count: dayCount
            },
            // Re-calculate benefits breakdown based on totals to ensure precision (?) 
            // actually summing them up is fine for linear percentages.
            // We can just return the sums if we tracked them, but for now 
            // let's re-calculate "Accruals Breakdown" based on the aggregated pay
            // wait, rates might differ (H1 vs H2), so summing individual accruals is SAFER.
            // But I didn't track individual accrual components in the loop.
            // Let's do it right.
        },
        pila: pilaResult
    };
};

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

        // Worker PILA contribution (8% of base salary only, not transport)
        const workerContribution = calculateWorkerPilaContribution(baseSalaryForDay);
        totalWorkerPilaDeduction += workerContribution.total;

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

    const pilaResult = calculatePila(dayCount, settings.includeHealth);
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
