import React from 'react';
import { Text, TextStyle, StyleSheet, TextProps } from 'react-native';
import { COLORS } from '../theme/theme';

interface TypographyProps extends TextProps {
    variant?: 'h1' | 'h2' | 'h3' | 'body' | 'caption' | 'label';
    color?: string;
    weight?: 'regular' | 'medium' | 'bold';
    align?: 'auto' | 'left' | 'right' | 'center' | 'justify';
}

export const Typography: React.FC<TypographyProps> = ({
    children,
    variant = 'body',
    color = COLORS.text,
    weight = 'regular',
    align = 'left',
    style,
    ...props
}) => {
    const textStyle = [
        styles[variant],
        { color, textAlign: align },
        weight === 'bold' && { fontFamily: 'Inter_700Bold' },
        weight === 'medium' && { fontFamily: 'Inter_600SemiBold' },
        weight === 'regular' && { fontFamily: 'Inter_400Regular' },
        style,
    ];

    return (
        <Text style={textStyle} {...props}>
            {children}
        </Text>
    );
};

const styles = StyleSheet.create({
    h1: {
        fontSize: 28,
        lineHeight: 34,
        marginBottom: 8,
    },
    h2: {
        fontSize: 24,
        lineHeight: 30,
        marginBottom: 6,
    },
    h3: {
        fontSize: 20,
        lineHeight: 26,
        marginBottom: 4,
    },
    body: {
        fontSize: 16,
        lineHeight: 24,
    },
    caption: {
        fontSize: 12,
        lineHeight: 16,
        color: COLORS.textSecondary,
    },
    label: {
        fontSize: 14,
        lineHeight: 20,
        color: COLORS.textSecondary,
        marginBottom: 4,
    },
});
