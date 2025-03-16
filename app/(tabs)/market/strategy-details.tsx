import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  SafeAreaView,
} from "react-native";
import { colors } from "@/src/constants/Colors";
import { fonts } from "@/src/constants/Fonts";
import { router, useLocalSearchParams } from "expo-router";
import { images } from "@/src/constants/Images";
import { formatNumberWithCommas } from "@/src/utils/CustomFormatter";
import { useTransaction } from "@/src/hooks/useTransaction";
import { useUserInfo } from "@/src/hooks/useUserInfo";
import Toast from "react-native-toast-message";

export default function StrategyDetails() {
  // Get the parameters from the URL
  const {
    name = "Strategy Details",
    apy = "5.00%",
    risk = "Medium Risk",
    poolSize: poolSizeStr = "1250000",
    description = "This strategy optimizes yield by allocating funds across multiple DeFi protocols.",
    imageKey = "yellow_crystal",
  } = useLocalSearchParams();
  const { transferWalletToVault, transferVaultToWallet } = useTransaction();
  const { accountBalance, vaultBalance, refreshUserInfo, fetchAccountBalance, fetchVaultBalance } = useUserInfo();
  const [stakeAmount, setStakeAmount] = useState("");

  // Convert poolSize from string to number
  const poolSize = parseInt(poolSizeStr as string, 10) || 1250000;

  // Calculate daily yield
  const dailyYield = stakeAmount
    ? (
        (parseFloat(stakeAmount) * (parseFloat(apy as string) / 100)) /
        365
      ).toFixed(2)
    : "0.00";

    const handleStake = () => {
      console.log(`Staking ${stakeAmount} in ${name}`);
    
      if (!stakeAmount) {
        console.error("Please enter a valid stake amount");
        return;
      }
    
      // Show initial staking toast notification at the top with orange color
      Toast.show({
        type: "info",
        text1: "Staking in progress",
        text2: `Staking ${stakeAmount} tokens...`,
        position: "top",
        visibilityTime: 20000,
        props: {
          backgroundColor: "#e49b13" // Customize for orange background
        }
      });
    
      // Start the transfer but don't wait for it
      transferWalletToVault(parseFloat(stakeAmount))
        .then(() => {
          console.log("Transfer complete, refreshing user info...");
          return Promise.all([fetchVaultBalance(), fetchAccountBalance()]);
        })
        .then(() => {
          // Show success toast when everything is done
          Toast.show({
            type: "success",
            text1: "Staking successful",
            text2: `Successfully staked ${stakeAmount} tokens`,
            position: "top",
            visibilityTime: 6000, // Show for 6 seconds
            props: {
              backgroundColor: colors.green.primary // Green background
            }
          });
        })
        .catch((error) => {
          console.error("Error during stake process:", error);
          Toast.show({
            type: "error",
            text1: "Staking failed",
            text2: "There was an error processing your stake",
            position: "top",
            visibilityTime: 6000, // Show for 6 seconds
            props: {
              backgroundColor: colors.red.primary // Red background
            }
          });
        });
    
      // Navigate to portfolio immediately
      router.push("/portfolio");
    };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
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
          <Text style={styles.pageTitle}>{name}</Text>
        </View>

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Strategy Card */}
          <View style={styles.strategyCard}>
            <View style={styles.cardHeader}>
              <View style={styles.crystalContainer}>
                <Image
                  source={
                    images[imageKey as keyof typeof images] ||
                    images.yellow_crystal
                  }
                  style={styles.crystalImage}
                  resizeMode="contain"
                />
              </View>
              <View style={styles.headerInfo}>
                <Text style={styles.strategyName}>{name}</Text>
                <Text style={styles.riskText}>{risk}</Text>
              </View>
            </View>

            {/* Strategy Stats */}
            <View style={styles.statsContainer}>
              <View style={styles.statItem}>
                <Text style={styles.statLabel}>Estimated APY</Text>
                <Text style={styles.statValueHighlight}>{apy}</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statLabel}>Pool Size</Text>
                <Text style={styles.statValue}>
                  ${formatNumberWithCommas(poolSize)}
                </Text>
              </View>
            </View>

            <View style={styles.separator} />

            {/* Description */}
            <Text style={styles.descriptionTitle}>Strategy Description</Text>
            <Text style={styles.descriptionText}>{description}</Text>
          </View>

          {/* Staking Section */}
          <View style={styles.stakeContainer}>
            <Text style={styles.stakeTitle}>Stake Amount</Text>

            <View style={styles.inputContainer}>
              <Text style={styles.currencySymbol}>$</Text>
              <TextInput
                style={styles.input}
                value={stakeAmount}
                onChangeText={setStakeAmount}
                keyboardType="numeric"
                placeholder="0.00"
                placeholderTextColor={colors.grey.color01}
              />
              <TouchableOpacity
                style={styles.maxButton}
                onPress={() => setStakeAmount(accountBalance.toString())} // Example max amount
              >
                <Text style={styles.maxButtonText}>MAX</Text>
              </TouchableOpacity>
            </View>

            {/* Yield Preview */}
            <View style={styles.yieldPreviewContainer}>
              <Text style={styles.yieldPreviewTitle}>
                Estimated Daily Yield
              </Text>
              <Text style={styles.yieldPreviewValue}>${dailyYield}</Text>
            </View>

            {/* Stake Button */}
            <TouchableOpacity style={styles.stakeButton} onPress={handleStake}>
              <Text style={styles.stakeButtonText}>Stake Now</Text>
            </TouchableOpacity>

            <Text style={styles.disclaimer}>
              Note: Staked funds are subject to a 30-day lock period. Early
              withdrawal may incur fees.
            </Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
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
    paddingBottom: 80,
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
  strategyCard: {
    backgroundColor: colors.grey.white,
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    shadowColor: colors.black.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  crystalContainer: {
    width: 60,
    height: 60,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  crystalImage: {
    width: 50,
    height: 50,
  },
  headerInfo: {
    flex: 1,
  },
  strategyName: {
    fontFamily: fonts.primary.bold,
    fontSize: 20,
    color: colors.black.primary,
    marginBottom: 4,
  },
  riskText: {
    fontFamily: fonts.secondary.medium,
    fontSize: 14,
    color: colors.grey.color01,
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 16,
  },
  statItem: {
    flex: 1,
  },
  statLabel: {
    fontFamily: fonts.secondary.regular,
    fontSize: 14,
    color: colors.grey.color01,
    marginBottom: 4,
  },
  statValue: {
    fontFamily: fonts.primary.semibold,
    fontSize: 18,
    color: colors.black.primary,
  },
  statValueHighlight: {
    fontFamily: fonts.primary.bold,
    fontSize: 18,
    color: colors.green.primary,
  },
  separator: {
    height: 1,
    backgroundColor: colors.grey.color03,
    marginVertical: 16,
  },
  descriptionTitle: {
    fontFamily: fonts.primary.semibold,
    fontSize: 16,
    color: colors.black.primary,
    marginBottom: 8,
  },
  descriptionText: {
    fontFamily: fonts.secondary.regular,
    fontSize: 14,
    color: colors.grey.color01,
    lineHeight: 20,
  },
  stakeContainer: {
    backgroundColor: colors.grey.white,
    borderRadius: 16,
    padding: 20,
    shadowColor: colors.black.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  stakeTitle: {
    fontFamily: fonts.primary.semibold,
    fontSize: 18,
    color: colors.black.primary,
    marginBottom: 16,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.beige.color03,
    borderRadius: 8,
    height: 60,
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  currencySymbol: {
    fontFamily: fonts.primary.semibold,
    fontSize: 18,
    color: colors.black.primary,
    marginRight: 8,
  },
  input: {
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
  yieldPreviewContainer: {
    backgroundColor: colors.beige.color02,
    borderRadius: 8,
    padding: 16,
    marginBottom: 24,
  },
  yieldPreviewTitle: {
    fontFamily: fonts.secondary.regular,
    fontSize: 14,
    color: colors.grey.color01,
    marginBottom: 4,
  },
  yieldPreviewValue: {
    fontFamily: fonts.primary.bold,
    fontSize: 24,
    color: colors.black.primary,
  },
  stakeButton: {
    backgroundColor: colors.black.primary,
    borderRadius: 12,
    height: 56,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  stakeButtonText: {
    fontFamily: fonts.primary.bold,
    fontSize: 16,
    color: colors.grey.white,
  },
  disclaimer: {
    fontFamily: fonts.secondary.regular,
    fontSize: 12,
    color: colors.grey.color01,
    textAlign: "center",
    lineHeight: 16,
  },
});
