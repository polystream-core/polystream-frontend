import React from 'react';
import { TouchableOpacity, Text, StyleSheet, Image } from 'react-native';
import { colors } from '@/src/constants/Colors';
import { fonts } from '@/src/constants/Fonts';
import { images } from '@/src/constants/Images';

interface ChatButtonProps {
  onPress: () => void;
}

export default function ChatButton({ onPress }: ChatButtonProps) {
  return (
    <TouchableOpacity style={styles.button} onPress={onPress} activeOpacity={0.8}>
      <Image 
        source={images.polystream_logo_trans} 
        style={styles.chatIcon}
        resizeMode="contain"
      />
      <Text style={styles.text}>Ask Assistant</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    position: 'absolute',
    bottom: 120, // Position above the tab bar
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.beige.color01,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 30,
    shadowColor: colors.black.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
    zIndex: 100,
  },
  chatIcon: {
    width: 20,
    height: 20,
    marginRight: 8,
    tintColor: colors.black.primary,
  },
  text: {
    fontFamily: fonts.primary.semibold,
    fontSize: 16,
    color: colors.black.primary,
  }
});
