import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Platform,
  SafeAreaView,
} from "react-native";
import { colors } from "@/src/constants/Colors";
import { fonts } from "@/src/constants/Fonts";
import { images } from "@/src/constants/Images";
import {
  formatNumberWithCommas,
  resolveApyToString,
} from "@/src/utils/CustomFormatter";
import Pill from "@/src/components/Pill";
import { useUserInfo } from "@/src/hooks/useUserInfo";
import { useTransaction } from "@/src/hooks/useTransaction";
import { router } from "expo-router";
import WithdrawModal from "@/src/components/modals/WithdrawModal";
import Toast from "react-native-toast-message";

export default function PolystreamVaultPage() {
  const {
    vaultApy,
    vaultBalance,
    vaultStatus,
    mediumRiskVaultBalance,
    highRiskVaultBalance,
  } = useUserInfo();
  const { transferVaultToWallet } = useTransaction();
  const vaultCurrency = "USD";
  const [showStats, setShowStats] = useState(false);
  // State for withdrawal modal
  const [withdrawModalVisible, setWithdrawModalVisible] = useState(false);
  const [selectedVault, setSelectedVault] = useState<null | {
    id: number;
    name: string;
    balance: number;
    imageKey: string;
  }>(null);

  // Mock data for individual vaults
  const individualVaults = [
    {
      id: 1,
      name: "Conservative Yield Vault",
      balance: (vaultBalance * 0.1).toFixed(0),
      apy: "3.50%",
      risk: "Low Risk",
      imageKey: "green_crystal",
    },
    {
      id: 2,
      name: "Balanced Growth Vault",
      balance: mediumRiskVaultBalance,
      apy: "3000%",
      risk: "Medium Risk",
      imageKey: "yellow_crystal",
    },
    {
      id: 3,
      name: "Alpha Seeker Vault",
      balance: highRiskVaultBalance,
      apy: "10000%",
      risk: "High Risk",
      imageKey: "red_crystal",
    },
  ];

  const handleWithdrawPress = (vault: {
    id: number;
    name: string;
    balance: number;
    imageKey: string;
  }) => {
    setSelectedVault(vault);
    setWithdrawModalVisible(true);
  };

  const handleWithdrawConfirm = async (amount: number) => {
    if (!selectedVault) return;

    // Get vault name for toast messages
    const vaultName = selectedVault.name;

    // Show initial withdrawal toast notification
    Toast.show({
      type: "info",
      text1: "Withdrawal in progress",
      text2: `Withdrawing ${amount} from ${vaultName}...`,
      position: "top",
      visibilityTime: 20000, // Long duration as the transaction might take time
      props: {
        backgroundColor: "#e49b13", // Orange background for in-progress
      },
    });

    // Navigate to portfolio immediately
    router.push("/portfolio");
    setWithdrawModalVisible(false);
    try {
      // Execute the withdrawal transaction
      await transferVaultToWallet(amount);

      // Show success toast when transaction completes
      Toast.show({
        type: "success",
        text1: "Withdrawal successful",
        text2: `Successfully withdrew ${amount} from ${vaultName}`,
        position: "top",
        visibilityTime: 6000, // Show for 6 seconds
        props: {
          backgroundColor: colors.green.primary, // Green background
        },
      });

      // Refresh balances
      // await refreshUserInfo();
    } catch (error) {
      console.error("Error during withdrawal process:", error);

      // Show error toast when transaction fails
      Toast.show({
        type: "error",
        text1: "Withdrawal failed",
        text2: "There was an error processing your withdrawal",
        position: "top",
        visibilityTime: 6000, // Show for 6 seconds
        props: {
          backgroundColor: colors.red.primary, // Red background
        },
      });
    } finally {
      // Close the modal
      setWithdrawModalVisible(false);
    }
  };

  useEffect(() => {
    console.log("Medium risk balance in vault:", mediumRiskVaultBalance);
    console.log("High risk balance in vault:", highRiskVaultBalance);
  }, [mediumRiskVaultBalance, highRiskVaultBalance]);

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        {/* Sticky Header */}
        <View style={styles.stickyHeader}>
          <TouchableOpacity
            style={styles.backArrowContainer}
            onPress={() => router.back()}
          >
            <Image
              source={images.back_arrow}
              style={styles.backArrowIcon}
              resizeMode="contain"
            />
          </TouchableOpacity>
          <Text style={styles.pageTitle}>Polystream Vault</Text>
        </View>

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Main Vault Card */}
          <View style={styles.vaultCard}>
            {/* Card content remains the same */}
            <View style={styles.cardHeader}>
              <Pill status={vaultStatus} />
              <View style={styles.overallApyContainer}>
                <Text style={styles.overallApyLabel}>Overall APY</Text>
                <Text style={styles.apy}>
                  {resolveApyToString(vaultApy).split(" ")[0]}
                </Text>{" "}
              </View>
            </View>

            <View style={styles.balanceSection}>
              <Text style={styles.balanceLabel}>Total Balance</Text>
              <View style={styles.balanceRow}>
                <Text style={styles.balanceValue}>
                  {formatNumberWithCommas(vaultBalance)}
                </Text>
                <Text style={styles.balanceCurrency}>{vaultCurrency}</Text>
              </View>
            </View>

            {/* Dropdown toggle - just the arrow centered */}
            {!showStats && (
              <TouchableOpacity
                style={styles.toggleArrowContainer}
                onPress={() => setShowStats(true)}
                activeOpacity={0.6}
              >
                <Image
                  source={images.angle_down}
                  style={styles.toggleStatsIcon}
                  resizeMode="contain"
                />
              </TouchableOpacity>
            )}

            {/* Dropdown statistics section */}
            {showStats && (
              <View style={styles.dropdown}>
                <View style={styles.statsGrid}>
                  <View style={styles.statColumn}>
                    <Text style={styles.statGridLabel}>Total Value Locked</Text>
                    <View style={styles.statValueRow}>
                      <Text style={styles.statGridValue}>82,000</Text>
                      <Text style={styles.statCurrency}>{vaultCurrency}</Text>
                    </View>
                  </View>
                  <View style={styles.statColumn}>
                    <Text style={styles.statGridLabel}>Est. Monthly Yield</Text>
                    <View style={styles.statValueRow}>
                      <Text style={styles.statGridValue}>4,712</Text>
                      <Text style={styles.statCurrency}>{vaultCurrency}</Text>
                    </View>
                  </View>
                </View>

                <View style={styles.statsGrid}>
                  <View style={styles.statColumn}>
                    <Text style={styles.statGridLabel}>
                      Number of Strategies
                    </Text>
                    <Text style={styles.statGridValue}>3</Text>
                  </View>
                  <View style={styles.statColumn}>
                    <Text style={styles.statGridLabel}>Time Lock</Text>
                    <Text style={styles.statGridValue}>30 days</Text>
                  </View>
                </View>

                {/* Up arrow at the bottom of the dropdown */}
                <TouchableOpacity
                  style={styles.closeArrowContainer}
                  onPress={() => setShowStats(false)}
                  activeOpacity={0.6}
                >
                  <Image
                    source={images.angle_up}
                    style={styles.toggleStatsIcon}
                    resizeMode="contain"
                  />
                </TouchableOpacity>
              </View>
            )}
          </View>

          {/* Individual Vaults Section */}
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Your Vault Positions</Text>

            {individualVaults.map((vault) => (
              <View key={vault.id} style={styles.vaultItemCard}>
                <View style={styles.vaultItemHeader}>
                  <View style={styles.vaultItemLeft}>
                    <View style={styles.crystalContainer}>
                      <Image
                        source={images[vault.imageKey as keyof typeof images]}
                        style={styles.crystalImage}
                        resizeMode="contain"
                      />
                    </View>
                    <View>
                      <Text style={styles.vaultItemName}>{vault.name}</Text>
                      <Text style={styles.vaultItemRisk}>{vault.risk}</Text>
                    </View>
                  </View>
                </View>

                <View style={styles.vaultItemDetails}>
                  <View style={styles.vaultItemDetail}>
                    <Text style={styles.detailLabel}>Balance</Text>
                    <View style={styles.vaultItemBalanceRow}>
                      <Text style={styles.vaultItemBalanceValue}>
                        {vault.balance}
                      </Text>
                      <Text style={styles.vaultItemBalanceCurrency}>
                        {vaultCurrency}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.vaultItemDetail}>
                    <Text style={styles.detailLabel}>APY</Text>
                    <Text style={[styles.detailValue, styles.apyValue]}>
                      {vault.apy}
                    </Text>
                  </View>

                  <TouchableOpacity
                    style={styles.withdrawButton}
                    onPress={() => handleWithdrawPress(vault)}
                  >
                    <Image
                      source={images.withdraw}
                      style={styles.withdrawIcon}
                      resizeMode="contain"
                    />
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        </ScrollView>

        {/* Using the WithdrawModal component */}
        <WithdrawModal
          visible={withdrawModalVisible}
          onClose={() => setWithdrawModalVisible(false)}
          onConfirm={handleWithdrawConfirm}
          vaultInfo={selectedVault}
          vaultCurrency={vaultCurrency}
        />
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  // Keep all existing styles except for the modal-related ones
  container: {
    flex: 1,
    backgroundColor: colors.beige.color03,
  },
  safeArea: {
    flex: 1,
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  stickyHeader: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: colors.beige.color03,
    borderBottomWidth: 1,
    borderBottomColor: colors.beige.color03,
    zIndex: 10,
    position: "relative",
  },
  scrollContent: {
    padding: 20,
    paddingTop: 10,
    paddingBottom: 100,
  },
  backArrowContainer: {
    marginRight: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  backArrowIcon: {
    width: 32,
    height: 32,
  },
  pageTitle: {
    fontFamily: fonts.primary.bold,
    fontSize: 24,
    color: colors.black.primary,
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
    marginBottom: 24,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  overallApyContainer: {
    alignItems: "flex-start",
  },
  overallApyLabel: {
    fontFamily: fonts.secondary.regular,
    fontSize: 12,
    color: colors.grey.color01,
    marginBottom: 4,
  },
  apy: {
    fontFamily: fonts.secondary.bold,
    fontSize: 16,
    color: colors.green.primary,
  },
  balanceSection: {
    marginVertical: 16,
  },
  balanceLabel: {
    fontFamily: fonts.secondary.regular,
    fontSize: 16,
    color: colors.black.color02,
  },
  balanceRow: {
    flexDirection: "row",
    alignItems: "baseline",
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
  toggleArrowContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  toggleStatsIcon: {
    width: 24,
    height: 24,
    tintColor: colors.grey.color01,
  },
  dropdown: {
    marginTop: 16,
  },
  closeArrowContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  sectionContainer: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontFamily: fonts.primary.semibold,
    fontSize: 20,
    color: colors.black.primary,
    marginBottom: 16,
  },
  vaultItemCard: {
    backgroundColor: colors.grey.white,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: colors.black.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  vaultItemHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  vaultItemLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  crystalContainer: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  crystalImage: {
    width: 32,
    height: 32,
  },
  vaultItemName: {
    fontFamily: fonts.primary.semibold,
    fontSize: 16,
    color: colors.black.primary,
  },
  vaultItemRisk: {
    fontFamily: fonts.secondary.regular,
    fontSize: 12,
    color: colors.grey.color01,
    marginTop: 2,
  },
  chevronIcon: {
    width: 20,
    height: 20,
    tintColor: colors.grey.color01,
  },
  vaultItemDetails: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.grey.color04,
  },
  vaultItemDetail: {
    alignItems: "flex-start",
    flex: 1,
  },
  detailLabel: {
    fontFamily: fonts.secondary.regular,
    fontSize: 12,
    color: colors.grey.color01,
    marginBottom: 4,
  },
  detailValue: {
    fontFamily: fonts.primary.semibold,
    fontSize: 16,
    color: colors.black.primary,
  },
  apyValue: {
    color: "#00C853",
  },
  separator: {
    height: 1,
    backgroundColor: colors.grey.color03,
    marginVertical: 20,
  },
  statRow: {
    flexDirection: "row",
    justifyContent: "space-between",
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
  },
  vaultItemBalanceRow: {
    flexDirection: "row",
    alignItems: "baseline",
  },
  vaultItemBalanceValue: {
    fontFamily: fonts.primary.semibold,
    fontSize: 16,
    color: colors.black.primary,
    marginRight: 4,
  },
  vaultItemBalanceCurrency: {
    fontFamily: fonts.primary.regular,
    fontSize: 12,
    color: colors.black.color02,
  },
  statsGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  statColumn: {
    width: "40%",
    borderRadius: 8,
  },
  statGridLabel: {
    fontFamily: fonts.secondary.regular,
    fontSize: 12,
    color: colors.grey.color01,
    marginBottom: 4,
  },
  statGridValue: {
    fontFamily: fonts.primary.semibold,
    fontSize: 18,
    color: colors.black.primary,
  },
  statValueRow: {
    flexDirection: "row",
    alignItems: "baseline",
  },
  statCurrency: {
    fontFamily: fonts.primary.medium,
    fontSize: 12,
    color: colors.black.color02,
    marginLeft: 4,
  },
  withdrawButton: {
    backgroundColor: colors.beige.primary,
    padding: 10,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.beige.color01,
    width: 44,
    height: 44,
  },
  withdrawIcon: {
    width: 20,
    height: 20,
    tintColor: colors.black.primary,
  },
});
