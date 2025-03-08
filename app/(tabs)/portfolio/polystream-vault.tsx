import React from "react";
import { View, Text, StyleSheet, Image, ScrollView, Pressable } from "react-native";
import { colors } from "@/src/constants/Colors";
import { fonts } from "@/src/constants/Fonts";
import { images } from "@/src/constants/Images";
import {formatNumberWithCommas, resolveApyToString} from "@/src/utils/CustomFormatter";
import Pill from "@/src/components/Pill";
import {useUserInfo} from "@/src/hooks/useUserInfo";
import {useTransaction} from "@/src/hooks/useTransaction";

export default function PolystreamVaultPage() {
    const { vaultApy, vaultBalance, vaultStatus } = useUserInfo();
    const { transferWalletToVault, transferVaultToWallet } = useTransaction();
    const vaultCurrency = "USD";

    return (
        <View style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <Text style={styles.pageTitle}>Polystream Vault</Text>

                {/* Vault Card */}
                <View style={styles.vaultCard}>
                    <View style={styles.cardHeader}>
                        <Pill status={vaultStatus} />
                        <Text style={styles.apy}>{resolveApyToString(vaultApy)}</Text>
                    </View>

                    <View style={styles.balanceSection}>
                        <Text style={styles.balanceLabel}>Current Balance</Text>
                        <View style={styles.balanceRow}>
                            <Text style={styles.balanceValue}>{formatNumberWithCommas(vaultBalance)}</Text>
                            <Text style={styles.balanceCurrency}>{vaultCurrency}</Text>
                        </View>
                    </View>

                    <View style={styles.separator} />

                    {/* Action Bar */}
                    <View style={styles.actionBar}>
                        <ActionButton
                            icon={images.add}
                            label="Deposit"
                            onPress={transferWalletToVault}
                        />
                        <ActionButton
                            icon={images.send}
                            label="Withdraw"
                            onPress={transferVaultToWallet}
                        />
                    </View>
                </View>

                {/* Additional content can go here */}
                <View style={styles.statsContainer}>
                    <Text style={styles.sectionTitle}>Vault Statistics</Text>
                    <StatRow label="Total Assets" value="$82,000 USD" />
                    <StatRow label="Estimated Earnings" value="$4,712 USD" />
                    <StatRow label="Strategy" value="USDC Yield Farming" />
                    <StatRow label="Time Lock" value="30 days" />
                </View>
            </ScrollView>
        </View>
    );
}

// Helper component for action buttons
function ActionButton({ icon, label, onPress }: { icon: any, label: string, onPress: () => void }) {
    return (
        <Pressable style={styles.actionButton} onPress={onPress}>
            <Image source={icon} style={styles.actionIcon} resizeMode="contain" />
            <Text style={styles.actionLabel}>{label}</Text>
        </Pressable>
    );
}

// Helper component for stat rows
function StatRow({ label, value }: { label: string, value: string }) {
    return (
        <View style={styles.statRow}>
            <Text style={styles.statLabel}>{label}</Text>
            <Text style={styles.statValue}>{value}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.beige.color03,
    },
    scrollContent: {
        padding: 20,
    },
    pageTitle: {
        fontFamily: fonts.primary.bold,
        fontSize: 28,
        color: colors.black.primary,
        marginTop: 50,
        marginBottom: 24,
    },
    vaultCard: {
        backgroundColor: colors.grey.white,
        borderRadius: 16,
        padding: 24,
        shadowColor: colors.black.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 5,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    apy: {
        fontFamily: fonts.secondary.bold,
        fontSize: 16,
        color: colors.red.primary,
    },
    balanceSection: {
        marginVertical: 16,
    },
    balanceLabel: {
        fontFamily: fonts.secondary.regular,
        fontSize: 16,
        color: colors.black.color02,
        marginBottom: 8,
    },
    balanceRow: {
        flexDirection: 'row',
        alignItems: 'baseline',
    },
    balanceValue: {
        fontFamily: fonts.primary.bold,
        fontSize: 36,
        color: colors.black.primary,
        marginRight: 8,
    },
    balanceCurrency: {
        fontFamily: fonts.primary.medium,
        fontSize: 20,
        color: colors.black.color02,
    },
    separator: {
        height: 1,
        backgroundColor: colors.grey.color03,
        marginVertical: 20,
    },
    actionBar: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingVertical: 12,
    },
    actionButton: {
        alignItems: 'center',
        padding: 8,
    },
    actionIcon: {
        width: 30,
        height: 30,
        marginBottom: 8,
    },
    actionLabel: {
        fontFamily: fonts.primary.medium,
        fontSize: 16,
        color: colors.black.primary,
    },
    statsContainer: {
        marginTop: 32,
        backgroundColor: colors.grey.white,
        borderRadius: 16,
        padding: 24,
    },
    sectionTitle: {
        fontFamily: fonts.primary.semibold,
        fontSize: 20,
        color: colors.black.primary,
        marginBottom: 16,
    },
    statRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 14,
        borderBottomWidth: 1,
        borderBottomColor: colors.grey.color04,
    },
    statLabel: {
        fontFamily: fonts.secondary.regular,
        fontSize: 16,
        color: colors.black.color02,
    },
    statValue: {
        fontFamily: fonts.secondary.bold,
        fontSize: 16,
        color: colors.black.primary,
    }
});
