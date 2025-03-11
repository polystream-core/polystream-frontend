import React from "react";
import {
  StyleSheet,
  TouchableOpacity,
  Text,
  Modal,
  View,
  SafeAreaView
} from "react-native";
import { TransakWebView, Events } from "@transak/react-native-sdk";
import {createTransakConfig} from "@/src/configs/TransakConfig";
import { colors } from "@/src/constants/Colors";
import { fonts } from "@/src/constants/Fonts";

interface TransakWidgetProps {
  visible: boolean;
  onClose?: () => void;
  walletAddress: string;
  configOverrides?: Record<string, any>;
}

const TransakWidget: React.FC<TransakWidgetProps> = ({
  visible,
  onClose,
  walletAddress,
  configOverrides = {},
}) => {
  // Event handler for Transak events
  const onTransakEventHandler = (event: string, data: any) => {
    switch (event) {
      case Events.ORDER_CREATED:
      case Events.ORDER_PROCESSING:
      case Events.ORDER_COMPLETED:
        // add transaction-related logic in useTransaction
        console.log(event, data);
        if (onClose) onClose();
        break;
      default:
        console.log("Transak Event:", event, data);
    }
  };

  return (
    <Modal
      animationType="slide"
      transparent={false}
      visible={visible}
      onRequestClose={onClose}
      presentationStyle="pageSheet"
    >
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.webViewContainer}>
          <TransakWebView
            transakConfig={createTransakConfig(walletAddress, configOverrides)}
            onTransakEvent={onTransakEventHandler}
          />
        </View>
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.grey.white,
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.grey.color03,
    backgroundColor: colors.grey.white,
  },
  closeButton: {
    paddingVertical: 8,
    alignItems: "center",
  },
  closeButtonText: {
    fontSize: 16,
    fontFamily: fonts.primary.medium,
    color: colors.beige.color01,
  },
  webViewContainer: {
    flex: 1,
  }
});

export default TransakWidget;
