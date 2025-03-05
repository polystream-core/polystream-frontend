import React, { useState, useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  ScrollView
} from 'react-native';
import { colors } from '@/src/constants/Colors';
import { fonts } from '@/src/constants/Fonts';

interface InputField {
  id: string;
  fieldName: string;
  value: string;
  placeholder?: string;
  keyboardType?: 'default' | 'number-pad' | 'decimal-pad' | 'numeric' | 'email-address' | 'phone-pad';
  secureTextEntry?: boolean;
  required?: boolean; // New field to mark if input is required
}

interface TextInputModalProps {
  visible: boolean;
  title: string;
  fields: InputField[];
  onSubmit: (fields: InputField[]) => void;
  onClose: () => void;
}

export default function TextInputModal({
  visible,
  title,
  fields,
  onSubmit,
  onClose,
}: TextInputModalProps) {
  const [inputFields, setInputFields] = useState<InputField[]>(fields);
  const [invalidFields, setInvalidFields] = useState<string[]>([]);
  const [hasAttemptedSubmit, setHasAttemptedSubmit] = useState(false);

  // Reset input fields when modal opens with new fields
  useEffect(() => {
    if (visible) {
      setInputFields([...fields]);
      setInvalidFields([]);
      setHasAttemptedSubmit(false);
    }
  }, [visible, fields]);

  const handleInputChange = (text: string, fieldId: string) => {
    const updatedFields = inputFields.map(field =>
      field.id === fieldId ? { ...field, value: text } : field
    );
    setInputFields(updatedFields);

    // If we've attempted to submit already, re-validate this field
    if (hasAttemptedSubmit) {
      validateField(fieldId, text);
    }
  };

  const validateField = (fieldId: string, value: string) => {
    const field = inputFields.find(f => f.id === fieldId);

    if (field?.required && value.trim() === '') {
      if (!invalidFields.includes(fieldId)) {
        setInvalidFields(prev => [...prev, fieldId]);
      }
      return false;
    } else {
      setInvalidFields(prev => prev.filter(id => id !== fieldId));
      return true;
    }
  };

  const validateAllFields = () => {
    const newInvalidFields: string[] = [];

    inputFields.forEach(field => {
      if (field.required && field.value.trim() === '') {
        newInvalidFields.push(field.id);
      }
    });

    setInvalidFields(newInvalidFields);
    return newInvalidFields.length === 0;
  };

  const clearInput = (fieldId: string) => {
    handleInputChange('', fieldId);
  };

  const handleSubmit = () => {
    setHasAttemptedSubmit(true);

    if (validateAllFields()) {
      onSubmit(inputFields);
      onClose();
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.centeredView}
      >
        <Pressable
          style={styles.backdrop}
          onPress={onClose}
        />
        <View style={styles.modalView}>
          <Text style={styles.modalTitle}>{title}</Text>

          <ScrollView style={styles.textInputView} showsVerticalScrollIndicator={false} scrollEnabled={false}>
            {inputFields.map((field, index) => {
              const isInvalid = invalidFields.includes(field.id);

              return (
                <View key={field.id} style={[
                  styles.inputContainer,
                  index < inputFields.length - 1 && styles.inputContainerWithMargin
                ]}>
                  <View style={styles.labelContainer}>
                    <Text style={styles.fieldLabel}>
                      {field.fieldName}
                      {field.required && <Text style={styles.requiredMark}> *</Text>}
                    </Text>
                    {isInvalid && (
                      <Text style={styles.errorText}>Required</Text>
                    )}
                  </View>
                  <View style={[
                    styles.inputWrapper,
                    isInvalid && styles.inputWrapperError
                  ]}>
                    <TextInput
                      style={styles.textInput}
                      value={field.value}
                      onChangeText={(text) => handleInputChange(text, field.id)}
                      placeholder={field.placeholder || 'Enter value'}
                      placeholderTextColor={colors.black.color02}
                      keyboardType={field.keyboardType || 'default'}
                      secureTextEntry={field.secureTextEntry}
                      autoFocus={index === 0}
                    />
                    {field.value.length > 0 && (
                      <Pressable
                        onPress={() => clearInput(field.id)}
                        style={styles.clearButton}
                      >
                        <Text style={styles.clearButtonText}>✕</Text>
                      </Pressable>
                    )}
                  </View>
                </View>
              );
            })}
          </ScrollView>

          <View style={styles.buttonContainer}>
            <Pressable
              style={[styles.button, styles.cancelButton]}
              onPress={onClose}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </Pressable>
            <Pressable
              style={[styles.button, styles.submitButton]}
              onPress={handleSubmit}
            >
              <Text style={styles.submitButtonText}>Submit</Text>
            </Pressable>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    width: '85%',
    maxHeight: '85%',
    backgroundColor: colors.grey.white,
    borderRadius: 16,
    padding: 24,
    shadowColor: colors.black.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 5,
  },
  modalTitle: {
    fontFamily: fonts.primary.semibold,
    fontSize: 24,
    color: colors.black.primary,
    marginBottom: 20,
    textAlign: 'center',
  },
  textInputView: {
    maxHeight: 400,
  },
  inputContainer: {
    width: '100%',
  },
  inputContainerWithMargin: {
    marginBottom: 20,
  },
  labelContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  fieldLabel: {
    fontFamily: fonts.secondary.medium,
    fontSize: 16,
    color: colors.black.primary,
  },
  requiredMark: {
    color: '#E53935',
    fontFamily: fonts.secondary.bold,
  },
  errorText: {
    fontSize: 12,
    fontFamily: fonts.secondary.medium,
    color: '#E53935',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.black.color02,
    borderRadius: 8,
    backgroundColor: colors.beige.color03,
  },
  inputWrapperError: {
    borderColor: '#E53935',
    borderWidth: 2,
    backgroundColor: 'rgba(229, 57, 53, 0.05)',
  },
  textInput: {
    flex: 1,
    height: 50,
    paddingHorizontal: 16,
    fontFamily: fonts.secondary.regular,
    fontSize: 16,
    color: colors.black.primary,
  },
  clearButton: {
    padding: 10,
    marginRight: 6,
  },
  clearButtonText: {
    fontSize: 16,
    color: colors.black.color02,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 24,
  },
  button: {
    flex: 1,
    height: 50,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: colors.grey.color04,
    marginRight: 8,
    borderWidth: 1,
    borderColor: colors.grey.color03,
  },
  submitButton: {
    backgroundColor: colors.beige.primary,
    marginLeft: 8,
    borderWidth: 1,
    borderColor: colors.beige.color01,
  },
  cancelButtonText: {
    fontFamily: fonts.primary.semibold,
    fontSize: 16,
    color: colors.black.color02,
  },
  submitButtonText: {
    fontFamily: fonts.primary.semibold,
    fontSize: 16,
    color: colors.black.primary,
  },
});
