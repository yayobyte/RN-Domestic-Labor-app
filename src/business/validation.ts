import { SMMLV_2026 } from './constants';

export const MIN_HOURS_PER_DAY = 1;
export const MAX_HOURS_PER_DAY = 24;
export const DEFAULT_HOURS_PER_DAY = 8;

/**
 * Business rule: Minimum salary validation
 */
export const isValidSalary = (salary: number): boolean => {
    return salary >= SMMLV_2026;
};

/**
 * Business rule: Constraints for hours per day
 */
export const clampHours = (hours: number): number => {
    return Math.min(MAX_HOURS_PER_DAY, Math.max(MIN_HOURS_PER_DAY, hours || DEFAULT_HOURS_PER_DAY));
};
