import { formatNumberWithCommas } from "@/src/utils/numberToText";
import ActionBar from "@/src/components/ActionBar";
import VaultButton from "@/src/components/buttons/VaultButton";
import { colors } from "@/src/constants/Colors";
import { fonts } from "@/src/constants/Fonts";
import { images } from "@/src/constants/Images";
import { usePrivy } from "@privy-io/expo";
import { router } from "expo-router";
import { View, Text, StyleSheet, Image, ScrollView } from "react-native";

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
    alignSelf: 'center',
    marginTop: -60, // Negative margin to overlap with topContainer
    zIndex: 2,
  },
  scrollViewContainer: {
    flex: 1,
    width: '100%',
    paddingTop: 0,
  },
  contentContainer: {
    alignItems: 'center',
    paddingTop: 10,
    paddingBottom: 30
  },
})

function HomeScreen() {
  const {logout} = usePrivy();

  return (
    <View style={styles.bg}>
      <View style={styles.topContainer}>
        <View style={styles.balanceContainer}>
          <Image source={images.guarded} style={styles.imageLogo} resizeMode="contain" />
          <Text style={styles.balanceCurrency}>USD </Text>
          <Text style={styles.balanceValue}>{formatNumberWithCommas(90000)}</Text>
        </View>
        <Image source={images["eth_crystal"]} style={styles.topContainerImage} resizeMode="contain" />
      </View>

      <View style={styles.actionBarContainer}>
        <ActionBar actions={[
          { icon: images.add, label: "Add", onPress: () => console.log("Add pressed") },
          { icon: images.send, label: "Send", onPress: () => console.log("Send pressed") },
          { icon: images.log_out, label: "Log out", onPress: () => logout() },
        ]} />
      </View>

      <ScrollView style={styles.scrollViewContainer} contentContainerStyle={styles.contentContainer}>
        <VaultButton
          vaultName='Wallet'
          balance={90000}
          currency='USD'
          notes='+5.2% APY'
          status='inactive'
          imageSrc={images.eth_crystal_floating}
          onPress={() => console.log('Vault button pressed')}
        ></VaultButton>
        <VaultButton
          vaultName='Polystream Vault'
          balance={82000}
          currency='USD'
          notes='+69.2% APY'
          status='active'
          imageSrc={images.scroll_media_4}
          onPress={() => {
            console.log('Vault button pressed')
            router.navigate('/authenticated/polystream-vault')
          }}
        ></VaultButton>
      </ScrollView>
    </View>
  );
}

export default HomeScreen;
