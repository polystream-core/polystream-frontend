import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '@/src/constants/Colors';
import { fonts } from '@/src/constants/Fonts';

interface ChatBubbleProps {
  content: string;
  isUser: boolean;
}

export default function ChatBubble({ content, isUser }: ChatBubbleProps) {
  return (
    <View style={[
      styles.container, 
      isUser ? styles.userContainer : styles.assistantContainer
    ]}>
      <Text style={[
        styles.text,
        isUser ? styles.userText : styles.assistantText
      ]}>
        {content}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    maxWidth: '80%',
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginVertical: 6,
    shadowColor: colors.black.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  userContainer: {
    alignSelf: 'flex-end',
    backgroundColor: colors.cyan.color03,
    borderBottomRightRadius: 4,
    borderColor: colors.cyan.color02,
    borderWidth: 1,
  },
  assistantContainer: {
    alignSelf: 'flex-start',
    backgroundColor: colors.beige.color02,
    borderBottomLeftRadius: 4,
    borderColor: colors.beige.color01,
    borderWidth: 1,
  },
  text: {
    fontSize: 16,
    lineHeight: 22,
  },
  userText: {
    fontFamily: fonts.secondary.medium,
    color: colors.black.primary,
  },
  assistantText: {
    fontFamily: fonts.secondary.regular,
    color: colors.black.primary,
  },
});
