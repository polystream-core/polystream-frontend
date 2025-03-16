import React, { useState, useCallback } from "react";
import {
  formatNumberWithCommas,
  resolveApyToString,
} from "@/src/utils/CustomFormatter";
import ActionBar from "@/src/components/ActionBar";
import VaultButton from "@/src/components/buttons/VaultButton";
import TransakWidget from "@/src/components/transak/TransakWidget";
import { colors } from "@/src/constants/Colors";
import { fonts } from "@/src/constants/Fonts";
import { images } from "@/src/constants/Images";
import { usePrivy } from "@privy-io/expo";
import { router } from "expo-router";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import SuccessPopup from "@/src/components/transak/SuccessPopup";
import { useUserInfo } from "@/src/hooks/useUserInfo";
import { useTransaction } from "@/src/hooks/useTransaction";

const styles = StyleSheet.create({
  bg: {
    flex: 1,
    alignItems: "center",
    backgroundColor: colors.beige.color03,
  },
  topContainer: {
    width: "100%",
    height: "25%",
    borderEndEndRadius: "10%",
    borderEndStartRadius: "10%",
    justifyContent: "space-between",
    backgroundColor: colors.beige.color01,
    paddingBottom: "18%",
    flexDirection: "row",
    zIndex: 1,
  },
  imageLogo: {
    height: 26,
    width: 24,
    paddingBottom: 6,
  },
  balanceContainer: {
    marginLeft: "6%",
    flexDirection: "row",
    // backgroundColor: colors.red.color01,
    alignItems: "flex-end",
  },
  balanceCurrency: {
    fontSize: 20,
    fontFamily: fonts.primary.semibold,
    paddingBottom: 5,
  },
  balanceValue: {
    fontFamily: fonts.primary.bold,
    fontSize: 40,
  },
  topContainerImage: {
    width: "30%",
    height: "80%",
    alignSelf: "flex-end",
    marginRight: "5%",
    // position: "absolute",
  },
  actionBarContainer: {
    alignSelf: "center",
    marginTop: -60, // Negative margin to overlap with topContainer
    zIndex: 2,
  },
  scrollViewContainer: {
    flex: 1,
    width: "100%",
    paddingTop: 0,
  },
  contentContainer: {
    alignItems: "center",
    paddingTop: 10,
    paddingBottom: 30,
  },
  refreshIndicator: {
    backgroundColor: "transparent",
  },
  // Add these to your existing styles object
  demoContainer: {
    backgroundColor: colors.grey.white,
    borderRadius: 16,
    padding: 20,
    marginTop: 24,
    marginBottom: 24,
    shadowColor: colors.black.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  demoTitle: {
    fontFamily: fonts.primary.semibold,
    fontSize: 18,
    color: colors.black.primary,
    marginBottom: 16,
  },
  demoButton: {
    backgroundColor: colors.green.primary,
    borderRadius: 12,
    height: 56,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  demoButtonText: {
    fontFamily: fonts.primary.bold,
    fontSize: 16,
    color: colors.grey.white,
  },
  demoText: {
    fontFamily: fonts.secondary.regular,
    fontSize: 12,
    color: colors.grey.color01,
    textAlign: "center",
    lineHeight: 16,
  },
  demoButtonDisabled: {
    backgroundColor: colors.green.primary,
    opacity: 0.7,
  },
  // New styles for toggle container
  toggleContainer: {
    backgroundColor: colors.grey.white,
    borderRadius: 16,
    padding: 16,
    marginTop: 24,
    marginBottom: 0,
    shadowColor: colors.black.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  toggleTitle: {
    fontFamily: fonts.primary.semibold,
    fontSize: 18,
    color: colors.black.primary,
  },
});

function PortfolioScreen() {
  const [showTransak, setShowTransak] = useState(false);
  const [showTopUpSuccessPopup, setShowTopUpSuccessPopup] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [showYieldSimulation, setShowYieldSimulation] = useState(false);
  const {
    totalBalance,
    accountBalance,
    accountStatus,
    accountApy,
    vaultBalance,
    vaultStatus,
    vaultApy,
    refreshUserInfo,
    embeddedWalletAddress,
  } = useUserInfo();
  const [isSimulating, setIsSimulating] = useState(false);

  const handleTransakClose = () => {
    setShowTransak(false);
    setShowTopUpSuccessPopup(true);
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      await refreshUserInfo();
      console.log("Data refreshed!");
    } catch (error) {
      console.error("Error refreshing data:", error);
    } finally {
      setRefreshing(false);
    }
  }, []);

  const toggleYieldSimulation = () => {
    setShowYieldSimulation(!showYieldSimulation);
  };

  return (
    <View style={styles.bg}>
      <View style={styles.topContainer}>
        <View style={styles.balanceContainer}>
          <Image
            source={images.guarded}
            style={styles.imageLogo}
            resizeMode="contain"
          />
          <Text style={styles.balanceCurrency}>USD </Text>
          <Text style={styles.balanceValue}>
            {formatNumberWithCommas(totalBalance)}
          </Text>
        </View>
        <Image
          source={images["eth_crystal"]}
          style={styles.topContainerImage}
          resizeMode="contain"
        />
      </View>

      <View style={styles.actionBarContainer}>
        <ActionBar
          actions={[
            {
              icon: images.add,
              label: "Add",
              onPress: () => {
                console.log("Add pressed");
                setShowTransak(true);
              },
            },
            {
              icon: images.send,
              label: "Send",
              onPress: () => console.log("Send pressed"),
            },
            {
              icon: images.details,
              label: "More",
              onPress: () => console.log("More pressed"),
            },
          ]}
        />
      </View>

      <ScrollView
        style={styles.scrollViewContainer}
        contentContainerStyle={styles.contentContainer}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            style={styles.refreshIndicator}
          />
        }
      >
        <VaultButton
          vaultName="Wallet"
          balance={accountBalance}
          currency="USD"
          notes={resolveApyToString(accountApy)}
          status={accountStatus}
          imageSrc={images.eth_crystal_floating}
          onPress={() => console.log("Vault button pressed")}
        />
        <VaultButton
          vaultName="Polystream Vault"
          balance={vaultBalance}
          currency="USD"
          notes={resolveApyToString(vaultApy)}
          status={vaultStatus}
          imageSrc={images.scroll_media_4}
          onPress={() => {
            console.log("Vault button pressed");
            router.navigate("/portfolio/polystream-vault");
          }}
        />

        {/* Toggle container for yield simulation */}
        <TouchableOpacity 
          style={styles.toggleContainer} 
          onPress={toggleYieldSimulation}
        >
          <Text style={styles.toggleTitle}>Yield Simulation</Text>
        </TouchableOpacity>

        {/* Yield Simulation Section - Only shown when toggled */}
        {showYieldSimulation && (
          <View style={styles.demoContainer}>
            <TouchableOpacity
              style={[styles.demoButton, isSimulating && styles.demoButtonDisabled]}
              disabled={isSimulating}
              onPress={async () => {
                try {
                  // Set loading state to true
                  setIsSimulating(true);

                  // Advance time by 200 days (to match your test)
                  await advanceTime(200);

                  // Harvest rewards
                  await harvestRewards();

                  // Refresh balances
                  await refreshUserInfo();
                } catch (error) {
                  console.error("Simulation error:", error);
                } finally {
                  // Set loading state back to false when done
                  setIsSimulating(false);
                }
              }}
            >
              {isSimulating ? (
                <ActivityIndicator color={colors.grey.white} size="small" />
              ) : (
                <Text style={styles.demoButtonText}>Fast-forward 200 days</Text>
              )}
            </TouchableOpacity>
            <Text style={styles.demoText}>
              Simulates passing 200 days to demonstrate yield generation
            </Text>
          </View>
        )}
      </ScrollView>

      {showTransak && (
        <TransakWidget
          visible={showTransak}
          onClose={handleTransakClose}
          walletAddress={walletAddress}
        />
      )}

      {/* Render the SuccessPopup when showPopup is true */}
      {showTopUpSuccessPopup && (
        <SuccessPopup
          visible={showTopUpSuccessPopup}
          onClose={() => setShowTopUpSuccessPopup(false)}
        />
      )}
    </View>
  );
}

export default PortfolioScreen;