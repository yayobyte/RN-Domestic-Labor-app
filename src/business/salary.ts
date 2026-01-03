import {
    SMMLV_2026,
    MONTHLY_HOURS_H1,
    MONTHLY_HOURS_H2,
    TRANSPORT_DAILY,
    NIGHT_SURCHARGE_PERCENTAGE,
} from './constants';

export const isFirstSemester = (date: Date): boolean => {
    const month = date.getMonth(); // 0-11
    const day = date.getDate();
    // Jan 1 to July 14 is H1
    if (month < 6) return true; // Jan-Jun
    if (month === 6 && day <= 14) return true; // July 1-14
    return false;
};

export const getRates = (date: Date, customSMMLV?: number) => {
    const smmlv = customSMMLV || SMMLV_2026;

    if (isFirstSemester(date)) {
        return {
            hourlyRate: smmlv / MONTHLY_HOURS_H1,
        };
    }
    return {
        hourlyRate: smmlv / MONTHLY_HOURS_H2,
    };
};

export const calculateDirectPay = (
    hours: number,
    isNight: boolean,
    date: Date,
    customSMMLV?: number
) => {
    const { hourlyRate } = getRates(date, customSMMLV);

    // Apply surcharge to base rate if night
    const activeHourlyRate = isNight
        ? hourlyRate * (1 + NIGHT_SURCHARGE_PERCENTAGE)
        : hourlyRate;

    // Direct Pay = (Hours * AdjustedRate) + Full Day Transport
    const salaryPart = hours * activeHourlyRate;
    const transportPart = TRANSPORT_DAILY;
    const totalPay = salaryPart + transportPart;

    return {
        baseRate: hourlyRate,
        activeHourlyRate,
        transportDaily: TRANSPORT_DAILY,
        salaryPart,
        transportPart,
        totalPay,
    };
};
