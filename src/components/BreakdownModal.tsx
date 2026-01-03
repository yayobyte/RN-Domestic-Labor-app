import React from 'react';
import { View, Modal, StyleSheet, TouchableOpacity, ScrollView, Platform } from 'react-native';
import { Typography } from '../ui/Typography';
import { COLORS, SPACING, RADIUS, SHADOWS } from '../theme/theme';
import { BlurView } from 'expo-blur';

interface BreakdownModalProps {
    visible: boolean;
    onClose: () => void;
    data: {
        pay: {
            grossPay: number;
            netPay: number;
            workerPilaDeduction: number;
            baseSalary: number;
            transport: number;
            surcharge: number;
            hours: number;
            effectiveHourlyRate: number;
            daysWorked: number;
        } | null;
        accruals: {
            prima: number;
            cesantias: number;
            intereses: number;
            vacations: number;
            totalAccruals: number;
        } | null;
        pila: {
            health: number;
            pension: number;
            caja: number;
            arl: number;
            total: number;
        } | null;
    };
}

const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-CO', {
        style: 'currency',
        currency: 'COP',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(value);
};

const Row = ({ label, value, isTotal = false, isSub = false }: { label: string; value: number; isTotal?: boolean; isSub?: boolean }) => (
    <View style={[styles.row, isTotal && styles.totalRow, isSub && styles.subRow]}>
        <Typography
            variant={isTotal ? "h3" : "body"}
            weight={isTotal ? "bold" : "regular"}
            color={isTotal ? COLORS.text : COLORS.textSecondary}
        >
            {label}
        </Typography>
        <Typography
            variant={isTotal ? "h3" : "body"}
            weight={isTotal ? "bold" : "medium"}
            color={isTotal ? COLORS.primary : COLORS.text}
        >
            {formatCurrency(value)}
        </Typography>
    </View>
);

export const BreakdownModal: React.FC<BreakdownModalProps> = ({ visible, onClose, data }) => {
    if (!data.pay || !data.accruals || !data.pila) return null;

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={visible}
            onRequestClose={onClose}
        >
            <View style={styles.centeredView}>
                {/* Backdrop with Blur on iOS, dim on Android */}
                {Platform.OS === 'ios' ? (
                    <BlurView intensity={20} style={StyleSheet.absoluteFill} tint="dark" />
                ) : (
                    <View style={[StyleSheet.absoluteFill, { backgroundColor: 'rgba(0,0,0,0.5)' }]} />
                )}

                <View style={styles.modalView}>
                    <View style={styles.header}>
                        <Typography variant="h3" weight="bold" color={COLORS.primary}>
                            Detailed Breakdown
                        </Typography>
                        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                            <Typography variant="body" color={COLORS.textSecondary}>Close</Typography>
                        </TouchableOpacity>
                    </View>

                    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>

                        {/* Section 1: Direct Pay */}
                        <View style={styles.section}>
                            <Typography variant="h3" weight="bold" style={styles.sectionTitle}>
                                1. Pay to Worker (Today)
                            </Typography>
                            <View style={styles.card}>
                                <Row label={`Hourly Rate`} value={data.pay.effectiveHourlyRate} />
                                <Row label={`Base Salary (${data.pay.hours}h)`} value={data.pay.baseSalary} />
                                <Row label={`Transport Aid (${data.pay.daysWorked} day${data.pay.daysWorked !== 1 ? 's' : ''})`} value={data.pay.transport} />
                                {data.pay.surcharge > 0 && (
                                    <Row label="Night Surcharges (+35%)" value={data.pay.surcharge} />
                                )}
                                <View style={styles.divider} />
                                <Row label="Gross Pay" value={data.pay.grossPay} isSub />
                                <Row label="Worker PILA (8%)" value={-data.pay.workerPilaDeduction} isSub />
                                <View style={[styles.divider, { height: 2, backgroundColor: COLORS.primary }]} />
                                <Row label="Net Pay to Worker" value={data.pay.netPay} isTotal />
                            </View>
                        </View>

                        {/* Section 2: Benefits */}
                        <View style={styles.section}>
                            <Typography variant="h3" weight="bold" style={styles.sectionTitle}>
                                2. Employer Savings (Accruals)
                            </Typography>
                            <View style={styles.card}>
                                <Row label="Prima de Servicios (8.33%)" value={data.accruals.prima} />
                                <Row label="Cesantías (8.33%)" value={data.accruals.cesantias} />
                                <Row label="Interests on Cesantías (12%)" value={data.accruals.intereses} />
                                <Row label="Vacations (4.17%)" value={data.accruals.vacations} />
                                <View style={styles.divider} />
                                <Row label="Total Accruals" value={data.accruals.totalAccruals} isTotal />
                            </View>
                        </View>

                        {/* Section 3: PILA */}
                        <View style={styles.section}>
                            <Typography variant="h3" weight="bold" style={styles.sectionTitle}>
                                3. Monthly Social Security (PILA)
                            </Typography>
                            <View style={styles.card}>
                                <Row label="Health (12.5% total)" value={data.pila.health} />
                                <Row label="Pension (16% total)" value={data.pila.pension} />
                                <Row label="Caja de Compensación (4%)" value={data.pila.caja} />
                                <Row label="ARL (Risk I - 0.522%)" value={data.pila.arl} />
                                <View style={styles.divider} />
                                <Row label="Total PILA Payment" value={data.pila.total} isTotal />
                            </View>
                            <Typography variant="caption" color={COLORS.textSecondary} style={{ marginTop: SPACING.xs }}>
                                Note: Worker's portion (8%) is deducted from salary
                            </Typography>
                        </View>

                        <View style={{ height: SPACING.xxl }} />
                    </ScrollView>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    centeredView: {
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
    card: {
        backgroundColor: COLORS.surface,
        borderRadius: RADIUS.m,
        padding: SPACING.m,
        ...SHADOWS.soft,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: SPACING.s,
    },
    subRow: {
        marginLeft: SPACING.m,
    },
    totalRow: {
        marginTop: SPACING.xs,
        marginBottom: 0,
    },
    divider: {
        height: 1,
        backgroundColor: COLORS.border,
        marginVertical: SPACING.s,
    },
});
