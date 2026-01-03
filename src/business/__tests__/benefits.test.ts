import { calculateAccruals } from '../benefits';
import { BENEFIT_PERCENTAGES } from '../constants';

describe('Benefits Logic (Accruals)', () => {
    it('should calculate accruals correctly based on hourly rates and hours', () => {
        const baseRate = 10000;
        const transportRate = 2000;
        const hours = 8;

        const results = calculateAccruals(baseRate, transportRate, hours);
        const expectedSalaryBase = (baseRate + transportRate) * hours;

        expect(results.prima).toBe(expectedSalaryBase * BENEFIT_PERCENTAGES.PRIMA);
        expect(results.cesantias).toBe(expectedSalaryBase * BENEFIT_PERCENTAGES.CESANTIAS);
        expect(results.intereses).toBe(results.cesantias * BENEFIT_PERCENTAGES.INTERESES_CESANTIAS);

        // Vacations exclude transport
        expect(results.vacations).toBe((baseRate * hours) * BENEFIT_PERCENTAGES.VACATIONS);

        expect(results.totalAccruals).toBe(
            results.prima + results.cesantias + results.intereses + results.vacations
        );
    });

    it('should return 0 for 0 hours worked', () => {
        const results = calculateAccruals(10000, 2000, 0);
        expect(results.totalAccruals).toBe(0);
    });
});
