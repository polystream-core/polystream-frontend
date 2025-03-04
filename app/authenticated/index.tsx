import ActionBar from "@/src/components/ActionBar";
import { colors } from "@/src/constants/Colors";
import { fonts } from "@/src/constants/Fonts";
import { images } from "@/src/constants/Images";
import { View, Text, StyleSheet, Image } from "react-native";

const styles = StyleSheet.create({
  bg: {
    flex: 1,
    alignItems: "center",
    backgroundColor: colors.beige.color03,
  },
  topContainer: {
    width: "100%",
    height: "30%",
    borderEndEndRadius: "10%",
    borderEndStartRadius: "10%",
    justifyContent: "space-between",
    backgroundColor: colors.beige.color01,
    paddingBottom: "18%",
    flexDirection: "row",
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
  }
})

function HomeScreen() {
  return (
    <View style={styles.bg}>
      <View style={styles.topContainer}>
        <View style={styles.balanceContainer}>
          <Image source={images.guarded} style={styles.imageLogo} resizeMode="contain" />
          <Text style={styles.balanceCurrency}>USD </Text>
          <Text style={styles.balanceValue}>90,000</Text>
        </View>
        <Image source={images["eth-crystal"]} style={styles.topContainerImage} resizeMode="contain" />
      </View>
      <ActionBar actions={[
        { icon: images.add, label: "Add" },
        { icon: images.send, label: "Send" },
        { icon: images.details, label: "More" },
      ]} />
    </View>
  );
}

export default HomeScreen;
