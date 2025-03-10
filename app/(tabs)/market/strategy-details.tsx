import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { colors } from "@/src/constants/Colors";
import { fonts } from "@/src/constants/Fonts";
import { router } from "expo-router";

export default function StrategyDetails() {
  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.pageTitle}>Strategy Details</Text>
        <Text style={styles.detailLabel}>Strategy Name:</Text>
        <Text style={styles.detailValue}>Strategy 1</Text>
        <Text style={styles.detailLabel}>Estimated APY:</Text>
        <Text style={styles.detailValue}>5.00%</Text>
        <Text style={styles.detailLabel}>Risk:</Text>
        <Text style={styles.detailValue}>Medium</Text>
        <Text style={styles.detailDescription}>
          This strategy focuses on long-term growth with a balanced portfolio.
          It aims to provide steady returns through diversified investments.
        </Text>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Text style={styles.backButtonText}>Go Back</Text>
        </TouchableOpacity>
      </ScrollView>
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
  detailLabel: {
    fontFamily: fonts.primary.medium,
    fontSize: 16,
    color: colors.black.primary,
    marginTop: 12,
  },
  detailValue: {
    fontFamily: fonts.primary.semibold,
    fontSize: 18,
    color: colors.black.primary,
    marginBottom: 8,
  },
  detailDescription: {
    fontFamily: fonts.primary.medium,
    fontSize: 16,
    color: colors.grey.color01,
    marginVertical: 24,
  },
  backButton: {
    backgroundColor: colors.grey.white,
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 20,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: colors.black.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  backButtonText: {
    fontFamily: fonts.primary.bold,
    fontSize: 16,
    color: colors.black.primary,
  },
});
