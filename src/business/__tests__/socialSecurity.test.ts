import { calculateContributionWeeks, calculatePila, calculateWorkerPilaContribution } from '../socialSecurity';
import { SMMLV_2026, BENEFIT_PERCENTAGES } from '../constants';

describe('Social Security Logic (PILA)', () => {
    describe('calculateContributionWeeks', () => {
        it('should return 0 for 0 days', () => expect(calculateContributionWeeks(0)).toBe(0));
        it('should return 1 for 1-7 days', () => {
            expect(calculateContributionWeeks(1)).toBe(1);
            expect(calculateContributionWeeks(7)).toBe(1);
        });
        it('should return 2 for 8-14 days', () => {
            expect(calculateContributionWeeks(8)).toBe(2);
            expect(calculateContributionWeeks(14)).toBe(2);
        });
        it('should return 3 for 15-21 days', () => {
            expect(calculateContributionWeeks(15)).toBe(3);
            expect(calculateContributionWeeks(21)).toBe(3);
        });
        it('should return 4 for 22+ days', () => {
            expect(calculateContributionWeeks(22)).toBe(4);
            expect(calculateContributionWeeks(30)).toBe(4);
        });
    });

    describe('calculatePila', () => {
        it('should calculate correctly for 1 day (1 week) including health', () => {
            const results = calculatePila(1, true);
            const expectedIBC = SMMLV_2026 / 4;
            expect(results.weeks).toBe(1);
            expect(results.totalIBC).toBe(expectedIBC);
            expect(results.health).toBe(expectedIBC * 0.125);
            expect(results.pension).toBe(expectedIBC * 0.16);
            expect(results.arl).toBe(SMMLV_2026 * BENEFIT_PERCENTAGES.ARL_LEVEL_1_PERCENTAGE);
        });

        it('should calculate correctly for 1 day excluding health', () => {
            const results = calculatePila(1, false);
            const expectedIBC = SMMLV_2026 / 4;
            expect(results.health).toBe(0);
            expect(results.workerPortion).toBe(expectedIBC * 0.04); // Only pension
        });

        it('should return all zeros if 0 days worked', () => {
            const results = calculatePila(0);
            expect(results.total).toBe(0);
            expect(results.arl).toBe(0);
        });

        it('should use custom SMMLV if provided', () => {
            const customSMMLV = 2000000;
            const results = calculatePila(1, true, customSMMLV);
            expect(results.totalIBC).toBe(customSMMLV / 4);
        });
    });

    describe('calculateWorkerPilaContribution', () => {
        it('should calculate 8% total by default (4% health + 4% pension)', () => {
            const ibc = 1000000;
            const results = calculateWorkerPilaContribution(ibc, true);
            expect(results.health).toBe(ibc * 0.04);
            expect(results.pension).toBe(ibc * 0.04);
            expect(results.total).toBe(ibc * 0.08);
        });

        it('should calculate 4% total if health is excluded', () => {
            const ibc = 1000000;
            const results = calculateWorkerPilaContribution(ibc, false);
            expect(results.health).toBe(0);
            expect(results.pension).toBe(ibc * 0.04);
            expect(results.total).toBe(ibc * 0.04);
        });
    });
});
