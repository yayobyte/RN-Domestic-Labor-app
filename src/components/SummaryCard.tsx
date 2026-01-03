import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Card } from '../ui/Card';
import { Typography } from '../ui/Typography';
import { COLORS, RADIUS, SPACING } from '../theme/theme';
import { Ionicons } from '@expo/vector-icons';

interface SummaryCardProps {
    directPay: number;
    accruals: number;
    pila: number;
    onPress: () => void;
    isWarning?: boolean;
}

const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-CO', {
        style: 'currency',
        currency: 'COP',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(value);
};

export const SummaryCard: React.FC<SummaryCardProps> = ({
    directPay,
    accruals,
    pila,
    onPress,
    isWarning,
}) => {
    return (
        <TouchableOpacity style={styles.container} activeOpacity={0.9} onPress={onPress}>
            {/* Main Pay Card - Highlighted */}
            <LinearGradient
                colors={isWarning ? [COLORS.error, '#ff6b6b'] : [COLORS.gradientStart, COLORS.gradientEnd]}
                start={[0, 0]}
                end={[1, 1]}
                style={styles.mainCard}
            >
                <View style={styles.cardHeader}>
                    <Typography variant="label" color="rgba(255,255,255,0.8)">
                        NET PAY TO WORKER (TODAY)
                    </Typography>
                    <Ionicons name={isWarning ? "warning-outline" : "information-circle-outline"} size={20} color="rgba(255,255,255,0.6)" />
                </View>

                <Typography variant="h1" weight="bold" color="#FFF">
                    {formatCurrency(directPay)}
                </Typography>

                {isWarning ? (
                    <View style={styles.warningRow}>
                        <Ionicons name="alert-circle" size={14} color="#FFF" style={{ marginRight: 4 }} />
                        <Typography variant="caption" weight="bold" color="#FFF">
                            Hours too low to cover PILA (Net pay set to 0)
                        </Typography>
                    </View>
                ) : (
                    <Typography variant="caption" color="rgba(255,255,255,0.8)">
                        After PILA deductions
                    </Typography>
                )}
            </LinearGradient>

            <View style={styles.row}>
                {/* Accruals Card */}
                <Card style={[styles.miniCard, { marginRight: SPACING.m }]}>
                    <Typography variant="label" color={COLORS.textSecondary} style={{ fontSize: 10 }}>
                        EMPLOYER SAVINGS
                    </Typography>
                    <Typography variant="h3" weight="bold" color={COLORS.text}>
                        {formatCurrency(accruals)}
                    </Typography>
                    <Typography variant="caption" color={COLORS.textSecondary} style={{ fontSize: 10 }}>
                        Benefits (Prima/Cesantías)
                    </Typography>
                </Card>

                {/* PILA Card */}
                <Card style={styles.miniCard}>
                    <Typography variant="label" color={COLORS.textSecondary} style={{ fontSize: 10 }}>
                        MONTHLY PILA
                    </Typography>
                    <Typography variant="h3" weight="bold" color={COLORS.primary}>
                        {formatCurrency(pila)}
                    </Typography>
                    <Typography variant="caption" color={COLORS.textSecondary} style={{ fontSize: 10 }}>
                        Social Security Total
                    </Typography>
                </Card>
            </View>

            <View style={styles.hintContainer}>
                <Typography variant="caption" color={COLORS.primary} style={{ textAlign: 'center', marginTop: SPACING.s }}>
                    Tap for detailed breakdown
                </Typography>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: SPACING.l,
    },
    mainCard: {
        padding: SPACING.l,
        borderRadius: RADIUS.l,
        marginBottom: SPACING.m,
        shadowColor: COLORS.primary,
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.3,
        shadowRadius: 16,
        elevation: 8,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        marginBottom: SPACING.xs,
    },
    row: {
        flexDirection: 'row',
    },
    miniCard: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 100,
    },
    hintContainer: {
        alignItems: 'center',
    },
    warningRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 2,
    }
});
