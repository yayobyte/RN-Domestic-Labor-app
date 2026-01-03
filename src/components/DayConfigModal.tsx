import React, { useState, useEffect } from 'react';
import { View, Modal, StyleSheet, TouchableOpacity, Switch, Platform } from 'react-native';
import { BlurView } from 'expo-blur';
import { Typography } from '../ui/Typography';
import { COLORS, SPACING, RADIUS, SHADOWS } from '../theme/theme';
import { Ionicons } from '@expo/vector-icons';

interface DayConfigModalProps {
    visible: boolean;
    date: string | null;
    initialData?: { hours: number; isNight: boolean };
    onSave: (hours: number, isNight: boolean) => void;
    onDelete: () => void;
    onClose: () => void;
}

export const DayConfigModal: React.FC<DayConfigModalProps> = ({
    visible,
    date,
    initialData,
    onSave,
    onDelete,
    onClose,
}) => {
    const [hours, setHours] = useState(8);
    const [isNight, setIsNight] = useState(false);

    useEffect(() => {
        if (initialData) {
            setHours(initialData.hours);
            setIsNight(initialData.isNight);
        } else {
            setHours(8); // Default
            setIsNight(false);
        }
    }, [initialData, visible]);

    const handleIncrement = () => setHours(h => Math.min(24, h + 1));
    const handleDecrement = () => setHours(h => Math.max(1, h - 1));

    if (!date) return null;

    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={visible}
            onRequestClose={onClose}
        >
            <View style={styles.centeredView}>
                <BlurView intensity={20} style={StyleSheet.absoluteFill} tint="dark" />

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
                                <Typography variant="caption" color={COLORS.textSecondary}>Add 35% surcharge</Typography>
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
