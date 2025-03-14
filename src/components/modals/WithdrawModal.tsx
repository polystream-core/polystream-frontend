import React, { useState } from "react";
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
  Modal,
  TextInput,
  KeyboardAvoidingView,
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
import { router } from "expo-router";

export default function PolystreamVaultPage() {
  const { vaultApy, vaultBalance, vaultStatus } = useUserInfo();
  const vaultCurrency = "USD";
  const [showStats, setShowStats] = useState(false);
  // New state for withdrawal modal
  const [withdrawModalVisible, setWithdrawModalVisible] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState("");
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
      balance: 2500,
      apy: "3.50%",
      risk: "Low Risk",
      imageKey: "green_crystal",
    },
    {
      id: 2,
      name: "Balanced Growth Vault",
      balance: 5000,
      apy: "5.75%",
      risk: "Medium Risk",
      imageKey: "yellow_crystal",
    },
    {
      id: 3,
      name: "Alpha Seeker Vault",
      balance: 2500,
      apy: "8.25%",
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
    setWithdrawAmount("");
    setWithdrawModalVisible(true);
  };

  const handleWithdraw = () => {
    if (!selectedVault) return;
    
    const amount = parseFloat(withdrawAmount);
    if (isNaN(amount) || amount <= 0 || amount > selectedVault.balance) {
      // Handle invalid amount (you might want to show an error message)
      console.log("Invalid amount");
      return;
    }
    
    // Handle withdrawal logic here
    console.log(`Withdrawing ${amount} from ${selectedVault.name}`);
    
    // Close the modal
    setWithdrawModalVisible(false);
  };

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
          {/* Main content as before */}
          {/* ... */}
          
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
                        {formatNumberWithCommas(vault.balance)}
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
        
        {/* Withdrawal Modal */}
        <Modal
          visible={withdrawModalVisible}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setWithdrawModalVisible(false)}
        >
          <KeyboardAvoidingView
            style={styles.centeredView}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
          >
            <View style={styles.modalView}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Withdraw</Text>
                <TouchableOpacity
                  onPress={() => setWithdrawModalVisible(false)}
                >
                  <Image
                    source={images.close}
                    style={styles.closeIcon}
                    resizeMode="contain"
                  />
                </TouchableOpacity>
              </View>
              
              {selectedVault && (
                <>
                  <View style={styles.modalVaultInfo}>
                    <View style={styles.modalCrystalContainer}>
                      <Image
                        source={images[selectedVault.imageKey as keyof typeof images]}
                        style={styles.modalCrystalImage}
                        resizeMode="contain"
                      />
                    </View>
                    <View>
                      <Text style={styles.modalVaultName}>{selectedVault.name}</Text>
                      <View style={styles.modalBalanceContainer}>
                        <Text style={styles.modalBalanceLabel}>Available: </Text>
                        <Text style={styles.modalBalanceValue}>
                          {formatNumberWithCommas(selectedVault.balance)} {vaultCurrency}
                        </Text>
                      </View>
                    </View>
                  </View>
                  
                  <View style={styles.inputContainer}>
                    <Text style={styles.inputLabel}>Amount to withdraw</Text>
                    <View style={styles.amountInputRow}>
                      <Text style={styles.currencySymbol}>$</Text>
                      <TextInput
                        style={styles.amountInput}
                        value={withdrawAmount}
                        onChangeText={setWithdrawAmount}
                        placeholder="0.00"
                        keyboardType="numeric"
                        placeholderTextColor={colors.grey.color02}
                      />
                      <TouchableOpacity
                        style={styles.maxButton}
                        onPress={() => setWithdrawAmount(selectedVault.balance.toString())}
                      >
                        <Text style={styles.maxButtonText}>MAX</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                  
                  <View style={styles.buttonContainer}>
                    <TouchableOpacity
                      style={styles.cancelButton}
                      onPress={() => setWithdrawModalVisible(false)}
                    >
                      <Text style={styles.cancelButtonText}>Cancel</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.confirmButton}
                      onPress={handleWithdraw}
                    >
                      <Text style={styles.confirmButtonText}>Confirm</Text>
                    </TouchableOpacity>
                  </View>
                  
                  <Text style={styles.modalNote}>
                    Note: Withdrawals may be subject to a 30-day lock period.
                  </Text>
                </>
              )}
            </View>
          </KeyboardAvoidingView>
        </Modal>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  // Keep all existing styles...
  
  // Add new styles for modal
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalView: {
    backgroundColor: colors.grey.white,
    borderRadius: 16,
    width: "90%",
    padding: 24,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  modalTitle: {
    fontFamily: fonts.primary.bold,
    fontSize: 22,
    color: colors.black.primary,
  },
  closeIcon: {
    width: 24,
    height: 24,
    tintColor: colors.grey.color01,
  },
  modalVaultInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
    padding: 16,
    backgroundColor: colors.beige.color03,
    borderRadius: 12,
  },
  modalCrystalContainer: {
    width: 50,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  modalCrystalImage: {
    width: 40,
    height: 40,
  },
  modalVaultName: {
    fontFamily: fonts.primary.semibold,
    fontSize: 18,
    color: colors.black.primary,
    marginBottom: 4,
  },
  modalBalanceContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  modalBalanceLabel: {
    fontFamily: fonts.secondary.regular,
    fontSize: 14,
    color: colors.grey.color01,
  },
  modalBalanceValue: {
    fontFamily: fonts.secondary.semibold,
    fontSize: 14,
    color: colors.black.primary,
  },
  inputContainer: {
    marginBottom: 24,
  },
  inputLabel: {
    fontFamily: fonts.secondary.medium,
    fontSize: 14,
    color: colors.black.primary,
    marginBottom: 8,
  },
  amountInputRow: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.grey.color03,
    borderRadius: 8,
    height: 56,
    paddingHorizontal: 16,
  },
  currencySymbol: {
    fontFamily: fonts.primary.regular,
    fontSize: 18,
    color: colors.black.primary,
    marginRight: 8,
  },
  amountInput: {
    flex: 1,
    height: "100%",
    fontFamily: fonts.primary.medium,
    fontSize: 18,
    color: colors.black.primary,
  },
  maxButton: {
    backgroundColor: colors.beige.color02,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
  },
  maxButtonText: {
    fontFamily: fonts.secondary.medium,
    fontSize: 12,
    color: colors.grey.color01,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  cancelButton: {
    flex: 1,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.grey.color03,
    borderRadius: 8,
    marginRight: 8,
  },
  cancelButtonText: {
    fontFamily: fonts.primary.medium,
    fontSize: 16,
    color: colors.black.primary,
  },
  confirmButton: {
    flex: 1,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.black.primary,
    borderRadius: 8,
    marginLeft: 8,
  },
  confirmButtonText: {
    fontFamily: fonts.primary.medium,
    fontSize: 16,
    color: colors.grey.white,
  },
  modalNote: {
    fontFamily: fonts.secondary.regular,
    fontSize: 12,
    color: colors.grey.color01,
    textAlign: "center",
  },
});