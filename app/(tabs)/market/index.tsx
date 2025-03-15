import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  ImageSourcePropType,
} from "react-native";
import { colors } from "@/src/constants/Colors";
import { fonts } from "@/src/constants/Fonts";
import { router } from "expo-router";
import { images } from "@/src/constants/Images";
import ChatButton from "@/src/components/chat/ChatButton";
import ChatModal from "@/src/components/chat/ChatModal";

export default function MarketScreen() {
  const [chatVisible, setChatVisible] = useState(false);

  const getCrystalImage = (risk: string): ImageSourcePropType => {
    if (risk.toLowerCase().includes("low")) {
      return images.green_crystal;
    } else if (risk.toLowerCase().includes("medium")) {
      return images.yellow_crystal;
    } else if (risk.toLowerCase().includes("high")) {
      return images.red_crystal;
    }
    return images.green_crystal;
  };

  interface Strategy {
    id: number;
    name: string;
    apy: string;
    risk: string;
    poolSize: number;
    description: string;
    imageKey: "green_crystal" | "yellow_crystal" | "red_crystal";
  }

  const strategies: Strategy[] = [
    {
      id: 1,
      name: "Conservative Yield",
      apy: "3.50%",
      risk: "Low Risk",
      poolSize: 2500000,
      description: "This low-risk strategy focuses on stable yields through diversified lending protocols and blue-chip liquid staking derivatives. Perfect for those seeking capital preservation with modest returns.",
      imageKey: "green_crystal"
    },
    {
      id: 2,
      name: "Balanced Growth",
      apy: "5.75%",
      risk: "Medium Risk",
      poolSize: 1250000,
      description: "A balanced approach allocating capital across multiple DeFi protocols with moderate risk exposure. This strategy optimizes for consistent returns while adapting to changing market conditions.",
      imageKey: "yellow_crystal"
    },
    {
      id: 3,
      name: "Alpha Seeker",
      apy: "8.25%",
      risk: "High Risk",
      poolSize: 750000,
      description: "Our highest yield strategy leveraging advanced DeFi techniques including strategic position management and yield farming across emerging protocols with higher risk profiles for maximum returns.",
      imageKey: "red_crystal"
    },
  ];

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.pageTitle}>Market</Text>

        {strategies.map((strategy) => (
          <TouchableOpacity
            key={strategy.id}
            style={styles.strategyCard}
            onPress={() =>
              router.navigate({
                pathname: "/market/strategy-details",
                params: {
                  name: strategy.name,
                  apy: strategy.apy,
                  risk: strategy.risk,
                  poolSize: strategy.poolSize.toString(),
                  description: strategy.description,
                  imageKey: strategy.imageKey,
                  riskLevel: strategy.risk.toLowerCase().trim().split(" ")[0],
                },
              })
            }
          >
            <View style={styles.cardContentRow}>
              <View style={styles.coinImageContainer}>
                <Image
                  source={images[strategy.imageKey]}
                  style={styles.coinImage}
                  resizeMode="contain"
                />
              </View>
              <View style={styles.cardContentColumn}>
                <Text style={styles.strategyName}>{strategy.name}</Text>
                <Text style={styles.riskInfo}>
                  <Text style={styles.infoLabel}>Risk: </Text>
                  <Text style={styles.infoValue}>{strategy.risk}</Text>
                </Text>
              </View>
            </View>

            <View style={styles.cardContentColumn}>
              <Text style={styles.apyTitle}>Est. APY</Text>
              <Text style={styles.apyText}>{strategy.apy}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <View style={styles.decorativeElement}>
        <Image
          source={images.polystream_logo_trans}
          style={styles.backgroundLogo}
          resizeMode="contain"
        />
      </View>

      {/* Chat Button - Fixed position above tab bar */}
      <ChatButton onPress={() => setChatVisible(true)} />

      {/* Chat Modal */}
      <ChatModal
        visible={chatVisible}
        onClose={() => setChatVisible(false)}
      />
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
    zIndex: 1,
    paddingBottom: 120, // Add more padding at the bottom for the chat button
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
    color: colors.green.primary,
  },
  apyTitle: {
    fontFamily: fonts.primary.medium,
    fontSize: 13,
    color: colors.grey.color01,
  },
  coinImageContainer: {
    width: 50,
    height: 50,
    borderRadius: 50,
    marginRight: 16,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  coinImage: {
    width: 40,
    height: 40,
  },
  riskInfo: {
    fontFamily: fonts.primary.medium,
    fontSize: 13,
  },
  infoLabel: {
    color: colors.grey.color01,
  },
  infoValue: {
    color: colors.black.primary,
  },
  decorativeElement: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    opacity: 0.2,
    zIndex: 0,
    pointerEvents: 'none'
  },
  backgroundLogo: {
    position: "absolute",
    width: 200,
    height: 200,
    opacity: 0.4,
  }
});
