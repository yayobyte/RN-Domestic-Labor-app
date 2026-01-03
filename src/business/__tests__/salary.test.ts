import { isFirstSemester, getRates, calculateDirectPay } from '../salary';
import { SMMLV_2026, MONTHLY_HOURS_H1, MONTHLY_HOURS_H2, TRANSPORT_DAILY } from '../constants';

describe('Salary Logic', () => {
    describe('isFirstSemester', () => {
        it('should return true for dates before July 14', () => {
            expect(isFirstSemester(new Date(2026, 0, 1))).toBe(true); // Jan 1
            expect(isFirstSemester(new Date(2026, 6, 14))).toBe(true); // July 14
        });

        it('should return false for dates starting July 15', () => {
            expect(isFirstSemester(new Date(2026, 6, 15))).toBe(false); // July 15
            expect(isFirstSemester(new Date(2026, 11, 31))).toBe(false); // Dec 31
        });
    });

    describe('getRates', () => {
        it('should use H1 rates for January', () => {
            const rates = getRates(new Date(2026, 0, 1));
            expect(rates.hourlyRate).toBe(SMMLV_2026 / MONTHLY_HOURS_H1);
        });

        it('should use H2 rates for August', () => {
            const rates = getRates(new Date(2026, 7, 1));
            expect(rates.hourlyRate).toBe(SMMLV_2026 / MONTHLY_HOURS_H2);
        });

        it('should respect custom SMMLV', () => {
            const customSMMLV = 2000000;
            const rates = getRates(new Date(2026, 0, 1), customSMMLV);
            expect(rates.hourlyRate).toBe(customSMMLV / MONTHLY_HOURS_H1);
        });
    });

    describe('calculateDirectPay', () => {
        it('should calculate base pay without surcharge correctly', () => {
            const result = calculateDirectPay(8, false, new Date(2026, 0, 1));
            const expectedHourly = SMMLV_2026 / MONTHLY_HOURS_H1;
            expect(result.baseRate).toBe(expectedHourly);
            expect(result.totalPay).toBe((8 * expectedHourly) + TRANSPORT_DAILY);
        });

        it('should apply 35% surcharge for night shift', () => {
            const result = calculateDirectPay(8, true, new Date(2026, 0, 1));
            const expectedHourly = SMMLV_2026 / MONTHLY_HOURS_H1;
            const expectedWithSurcharge = expectedHourly * 1.35;
            expect(result.activeHourlyRate).toBeCloseTo(expectedWithSurcharge, 2);
            expect(result.totalPay).toBeCloseTo((8 * expectedWithSurcharge) + TRANSPORT_DAILY, 2);
        });

        it('should calculate correctly with custom SMMLV', () => {
            const customSMMLV = 2000000;
            const result = calculateDirectPay(8, false, new Date(2026, 0, 1), customSMMLV);
            const expectedHourly = customSMMLV / MONTHLY_HOURS_H1;
            expect(result.baseRate).toBe(expectedHourly);
        });
    });
});
