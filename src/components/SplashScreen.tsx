import React from 'react';
import { View, Image, StyleSheet, Text } from 'react-native';
import { colors } from '../constants/Colors';
import { images } from '../constants/Images';
import { fonts } from '../constants/Fonts';

export default function CustomSplashScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.contentContainer}>
        <Image 
          source={images.eth_crystal_floating} 
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.appName}>Polystream</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.beige.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentContainer: {
    alignItems: 'center',
  },
  logo: {
    width: 200,
    height: 200,
    marginBottom: 24,
  },
  appName: {
    fontFamily: fonts.primary.bold,
    fontSize: 36,
    color: colors.black.primary,
    letterSpacing: 1,
  },
});
