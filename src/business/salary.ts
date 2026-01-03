import {
    SMMLV_2026,
    MONTHLY_HOURS_H1,
    MONTHLY_HOURS_H2,
    TRANSPORT_HOURLY_H1,
    TRANSPORT_HOURLY_H2,
    NIGHT_SURCHARGE_PERCENTAGE,
} from './constants';

export const isFirstSemester = (date: Date): boolean => {
    const month = date.getMonth(); // 0-11
    const day = date.getDate();
    // Jan 1 to July 14 is H1
    // July is month 6.
    if (month < 6) return true; // Jan-Jun
    if (month === 6 && day <= 14) return true; // July 1-14
    return false;
};

export const getRates = (date: Date, customSMMLV?: number) => {
    const smmlv = customSMMLV || SMMLV_2026;

    if (isFirstSemester(date)) {
        return {
            hourlyRate: smmlv / MONTHLY_HOURS_H1,
            transportHour: TRANSPORT_HOURLY_H1,
        };
    }
    return {
        hourlyRate: smmlv / MONTHLY_HOURS_H2,
        transportHour: TRANSPORT_HOURLY_H2,
    };
};

export const calculateDirectPay = (
    hours: number,
    isNight: boolean,
    date: Date,
    customSMMLV?: number
) => {
    const { hourlyRate, transportHour } = getRates(date, customSMMLV);

    // Apply surcharge to base rate if night
    const activeHourlyRate = isNight
        ? hourlyRate * (1 + NIGHT_SURCHARGE_PERCENTAGE)
        : hourlyRate;

    // Direct Pay = Hours * (AdjustedRate + Transport)
    const totalHourlyPay = activeHourlyRate + transportHour;
    const totalPay = hours * totalHourlyPay;

    return {
        baseRate: hourlyRate,
        activeHourlyRate,
        transportHour,
        totalHourlyPay,
        totalPay,
    };
};
