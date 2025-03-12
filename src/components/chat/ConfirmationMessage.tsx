import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { colors } from '@/src/constants/Colors';
import { fonts } from '@/src/constants/Fonts';
import { images } from '@/src/constants/Images';

interface ConfirmationMessageProps {
    riskLevel: string;
    amount?: number;
    onConfirm: () => void;
    onCancel: () => void;
}

export default function ConfirmationMessage({
    riskLevel,
    amount,
    onConfirm,
    onCancel
}: ConfirmationMessageProps) {
    // Add state to track the confirmation status
    const [status, setStatus] = useState<'pending' | 'confirmed' | 'cancelled'>('pending');

    // Get risk level color based on level
    const getRiskColor = () => {
        switch (riskLevel.toLowerCase()) {
            case 'low':
                return colors.cyan.color01;
            case 'medium':
                return colors.beige.color01;
            case 'high':
                return colors.red.color01;
            default:
                return colors.cyan.color01;
        }
    };

    // Handle confirmation with status update
    const handleConfirm = () => {
        setStatus('confirmed');
        onConfirm();
    };

    // Handle cancellation with status update
    const handleCancel = () => {
        setStatus('cancelled');
        onCancel();
    };

    return (
        <View style={styles.container}>
            <View style={styles.headerContainer}>
                <Image
                    source={status === 'pending' ? images.pending : status === 'confirmed' ? images.tick : images.cross}
                    style={[styles.headerIcon,
                    status === 'confirmed' && { tintColor: colors.cyan.color01 },
                    status === 'cancelled' && { tintColor: colors.red.color01 }
                    ]}
                    resizeMode="contain"
                />
                <Text style={styles.title}>
                    {status === 'pending' ? 'Confirm Transaction' :
                        status === 'confirmed' ? 'Transaction Confirmed' :
                            'Transaction Cancelled'}
                </Text>
            </View>

            <View style={[
                styles.detailsContainer,
                status === 'confirmed' && styles.confirmedContainer,
                status === 'cancelled' && styles.cancelledContainer
            ]}>
                <View style={styles.amountSection}>
                    <Text style={styles.amountLabel}>Amount</Text>
                    <Text style={styles.amountValue}>${amount}</Text>
                </View>

                <View style={styles.separator} />

                <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Risk Level</Text>
                    <View style={[styles.riskPill, { backgroundColor: getRiskColor() + '20', borderColor: getRiskColor() }]}>
                        <Text style={[styles.riskText, { color: riskLevel.toLowerCase() === 'high' ? colors.red.primary : colors.black.primary }]}>
                            {riskLevel.charAt(0).toUpperCase() + riskLevel.slice(1)}
                        </Text>
                    </View>
                </View>
            </View>

            {status === 'pending' ? (
                <View style={styles.buttonContainer}>
                    <TouchableOpacity
                        style={[styles.button, styles.cancelButton]}
                        onPress={handleCancel}
                    >
                        <Text style={styles.cancelButtonText}>Cancel</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.button, styles.confirmButton]}
                        onPress={handleConfirm}
                    >
                        <Text style={styles.confirmButtonText}>Confirm</Text>
                    </TouchableOpacity>
                </View>
            ) : (
                <View style={styles.statusContainer}>
                    <Text style={[
                        styles.statusText,
                        status === 'confirmed' ? styles.confirmedText : styles.cancelledText
                    ]}>
                        {status === 'confirmed'
                            ? 'Your transaction has been processed'
                            : 'Transaction was cancelled'}
                    </Text>
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        alignSelf: 'center',
        width: '90%',
        backgroundColor: colors.grey.white,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: colors.grey.color04,
        padding: 16,
        marginVertical: 12,
        shadowColor: colors.black.primary,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 3,
    },
    headerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    headerIcon: {
        width: 24,
        height: 24,
        marginRight: 8,
        tintColor: colors.beige.color01,
    },
    title: {
        fontFamily: fonts.primary.semibold,
        fontSize: 18,
        color: colors.black.primary,
    },
    detailsContainer: {
        backgroundColor: colors.beige.color03,
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
    },
    confirmedContainer: {
        backgroundColor: colors.cyan.color03,
        borderWidth: 1,
        borderColor: colors.cyan.color01,
    },
    cancelledContainer: {
        backgroundColor: colors.red.color03 + '30',
        borderWidth: 1,
        borderColor: colors.red.color01,
    },
    amountSection: {
        alignItems: 'center',
        marginBottom: 16,
    },
    amountLabel: {
        fontFamily: fonts.secondary.regular,
        fontSize: 14,
        color: colors.black.color02,
        marginBottom: 4,
    },
    amountValue: {
        fontFamily: fonts.primary.bold,
        fontSize: 24,
        color: colors.black.primary,
    },
    separator: {
        height: 1,
        backgroundColor: colors.grey.color03,
        marginBottom: 16,
    },
    detailRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    detailLabel: {
        fontFamily: fonts.secondary.regular,
        fontSize: 14,
        color: colors.black.color02,
    },
    riskPill: {
        paddingVertical: 4,
        paddingHorizontal: 12,
        borderRadius: 12,
        borderWidth: 1,
    },
    riskText: {
        fontFamily: fonts.secondary.medium,
        fontSize: 14,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    button: {
        borderRadius: 12,
        paddingVertical: 12,
        paddingHorizontal: 16,
        flex: 1,
        alignItems: 'center',
        marginHorizontal: 4,
    },
    cancelButton: {
        backgroundColor: colors.grey.color04,
        borderWidth: 1,
        borderColor: colors.grey.color03,
    },
    confirmButton: {
        backgroundColor: colors.black.primary,
    },
    cancelButtonText: {
        fontFamily: fonts.primary.medium,
        fontSize: 16,
        color: colors.black.primary,
    },
    confirmButtonText: {
        fontFamily: fonts.primary.medium,
        fontSize: 16,
        color: colors.grey.white,
    },
    statusContainer: {
        padding: 12,
        borderRadius: 12,
        backgroundColor: colors.beige.color03,
    },
    statusText: {
        fontFamily: fonts.secondary.medium,
        fontSize: 15,
        textAlign: 'center',
    },
    confirmedText: {
        color: colors.cyan.color01,
    },
    cancelledText: {
        color: colors.red.color01,
    }
});
