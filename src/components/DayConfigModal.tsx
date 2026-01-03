import React, { useState, useEffect } from 'react';
import { View, Modal, StyleSheet, TouchableOpacity, Switch, Platform } from 'react-native';
import { BlurView } from 'expo-blur';
import { Typography } from '../ui/Typography';
import { COLORS, SPACING, RADIUS, SHADOWS } from '../theme/theme';
import { Ionicons } from '@expo/vector-icons';
import { NIGHT_SURCHARGE_PERCENTAGE } from '../business/constants';
import { MAX_HOURS_PER_DAY, MIN_HOURS_PER_DAY, DEFAULT_HOURS_PER_DAY } from '../business/validation';

interface DayConfigModalProps {
    visible: boolean;
    date: string | null;
    initialData?: { hours: number; isNight: boolean };
    onSave: (hours: number, isNight: boolean) => void;
    onDelete: () => void;
    onClose: () => void;
    defaultHours?: number;
}

export const DayConfigModal: React.FC<DayConfigModalProps> = ({
    visible,
    date,
    initialData,
    onSave,
    onDelete,
    onClose,
    defaultHours = DEFAULT_HOURS_PER_DAY,
}) => {
    const [hours, setHours] = useState(defaultHours);
    const [isNight, setIsNight] = useState(false);

    useEffect(() => {
        if (initialData) {
            setHours(initialData.hours);
            setIsNight(initialData.isNight);
        } else {
            setHours(defaultHours);
            setIsNight(false);
        }
    }, [initialData, visible, defaultHours]);

    const handleIncrement = () => setHours(h => Math.min(MAX_HOURS_PER_DAY, h + 1));
    const handleDecrement = () => setHours(h => Math.max(MIN_HOURS_PER_DAY, h - 1));

    if (!date) return null;

    const PRESETS = [4, 8, 10, 12];

    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={visible}
            onRequestClose={onClose}
        >
            <View style={styles.centeredView}>
                {Platform.OS === 'ios' ? (
                    <BlurView intensity={20} style={styles.absoluteFill} tint="dark" />
                ) : (
                    <View style={[styles.absoluteFill, { backgroundColor: 'rgba(0,0,0,0.7)' }]} />
                )}

                <View style={styles.modalView}>
                    <View style={styles.header}>
                        <Typography variant="h3" weight="bold">
                            Configure {date}
                        </Typography>
                        <TouchableOpacity onPress={onClose}>
                            <Ionicons name="close" size={24} color={COLORS.textSecondary} />
                        </TouchableOpacity>
                    </View>

                    <View style={styles.content}>
                        {/* Hours Fast Presets */}
                        <View style={styles.presetsContainer}>
                            {PRESETS.map(p => (
                                <TouchableOpacity
                                    key={p}
                                    style={[styles.presetBtn, hours === p && styles.presetBtnActive]}
                                    onPress={() => setHours(p)}
                                >
                                    <Typography
                                        variant="caption"
                                        weight="bold"
                                        color={hours === p ? "#FFF" : COLORS.textSecondary}
                                    >
                                        {p}h
                                    </Typography>
                                </TouchableOpacity>
                            ))}
                        </View>

                        {/* Hours Control */}
                        <View style={styles.row}>
                            <Typography variant="body" weight="medium">Hours Worked</Typography>
                            <View style={styles.counter}>
                                <TouchableOpacity onPress={handleDecrement} style={styles.counterBtn}>
                                    <Ionicons name="remove" size={20} color={COLORS.primary} />
                                </TouchableOpacity>
                                <Typography variant="h3" weight="bold" style={{ marginHorizontal: SPACING.m, minWidth: 30, textAlign: 'center' }}>
                                    {hours}
                                </Typography>
                                <TouchableOpacity onPress={handleIncrement} style={styles.counterBtn}>
                                    <Ionicons name="add" size={20} color={COLORS.primary} />
                                </TouchableOpacity>
                            </View>
                        </View>

                        {/* Night Shift Toggle */}
                        <View style={styles.row}>
                            <View>
                                <Typography variant="body" weight="medium">Night Shift</Typography>
                                <Typography variant="caption" color={COLORS.textSecondary}>Add {(NIGHT_SURCHARGE_PERCENTAGE * 100).toFixed(0)}% surcharge</Typography>
                            </View>
                            <Switch
                                trackColor={{ false: COLORS.border, true: COLORS.base }}
                                thumbColor={Platform.OS === 'ios' ? '#fff' : isNight ? COLORS.primary : '#f4f3f4'}
                                onValueChange={setIsNight}
                                value={isNight}
                            />
                        </View>

                        {/* Actions */}
                        <View style={styles.actions}>
                            <TouchableOpacity
                                style={[styles.button, styles.deleteButton]}
                                onPress={onDelete}
                            >
                                <Typography variant="body" weight="bold" color={COLORS.error}>
                                    Remove Day
                                </Typography>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={[styles.button, styles.saveButton]}
                                onPress={() => onSave(hours, isNight)}
                            >
                                <Typography variant="body" weight="bold" color="#FFF">
                                    Save
                                </Typography>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    absoluteFill: {
        ...StyleSheet.absoluteFillObject,
    },
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        padding: SPACING.l,
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalView: {
        backgroundColor: COLORS.surface,
        borderRadius: RADIUS.xl,
        padding: SPACING.l,
        ...SHADOWS.strong,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: SPACING.l,
    },
    content: {
        gap: SPACING.l,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    counter: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.background,
        borderRadius: RADIUS.m,
        padding: SPACING.xs,
    },
    counterBtn: {
        padding: SPACING.s,
        backgroundColor: COLORS.surface,
        borderRadius: RADIUS.s,
        ...SHADOWS.soft,
    },
    presetsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: SPACING.s,
    },
    presetBtn: {
        paddingHorizontal: SPACING.m,
        paddingVertical: SPACING.s,
        borderRadius: RADIUS.m,
        backgroundColor: COLORS.background,
        borderWidth: 1,
        borderColor: COLORS.border,
        minWidth: 60,
        alignItems: 'center',
    },
    presetBtnActive: {
        backgroundColor: COLORS.primary,
        borderColor: COLORS.primary,
    },
    actions: {
        flexDirection: 'row',
        marginTop: SPACING.m,
        gap: SPACING.m,
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
    deleteButton: {
        backgroundColor: COLORS.background,
        borderWidth: 1,
        borderColor: COLORS.error,
    },
});
