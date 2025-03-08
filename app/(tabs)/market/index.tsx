import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { colors } from "@/src/constants/Colors";
import { fonts } from "@/src/constants/Fonts";

export default function MarketScreen() {
  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.pageTitle}>Market</Text>

        {/* Market content will go here */}
        <View style={styles.placeholderCard}>
          <Text style={styles.placeholderText}>Market data coming soon</Text>
        </View>
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
  placeholderCard: {
    backgroundColor: colors.grey.white,
    borderRadius: 16,
    padding: 24,
    shadowColor: colors.black.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    alignItems: 'center',
    justifyContent: 'center',
    height: 200,
  },
  placeholderText: {
    fontFamily: fonts.primary.medium,
    fontSize: 18,
    color: colors.grey.color02,
  }
});
