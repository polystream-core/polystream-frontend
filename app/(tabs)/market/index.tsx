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

export default function MarketScreen() {
  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.pageTitle}>Market</Text>

        {/* Market content will go here */}
        <TouchableOpacity
          style={styles.strategyCard}
          onPress={() => router.navigate("/market/strategy-details")}
        >
          <View style={styles.cardContentRow}>
            <View style={styles.coinImage}></View>
            <View style={styles.cardContentColumn}>
              <Text style={styles.strategyName}>Strategy 1</Text>
              <Text style={styles.apyTitle}>Risk</Text>
            </View>
          </View>
          <View style={styles.cardContentColumn}>
            <Text style={styles.apyTitle}>Est. APY</Text>
            <Text style={styles.apyText}>5.00%</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.strategyCard}>
          <View style={styles.cardContentRow}>
            <View style={styles.coinImage}></View>
            <View style={styles.cardContentColumn}>
              <Text style={styles.strategyName}>Strategy 1</Text>
              <Text style={styles.apyTitle}>Risk</Text>
            </View>
          </View>
          <View style={styles.cardContentColumn}>
            <Text style={styles.apyTitle}>Est. APY</Text>
            <Text style={styles.apyText}>5.00%</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.strategyCard}>
          <View style={styles.cardContentRow}>
            <View style={styles.coinImage}></View>
            <View style={styles.cardContentColumn}>
              <Text style={styles.strategyName}>Strategy 1</Text>
              <Text style={styles.apyTitle}>Risk</Text>
            </View>
          </View>
          <View style={styles.cardContentColumn}>
            <Text style={styles.apyTitle}>Est. APY</Text>
            <Text style={styles.apyText}>5.00%</Text>
          </View>
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
  strategyCard: {
    backgroundColor: colors.grey.white,
    borderRadius: 16,
    marginVertical: 12,
    padding: 24,
    shadowColor: colors.black.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    alignItems: "center",
    justifyContent: "space-between",
    height: 130,
    display: "flex",
    flexDirection: "row",
  },
  cardContentColumn: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "flex-start",
  },
  cardContentRow: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  strategyName: {
    fontFamily: fonts.primary.semibold,
    fontSize: 18,
    color: colors.black.primary,
    marginBottom: 8,
  },
  apyText: {
    fontFamily: fonts.primary.medium,
    fontSize: 18,
    color: "#00C853",
  },
  apyTitle: {
    fontFamily: fonts.primary.medium,
    fontSize: 13,
    color: colors.grey.color01,
  },
  coinImage: {
    width: 50,
    height: 50,
    borderRadius: 50,
    backgroundColor: colors.beige.color01,
    marginRight: 16,
  },
});
