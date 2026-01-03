import React, { useState, useEffect } from 'react';
import { View, Modal, StyleSheet, TouchableOpacity, ScrollView, TextInput, Platform, Alert, KeyboardAvoidingView } from 'react-native';
import { BlurView } from 'expo-blur';
import { Typography } from '../ui/Typography';
import { Switch } from '../ui/Switch';
import { Card } from '../ui/Card';
import { COLORS, SPACING, RADIUS, SHADOWS } from '../theme/theme';
import { useSettings } from '../context/SettingsContext';
import { Ionicons } from '@expo/vector-icons';
import { SMMLV_2026 } from '../business/constants';
import { isValidSalary, clampHours } from '../business/validation';

interface SettingsScreenProps {
    visible: boolean;
    onClose: () => void;
}

export const SettingsScreen: React.FC<SettingsScreenProps> = ({ visible, onClose }) => {
    const { settings, updateSettings, resetToDefaults } = useSettings();

    const [includeHealth, setIncludeHealth] = useState(settings.includeHealth);
    const [minimumSalary, setMinimumSalary] = useState(settings.minimumSalary.toString());
    const [defaultHours, setDefaultHours] = useState(settings.defaultHours.toString());

    useEffect(() => {
        if (visible) {
            setIncludeHealth(settings.includeHealth);
            setMinimumSalary(settings.minimumSalary.toString());
            setDefaultHours(settings.defaultHours.toString());
        }
    }, [visible, settings]);

    const handleSave = async () => {
        const salaryNum = parseInt(minimumSalary) || SMMLV_2026;
        const hoursNum = clampHours(parseInt(defaultHours));

        await updateSettings({
            includeHealth,
            minimumSalary: salaryNum,
            defaultHours: hoursNum,
        });

        onClose();
    };

    const handleReset = () => {
        Alert.alert(
            'Reset Settings',
            'Are you sure you want to reset all settings to defaults?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Reset',
                    style: 'destructive',
                    onPress: async () => {
                        await resetToDefaults();
                        onClose();
                    },
                },
            ]
        );
    };

    const salaryNum = parseInt(minimumSalary) || 0;
    const showSalaryWarning = salaryNum > 0 && !isValidSalary(salaryNum);

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={visible}
            onRequestClose={onClose}
        >
            <View style={styles.centeredView}>
                {Platform.OS === 'ios' ? (
                    <BlurView intensity={20} style={StyleSheet.absoluteFill} tint="dark" />
                ) : (
                    <View style={[StyleSheet.absoluteFill, { backgroundColor: 'rgba(0,0,0,0.5)' }]} />
                )}

                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    style={styles.keyboardView}
                >
                    <View style={styles.modalView}>
                        <View style={styles.header}>
                            <Typography variant="h3" weight="bold" color={COLORS.primary}>
                                Settings
                            </Typography>
                            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                                <Typography variant="body" color={COLORS.textSecondary}>Close</Typography>
                            </TouchableOpacity>
                        </View>

                        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>

                            {/* PILA Configuration */}
                            <View style={styles.section}>
                                <Typography variant="h3" weight="bold" style={styles.sectionTitle}>
                                    PILA Configuration
                                </Typography>
                                <Card>
                                    <Switch
                                        label="Include Health (EPS)"
                                        value={includeHealth}
                                        onValueChange={setIncludeHealth}
                                    />
                                    <Typography variant="caption" color={COLORS.textSecondary} style={{ marginTop: SPACING.xs }}>
                                        Disable if worker has SISBEN or is a beneficiary in another health plan
                                    </Typography>
                                </Card>
                            </View>

                            {/* Salary Configuration */}
                            <View style={styles.section}>
                                <Typography variant="h3" weight="bold" style={styles.sectionTitle}>
                                    Minimum Salary
                                </Typography>
                                <Card>
                                    <Typography variant="body" weight="medium" style={{ marginBottom: SPACING.s }}>
                                        Base Salary (SMMLV)
                                    </Typography>
                                    <TextInput
                                        style={[styles.input, showSalaryWarning && styles.inputWarning]}
                                        value={minimumSalary}
                                        onChangeText={setMinimumSalary}
                                        keyboardType="numeric"
                                        placeholder="1750905"
                                        placeholderTextColor={COLORS.textSecondary}
                                    />
                                    {showSalaryWarning ? (
                                        <View style={styles.warningBox}>
                                            <Ionicons name="warning" size={16} color={COLORS.error} />
                                            <Typography variant="caption" color={COLORS.error} style={{ marginLeft: SPACING.xs, flex: 1 }}>
                                                Below legal minimum (${SMMLV_2026.toLocaleString('es-CO')})
                                            </Typography>
                                        </View>
                                    ) : (
                                        <Typography variant="caption" color={COLORS.textSecondary} style={{ marginTop: SPACING.s }}>
                                            Legal minimum for 2026: ${SMMLV_2026.toLocaleString('es-CO')}
                                        </Typography>
                                    )}
                                </Card>
                            </View>

                            {/* Default Values */}
                            <View style={styles.section}>
                                <Typography variant="h3" weight="bold" style={styles.sectionTitle}>
                                    Default Values
                                </Typography>
                                <Card>
                                    <Typography variant="body" weight="medium" style={{ marginBottom: SPACING.s }}>
                                        Default Hours per Day
                                    </Typography>
                                    <TextInput
                                        style={styles.input}
                                        value={defaultHours}
                                        onChangeText={setDefaultHours}
                                        keyboardType="numeric"
                                        placeholder="8"
                                        placeholderTextColor={COLORS.textSecondary}
                                    />
                                    <Typography variant="caption" color={COLORS.textSecondary} style={{ marginTop: SPACING.s }}>
                                        Used when selecting new days on the calendar (1-24)
                                    </Typography>
                                </Card>
                            </View>

                            {/* Actions */}
                            <View style={styles.actions}>
                                <TouchableOpacity style={[styles.button, styles.resetButton]} onPress={handleReset}>
                                    <Typography variant="body" weight="bold" color={COLORS.error}>
                                        Reset to Defaults
                                    </Typography>
                                </TouchableOpacity>

                                <TouchableOpacity style={[styles.button, styles.saveButton]} onPress={handleSave}>
                                    <Typography variant="body" weight="bold" color="#FFF">
                                        Save Changes
                                    </Typography>
                                </TouchableOpacity>
                            </View>

                            <View style={{ height: SPACING.xxl }} />
                        </ScrollView>
                    </View>
                </KeyboardAvoidingView>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: 'flex-end',
    },
    keyboardView: {
        flex: 1,
        justifyContent: 'flex-end',
    },
    modalView: {
        backgroundColor: COLORS.background,
        borderTopLeftRadius: RADIUS.xl,
        borderTopRightRadius: RADIUS.xl,
        height: '85%',
        ...SHADOWS.strong,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: SPACING.l,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.border,
        backgroundColor: COLORS.surface,
        borderTopLeftRadius: RADIUS.xl,
        borderTopRightRadius: RADIUS.xl,
    },
    closeButton: {
        padding: SPACING.s,
    },
    content: {
        padding: SPACING.l,
    },
    section: {
        marginBottom: SPACING.l,
    },
    sectionTitle: {
        marginBottom: SPACING.s,
        color: COLORS.base,
    },
    input: {
        backgroundColor: COLORS.background,
        borderWidth: 1,
        borderColor: COLORS.border,
        borderRadius: RADIUS.m,
        padding: SPACING.m,
        fontSize: 16,
        color: COLORS.text,
        fontFamily: 'Inter_400Regular',
    },
    inputWarning: {
        borderColor: COLORS.error,
        borderWidth: 2,
    },
    warningBox: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: `${COLORS.error}15`,
        padding: SPACING.s,
        borderRadius: RADIUS.s,
        marginTop: SPACING.s,
    },
    actions: {
        flexDirection: 'row',
        gap: SPACING.m,
        marginTop: SPACING.l,
    },
    button: {
        flex: 1,
        padding: SPACING.m,
        borderRadius: RADIUS.m,
        alignItems: 'center',
    },
    saveButton: {
        backgroundColor: COLORS.primary,
    },
    resetButton: {
        backgroundColor: COLORS.background,
        borderWidth: 1,
        borderColor: COLORS.error,
    },
});
