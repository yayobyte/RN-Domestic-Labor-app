import React from 'react';
import { View, ViewStyle, StyleSheet, StyleProp } from 'react-native';
import { COLORS, RADIUS, SHADOWS, SPACING } from '../theme/theme';

interface CardProps {
    children: React.ReactNode;
    style?: StyleProp<ViewStyle>;
    variant?: 'elevated' | 'flat' | 'outlined';
    padding?: keyof typeof SPACING;
}

export const Card: React.FC<CardProps> = ({
    children,
    style,
    variant = 'elevated',
    padding = 'l',
}) => {
    const cardStyle = [
        styles.base,
        styles[variant],
        { padding: SPACING[padding] },
        style,
    ];

    return <View style={cardStyle}>{children}</View>;
};

const styles = StyleSheet.create({
    base: {
        backgroundColor: COLORS.surface,
        borderRadius: RADIUS.l,
    },
    elevated: {
        ...SHADOWS.soft,
    },
    flat: {
        backgroundColor: COLORS.background, // Or just pure surface without shadow
    },
    outlined: {
        borderWidth: 1,
        borderColor: COLORS.border,
        backgroundColor: 'transparent',
    },
});
