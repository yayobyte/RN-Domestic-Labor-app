import React, { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import { Calendar, DateData } from 'react-native-calendars';
import { COLORS, RADIUS, SHADOWS, SPACING } from '../theme/theme';
import { Typography } from '../ui/Typography';
import { SelectedDays } from '../business/calculatorAdapter';

interface WorkCalendarProps {
    selectedDays: SelectedDays;
    onDayPress: (date: DateData) => void;
}

export const WorkCalendar: React.FC<WorkCalendarProps> = ({ selectedDays, onDayPress }) => {

    const markedDates = useMemo(() => {
        const marked: any = {};

        Object.keys(selectedDays).forEach(date => {
            marked[date] = {
                selected: true,
                selectedColor: COLORS.primary,
            };
        });

        // Mark today
        const today = new Date().toISOString().split('T')[0];
        if (!marked[today]) {
            marked[today] = { marked: true, dotColor: COLORS.primary };
        }

        return marked;
    }, [selectedDays]);

    return (
        <View style={styles.container}>
            <Typography variant="h3" weight="bold" color={COLORS.text} style={styles.title}>
                Select Worked Days
            </Typography>
            <View style={styles.calendarContainer}>
                <Calendar
                    onDayPress={onDayPress}
                    markedDates={markedDates}
                    theme={{
                        backgroundColor: COLORS.surface,
                        calendarBackground: COLORS.surface,
                        textSectionTitleColor: COLORS.textSecondary,
                        selectedDayBackgroundColor: COLORS.primary,
                        selectedDayTextColor: '#ffffff',
                        todayTextColor: COLORS.primary,
                        dayTextColor: COLORS.text,
                        textDisabledColor: '#d9e1e8',
                        dotColor: COLORS.primary,
                        selectedDotColor: '#ffffff',
                        arrowColor: COLORS.primary,
                        monthTextColor: COLORS.text,
                        indicatorColor: COLORS.primary,
                        textDayFontFamily: 'Inter_400Regular',
                        textMonthFontFamily: 'Inter_600SemiBold',
                        textDayHeaderFontFamily: 'Inter_500Medium',
                        textDayFontSize: 16,
                        textMonthFontSize: 16,
                        textDayHeaderFontSize: 14,
                    }}
                />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: SPACING.l,
    },
    title: {
        marginBottom: SPACING.m,
    },
    calendarContainer: {
        borderRadius: RADIUS.l,
        overflow: 'hidden',
        ...SHADOWS.soft,
    },
});
