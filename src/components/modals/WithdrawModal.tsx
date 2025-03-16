import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Modal,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { colors } from "@/src/constants/Colors";
import { fonts } from "@/src/constants/Fonts";
import { images } from "@/src/constants/Images";
import { formatNumberWithCommas } from "@/src/utils/CustomFormatter";

interface VaultInfo {
  id: number;
  name: string;
  balance: number;
  imageKey: string;
}

interface WithdrawModalProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: (amount: number) => void;
  vaultInfo: VaultInfo | null;
  vaultCurrency: string;
}

export default function WithdrawModal({
  visible,
  onClose,
  onConfirm,
  vaultInfo,
  vaultCurrency,
}: WithdrawModalProps) {
  const [withdrawAmount, setWithdrawAmount] = React.useState("");

  React.useEffect(() => {
    // Reset withdraw amount when modal opens with new vault
    setWithdrawAmount("");
  }, [vaultInfo]);

  const handleWithdraw = () => {
    if (!vaultInfo) return;

    const amount = parseFloat(withdrawAmount);
    if (isNaN(amount) || amount <= 0) {
      console.log("Invalid amount");
      return;
    }

    onConfirm(amount);
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        style={styles.centeredView}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <View style={styles.modalView}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Withdraw</Text>
            <TouchableOpacity onPress={onClose}>
              <Image
                // source={images.close}
                style={styles.closeIcon}
                resizeMode="contain"
              />
            </TouchableOpacity>
          </View>

          {vaultInfo && (
            <>
              <View style={styles.modalVaultInfo}>
                <View style={styles.modalCrystalContainer}>
                  <Image
                    source={images[vaultInfo.imageKey as keyof typeof images]}
                    style={styles.modalCrystalImage}
                    resizeMode="contain"
                  />
                </View>
                <View>
                  <Text style={styles.modalVaultName}>{vaultInfo.name}</Text>
                  <View style={styles.modalBalanceContainer}>
                    <Text style={styles.modalBalanceLabel}>Available: </Text>
                    <Text style={styles.modalBalanceValue}>
                      {formatNumberWithCommas(vaultInfo.balance)}{" "}
                      {vaultCurrency}
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
                    onPress={() =>
                      setWithdrawAmount(vaultInfo.balance.toString())
                    }
                  >
                    <Text style={styles.maxButtonText}>MAX</Text>
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={onClose}
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
  );
}

const styles = StyleSheet.create({
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
    fontFamily: fonts.secondary.bold,
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