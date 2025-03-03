import { Text, View, StyleSheet } from "react-native";
import { fonts } from "../src/constants/Fonts";
import { colors } from "../src/constants/Colors";
import { Link } from "expo-router";
import SignInPage from "./sign-in";

export default function Index() {
  return (
    <SignInPage />
  );
}

const styles = StyleSheet.create({
  baseText: {
    fontFamily: fonts.primary.bold,
    color: colors.beige.color01
  }
})
