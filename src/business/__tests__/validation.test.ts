import { isValidSalary, clampHours, MIN_HOURS_PER_DAY, MAX_HOURS_PER_DAY, DEFAULT_HOURS_PER_DAY } from '../validation';
import { SMMLV_2026 } from '../constants';

describe('Validation Logic', () => {
    describe('isValidSalary', () => {
        it('should return true for salary equal to SMMLV', () => {
            expect(isValidSalary(SMMLV_2026)).toBe(true);
        });

        it('should return true for salary greater than SMMLV', () => {
            expect(isValidSalary(SMMLV_2026 + 1)).toBe(true);
        });

        it('should return false for salary less than SMMLV', () => {
            expect(isValidSalary(SMMLV_2026 - 1)).toBe(false);
        });
    });

    describe('clampHours', () => {
        it('should return the value if within range', () => {
            expect(clampHours(12)).toBe(12);
        });

        it('should return DEFAULT_HOURS_PER_DAY if value is 0 (missing input)', () => {
            expect(clampHours(0)).toBe(DEFAULT_HOURS_PER_DAY);
        });

        it('should return MIN_HOURS_PER_DAY if value is negative', () => {
            expect(clampHours(-5)).toBe(MIN_HOURS_PER_DAY);
        });

        it('should return MAX_HOURS_PER_DAY if value is above maximum', () => {
            expect(clampHours(25)).toBe(MAX_HOURS_PER_DAY);
        });
    });
});
