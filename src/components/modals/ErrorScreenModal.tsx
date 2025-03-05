import React from 'react';
import { Modal, View, Text, StyleSheet, Pressable, Image } from 'react-native';
import { colors } from '@/src/constants/Colors';
import { fonts } from '@/src/constants/Fonts';
import { images } from '@/src/constants/Images';

interface ErrorScreenModalProps {
  visible: boolean;
  errorMessage?: string;
  onPress?: () => void;
}

export default function ErrorScreenModal({
  visible,
  errorMessage,
  onPress,
}: ErrorScreenModalProps) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Image 
            source={images.cross}
            style={styles.errorIcon}
            resizeMode="contain"
          />
          <Text style={styles.title}>Error encountered</Text>
          
          {errorMessage && (
            <Text style={styles.errorMessage}>{errorMessage}</Text>
          )}
          
          <Pressable
            style={styles.button}
            onPress={onPress}
          >
            <Text style={styles.buttonText}>Go back</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    width: '80%',
    backgroundColor: colors.beige.color03,
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    shadowColor: colors.black.primary,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 5,
  },
  errorIcon: {
    width: 60,
    height: 60,
    marginBottom: 16,
    tintColor: colors.red.primary,
  },
  title: {
    fontFamily: fonts.primary.semibold,
    fontSize: 20,
    color: colors.black.primary,
    marginBottom: 12,
    textAlign: 'center',
  },
  errorMessage: {
    fontFamily: fonts.primary.regular,
    fontSize: 14,
    color: colors.black.color02,
    textAlign: 'center',
    marginBottom: 24,
  },
  button: {
    backgroundColor: colors.grey.white,
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderWidth: 1,
    borderColor: colors.black.primary,
    marginTop: 8,
  },
  buttonText: {
    fontFamily: fonts.secondary.bold,
    fontSize: 16,
      color: colors.black.primary,
    textAlign: 'center',
  },
});
