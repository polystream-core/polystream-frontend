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

export default function StrategyDetails() {
  // Get the parameters from the URL
  const {
    name = "Strategy Details",
    apy = "5.00%",
    risk = "Medium Risk",
  } = useLocalSearchParams();

  const [stakeAmount, setStakeAmount] = useState("");

  // Mock data - in a real app, this would come from your backend
  const poolSize = 1250000;
  const dailyYield = stakeAmount
    ? (
        (parseFloat(stakeAmount) * (parseFloat(apy as string) / 100)) /
        365
      ).toFixed(2)
    : "0.00";

  const handleStake = () => {
    // Implement your staking logic here
    console.log(`Staking ${stakeAmount} in ${name}`);
    // Navigate to confirmation page or show a success modal
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
                    (risk as string).toLowerCase().includes("low")
                      ? images.green_crystal
                      : (risk as string).toLowerCase().includes("medium")
                      ? images.yellow_crystal
                      : images.red_crystal
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
            <Text style={styles.descriptionText}>
              This strategy optimizes yield by allocating funds across multiple
              DeFi protocols, balancing risk and reward to achieve consistent
              returns. The portfolio is rebalanced regularly to adapt to changing
              market conditions.
            </Text>
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
                onPress={() => setStakeAmount("1000")} // Example max amount
              >
                <Text style={styles.maxButtonText}>MAX</Text>
              </TouchableOpacity>
            </View>

            {/* Yield Preview */}
            <View style={styles.yieldPreviewContainer}>
              <Text style={styles.yieldPreviewTitle}>Estimated Daily Yield</Text>
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
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
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
    position: 'relative',
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
    color: "#00C853",
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