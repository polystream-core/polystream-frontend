import React from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import Circle from './Circle';
import { colors } from '../constants/Colors';
import { Text } from 'react-native';
import { fonts } from '../constants/Fonts';

interface LoadingProps {
  message?: string;
}

export default function Loading({ message = 'Loading...' }: LoadingProps) {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <ActivityIndicator size="large" color={colors.red.primary} />
        <View style={styles.circlesContainer}>
          <Circle size={10} color={colors.cyan.color02} style={styles.circle} />
          <Circle size={10} color={colors.beige.color02} style={styles.circle} />
          <Circle size={10} color={colors.red.color02} style={styles.circle} />
        </View>
        <Text style={styles.text}>{message}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.beige.primary,
  },
  content: {
    alignItems: 'center',
  },
  circlesContainer: {
    flexDirection: 'row',
    marginTop: 20,
  },
  circle: {
    margin: 4,
  },
  text: {
    marginTop: 20,
    fontFamily: fonts.primary.regular,
    fontSize: 18,
    color: colors.black.primary,
    padding:2
  }
});
