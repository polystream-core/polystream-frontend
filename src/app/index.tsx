import { Text, View, StyleSheet } from "react-native";
import { fonts } from "../constants/Fonts";
import { colors } from "../constants/Colors";

export default function Index() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: colors.beige.color03
      }}
    >
      <Text style={styles.baseText}>Edit app/index.tsx to edit this screen.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  baseText: {
    fontFamily: fonts.primary.bold,
    color: colors.beige.color01
  }
})
