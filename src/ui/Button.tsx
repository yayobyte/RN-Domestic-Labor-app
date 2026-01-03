import React from 'react';
import { TouchableOpacity, ActivityIndicator, StyleSheet, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, RADIUS, SPACING } from '../theme/theme';
import { Typography } from './Typography';

interface ButtonProps {
    title: string;
    onPress: () => void;
    variant?: 'primary' | 'secondary' | 'outline';
    loading?: boolean;
    disabled?: boolean;
    style?: ViewStyle;
    icon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
    title,
    onPress,
    variant = 'primary',
    loading = false,
    disabled = false,
    style,
    icon,
}) => {
    const isPrimary = variant === 'primary';
    const isSecondary = variant === 'secondary';

    const content = (
        <>
            {loading ? (
                <ActivityIndicator color={isPrimary ? '#FFF' : COLORS.primary} />
            ) : (
                <>
                    {icon}
                    <Typography
                        weight="bold"
                        color={isPrimary ? '#FFF' : isSecondary ? COLORS.primary : COLORS.text}
                        style={{ marginLeft: icon ? 8 : 0 }}
                    >
                        {title}
                    </Typography>
                </>
            )}
        </>
    );

    const containerStyle = [
        styles.container,
        variant === 'outline' && styles.outline,
        variant === 'secondary' && styles.secondary,
        disabled && styles.disabled,
        style,
    ];

    if (isPrimary && !disabled) {
        return (
            <TouchableOpacity onPress={onPress} activeOpacity={0.8} style={[styles.wrapper, style]}>
                <LinearGradient
                    colors={[COLORS.gradientStart, COLORS.gradientEnd]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.gradient}
                >
                    {content}
                </LinearGradient>
            </TouchableOpacity>
        );
    }

    return (
        <TouchableOpacity
            onPress={onPress}
            activeOpacity={0.7}
            disabled={disabled || loading}
            style={containerStyle}
        >
            {content}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    wrapper: {
        borderRadius: RADIUS.m,
        overflow: 'hidden',
    },
    gradient: {
        paddingVertical: SPACING.l,
        paddingHorizontal: SPACING.xl,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
    },
    container: {
        paddingVertical: SPACING.l,
        paddingHorizontal: SPACING.xl,
        borderRadius: RADIUS.m,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
    },
    secondary: {
        backgroundColor: COLORS.base + '20', // 20% opacity
    },
    outline: {
        borderWidth: 1,
        borderColor: COLORS.primary,
        backgroundColor: 'transparent',
    },
    disabled: {
        backgroundColor: COLORS.border,
        borderColor: COLORS.border,
    },
});
