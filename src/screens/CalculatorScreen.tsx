import React, { useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet, KeyboardAvoidingView, Platform, TouchableOpacity } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { SummaryCard } from '../components/SummaryCard';
import { BreakdownModal } from '../components/BreakdownModal';
import { SettingsScreen } from './SettingsScreen';
import { WorkCalendar } from '../components/WorkCalendar';
import { DayConfigModal } from '../components/DayConfigModal';
import { Typography } from '../ui/Typography';
import { COLORS, SPACING } from '../theme/theme';
import { calculateDetailedMonthTotals, SelectedDays } from '../business/calculatorAdapter';
import { useSettings } from '../context/SettingsContext';
import { DateData } from 'react-native-calendars';
import { Ionicons } from '@expo/vector-icons';

export const CalculatorScreen = () => {
    const { settings } = useSettings();
    const insets = useSafeAreaInsets();

    // State
    const [selectedDays, setSelectedDays] = useState<SelectedDays>({});
    const [isBreakdownVisible, setIsBreakdownVisible] = useState(false);
    const [isSettingsVisible, setIsSettingsVisible] = useState(false);

    // Modal State
    const [configModalVisible, setConfigModalVisible] = useState(false);
    const [editingDate, setEditingDate] = useState<string | null>(null);

    const [results, setResults] = useState<ReturnType<typeof calculateDetailedMonthTotals>>({
        pay: {
            baseRate: 0, transportHour: 0, totalHourlyPay: 0, hours: 0, isNight: false,
            grossPay: 0, netPay: 0, workerPilaDeduction: 0,
            baseSalary: 0, transport: 0, surcharge: 0, effectiveHourlyRate: 0, daysWorked: 0
        },
        accruals: { prima: 0, cesantias: 0, intereses: 0, vacations: 0, totalAccruals: 0 },
        pila: { weeks: 0, totalIBC: 0, pension: 0, caja: 0, arl: 0, health: 0, employerPortion: 0, workerPortion: 0, total: 0 },
    });

    useEffect(() => {
        const newResults = calculateDetailedMonthTotals(selectedDays, settings);
        setResults(newResults);
    }, [selectedDays, settings]);

    const handleDayPress = (day: DateData) => {
        const dateStr = day.dateString;
        if (selectedDays[dateStr]) {
            // Edit existing
            setEditingDate(dateStr);
            setConfigModalVisible(true);
        } else {
            // select new with default hours from settings
            setSelectedDays(prev => ({
                ...prev,
                [dateStr]: { hours: settings.defaultHours, isNight: false }
            }));
            // Optional: Immediately open modal to fine tune? 
            // For now, let's just select it. User can tap again to edit.
        }
    };

    const handleSaveDay = (hours: number, isNight: boolean) => {
        if (editingDate) {
            setSelectedDays(prev => ({
                ...prev,
                [editingDate]: { hours, isNight }
            }));
            setConfigModalVisible(false);
            setEditingDate(null);
        }
    };

    const handleDeleteDay = () => {
        if (editingDate) {
            const newDays = { ...selectedDays };
            delete newDays[editingDate];
            setSelectedDays(newDays);
            setConfigModalVisible(false);
            setEditingDate(null);
        }
    };

    return (
        <SafeAreaView style={styles.safeArea} edges={['top', 'bottom', 'left', 'right']}>
            <StatusBar style="dark" translucent={true} />

            <ScrollView
                contentContainerStyle={[
                    styles.scrollContent,
                    { paddingBottom: SPACING.xl }
                ]}
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.header}>
                    <View>
                        <Typography variant="h1" weight="bold" color={COLORS.primary}>
                            Labor Calculator
                        </Typography>
                        <Typography variant="body" color={COLORS.textSecondary}>
                            Colombia 2026
                        </Typography>
                    </View>
                    <TouchableOpacity onPress={() => setIsSettingsVisible(true)} style={styles.settingsButton}>
                        <Ionicons name="settings-outline" size={28} color={COLORS.primary} />
                    </TouchableOpacity>
                </View>

                <SummaryCard
                    directPay={results.pay.netPay}
                    accruals={results.accruals.totalAccruals}
                    pila={results.pila.total}
                    onPress={() => setIsBreakdownVisible(true)}
                    isWarning={results.pay.grossPay > 0 && results.pay.netPay === 0}
                />

                <WorkCalendar
                    selectedDays={selectedDays}
                    onDayPress={handleDayPress}
                />

                {Object.keys(selectedDays).length === 0 && (
                    <Typography variant="caption" align="center" color={COLORS.textSecondary} style={{ marginTop: SPACING.l }}>
                        Select days on the calendar to calculate costs.
                    </Typography>
                )}

            </ScrollView>

            {/* Breakdown Modal */}
            <BreakdownModal
                visible={isBreakdownVisible}
                onClose={() => setIsBreakdownVisible(false)}
                data={results}
            />

            {/* Day Config Modal */}
            <DayConfigModal
                visible={configModalVisible}
                date={editingDate}
                initialData={editingDate ? selectedDays[editingDate] : undefined}
                defaultHours={settings.defaultHours}
                onSave={handleSaveDay}
                onDelete={handleDeleteDay}
                onClose={() => setConfigModalVisible(false)}
            />

            {/* Settings Screen */}
            <SettingsScreen
                visible={isSettingsVisible}
                onClose={() => setIsSettingsVisible(false)}
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    scrollContent: {
        padding: SPACING.l,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: SPACING.xl,
        marginTop: SPACING.m,
    },
    settingsButton: {
        padding: SPACING.s,
    },
});
