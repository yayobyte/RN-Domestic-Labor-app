import React from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { Calendar, DateData } from 'react-native-calendars';
import { COLORS, RADIUS, SHADOWS, SPACING } from '../theme/theme';
import { Typography } from '../ui/Typography';
import { SelectedDays } from '../business/calculatorAdapter';
import { Ionicons } from '@expo/vector-icons';

interface WorkCalendarProps {
    selectedDays: SelectedDays;
    onDayPress: (date: DateData) => void;
}

export const WorkCalendar: React.FC<WorkCalendarProps> = ({ selectedDays, onDayPress }) => {
    const today = new Date().toISOString().split('T')[0];

    return (
        <View style={styles.container}>
            <Typography variant="h3" weight="bold" color={COLORS.text} style={styles.title}>
                Select Worked Days
            </Typography>
            <View style={styles.calendarContainer}>
                <Calendar
                    onDayPress={onDayPress}
                    dayComponent={({ date, state }: any) => {
                        if (!date) return null;
                        const dateString = date.dateString;
                        const isSelected = !!selectedDays[dateString];
                        const dayData = selectedDays[dateString];
                        const isToday = dateString === today;
                        const isDisabled = state === 'disabled';

                        return (
                            <TouchableOpacity
                                onPress={() => onDayPress(date)}
                                style={[
                                    styles.dayBox,
                                    isSelected && styles.daySelected,
                                    isToday && !isSelected && styles.dayToday,
                                ]}
                            >
                                <Typography
                                    variant="body"
                                    weight={isSelected ? "bold" : "regular"}
                                    color={isSelected ? "#FFF" : isToday ? COLORS.primary : isDisabled ? COLORS.textSecondary : COLORS.text}
                                    style={{ fontSize: 16 }}
                                >
                                    {date.day}
                                </Typography>
                                {isSelected && (
                                    <View style={styles.dayBadge}>
                                        <Typography variant="caption" color="#FFF" style={{ fontSize: 9 }}>
                                            {dayData.hours}h
                                        </Typography>
                                        {dayData.isNight && (
                                            <Ionicons name="moon" size={8} color="#FFF" style={{ marginLeft: 2 }} />
                                        )}
                                    </View>
                                )}
                            </TouchableOpacity>
                        );
                    }}
                    theme={{
                        backgroundColor: COLORS.surface,
                        calendarBackground: COLORS.surface,
                        textSectionTitleColor: COLORS.textSecondary,
                        textDayFontFamily: 'Inter_400Regular',
                        textMonthFontFamily: 'Inter_600SemiBold',
                        textDayHeaderFontFamily: 'Inter_500Medium',
                        textDayFontSize: SPACING.l,
                        textMonthFontSize: SPACING.l,
                        textDayHeaderFontSize: SPACING.m,
                        arrowColor: COLORS.primary,
                        monthTextColor: COLORS.text,
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
    dayBox: {
        width: SPACING.xxl + SPACING.s,
        height: SPACING.xxl + SPACING.s,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: RADIUS.m,
    },
    daySelected: {
        backgroundColor: COLORS.primary,
    },
    dayToday: {
        borderWidth: 1,
        borderColor: COLORS.primary,
    },
    dayBadge: {
        bottom: SPACING.xs,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: SPACING.xs,
        borderRadius: SPACING.xs,
        backgroundColor: 'rgba(0,0,0,0.1)',
    }
});
