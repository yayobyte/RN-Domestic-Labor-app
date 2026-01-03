import { calculateDetailedMonthTotals, SelectedDays } from '../calculatorAdapter';
import { SMMLV_2026 } from '../constants';

const mockSettings = {
    includeHealth: true,
    minimumSalary: SMMLV_2026,
    defaultHours: 8,
};

describe('Calculator Adapter Logic', () => {
    it('should return zeroed results for empty input', () => {
        const selectedDays: SelectedDays = {};
        const results = calculateDetailedMonthTotals(selectedDays, mockSettings);

        expect(results.pay.grossPay).toBe(0);
        expect(results.pay.netPay).toBe(0);
        expect(results.accruals.totalAccruals).toBe(0);
        expect(results.pila.total).toBe(0);
    });

    it('should correctly aggregate totals for multiple days', () => {
        const selectedDays: SelectedDays = {
            '2026-01-01': { hours: 8, isNight: false },
            '2026-01-02': { hours: 8, isNight: true },
        };

        const results = calculateDetailedMonthTotals(selectedDays, mockSettings);

        expect(results.pay.daysWorked).toBe(2);
        expect(results.pay.hours).toBe(16);
        expect(results.pila.weeks).toBe(1); // 1-7 days = 1 week

        // Net pay should be Gross Pay - Worker PILA Portion
        expect(results.pay.netPay).toBe(results.pay.grossPay - results.pila.workerPortion);

        // Check that surcharge was added for the night shift
        expect(results.pay.surcharge).toBeGreaterThan(0);
    });

    it('should correctly handle custom minimum salary from settings', () => {
        const customSMMLV = 2000000;
        const settings = { ...mockSettings, minimumSalary: customSMMLV };
        const selectedDays: SelectedDays = {
            '2026-01-01': { hours: 8, isNight: false },
        };

        const results = calculateDetailedMonthTotals(selectedDays, settings);

        // IBC for 1 week should be customSMMLV / 4
        expect(results.pila.totalIBC).toBe(customSMMLV / 4);

        // Base salary should be based on custom SMMLV rate (H1: Jan)
        const expectedRate = customSMMLV / 220;
        expect(results.pay.baseSalary).toBeCloseTo(expectedRate * 8, 2);
    });
});
