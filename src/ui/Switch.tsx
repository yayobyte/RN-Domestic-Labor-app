import React from 'react';
import { View, Switch as RNSwitch, StyleSheet, Platform } from 'react-native';
import { Typography } from './Typography';
import { COLORS, SPACING } from '../theme/theme';

interface SwitchProps {
    value: boolean;
    onValueChange: (value: boolean) => void;
    label?: string;
    disabled?: boolean;
}

export const Switch: React.FC<SwitchProps> = ({ value, onValueChange, label, disabled = false }) => {
    return (
        <View style={styles.container}>
            {label && (
                <Typography variant="body" weight="medium" color={disabled ? COLORS.textSecondary : COLORS.text}>
                    {label}
                </Typography>
            )}
            <RNSwitch
                trackColor={{ false: COLORS.border, true: COLORS.base }}
                thumbColor={Platform.OS === 'ios' ? '#fff' : value ? COLORS.primary : '#f4f3f4'}
                ios_backgroundColor={COLORS.border}
                onValueChange={onValueChange}
                value={value}
                disabled={disabled}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: SPACING.s,
    },
});
