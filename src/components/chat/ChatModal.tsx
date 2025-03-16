import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  TextInput,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Keyboard
} from 'react-native';
import { colors } from '@/src/constants/Colors';
import { fonts } from '@/src/constants/Fonts';
import { images } from '@/src/constants/Images';
import ChatBubble from './ChatBubble';
import TypingIndicator from './TypingIndicator';
import { useChat } from '@/src/hooks/useChat';
import ConfirmationMessage from "@/src/components/chat/ConfirmationMessage";

interface ChatModalProps {
  visible: boolean;
  onClose?: () => void;
}

export default function ChatModal({ visible, onClose }: ChatModalProps) {
  const [message, setMessage] = useState('');
  const scrollViewRef = useRef<ScrollView>(null);
  const {
    messages,
    isLoading,
    sendMessage,
    clearChat,
    showConfirmation,
    pendingTransaction,
    handleConfirmTransaction,
    handleCancelTransaction
  } = useChat();

  // Scroll to bottom when messages change
  useEffect(() => {
    if (scrollViewRef.current && messages.length > 0) {
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages]);

  const handleSend = () => {
    if (message.trim()) {
      sendMessage(message);
      setMessage('');
      Keyboard.dismiss();
    }
  };

  // Filter out system message for display
  const displayMessages = messages.filter(msg => msg.role !== 'system');

  return (
    <Modal
      animationType="slide"
      transparent={false}
      visible={visible}
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 30 : 40}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.header}>
              <TouchableOpacity onPress={clearChat} style={styles.clearButton}>
                <Image source={images.bin} style={styles.binIcon} />
              </TouchableOpacity>
              <Text style={styles.headerTitle}>Polystream Assistant</Text>
              <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                <Image source={images.cross} style={styles.icon} />
              </TouchableOpacity>
            </View>

            <ScrollView
              ref={scrollViewRef}
              style={styles.messagesContainer}
              contentContainerStyle={styles.messagesContent}
              showsVerticalScrollIndicator={false}
            >
              {/* Welcome message */}
              {displayMessages.length === 0 && (
                <View style={styles.welcomeContainer}>
                  <Image
                    source={images.polystream_logo_trans}
                    style={styles.welcomeImage}
                    resizeMode="contain"
                  />
                  <Text style={styles.welcomeTitle}>
                    Hello, I'm your financial assistant.
                  </Text>
                  <Text style={styles.welcomeText}>
                    Ask me anything about cryptocurrency investments, yield strategies, or financial concepts.
                  </Text>
                </View>
              )}

              {/* Message bubbles */}
              {displayMessages.map((msg, index) => (
                msg.isConfirmation && msg.confirmationData ? (
                  <ConfirmationMessage
                    key={`msg-${msg.id || index}`}
                    riskLevel={msg.confirmationData.riskLevel}
                    amount={msg.confirmationData.amount}
                    onConfirm={() => {
                      handleConfirmTransaction();
                      onClose && onClose();
                    }}
                    onCancel={handleCancelTransaction}
                  />
                ) : (
                  msg.content ? 
                  <ChatBubble
                    key={`msg-${msg.id || index}`}
                    content={msg.content}
                    isUser={msg.role === 'user'}
                  />
                  :
                  <></>
                )
              ))}

              {/* Typing indicator */}
              {isLoading && <TypingIndicator />}
            </ScrollView>

            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Ask a question..."
                placeholderTextColor={colors.grey.color01}
                value={message}
                onChangeText={setMessage}
                multiline={true}
                maxLength={500}
              />
              <TouchableOpacity
                style={[styles.sendButton, !message.trim() && styles.sendButtonDisabled]}
                onPress={handleSend}
                disabled={!message.trim()}
              >
                <Image source={images.send} style={styles.sendIcon} />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    paddingBottom: 30,
    backgroundColor: colors.grey.white
  },
  modalContent: {
    flex: 1,
    backgroundColor: colors.grey.white
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: colors.grey.color04,
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  headerTitle: {
    fontFamily: fonts.primary.semibold,
    fontSize: 18,
    color: colors.black.primary,
  },
  closeButton: {
    padding: 8,
  },
  clearButton: {
    padding: 8,
  },
  icon: {
    width: 20,
    height: 20,
    tintColor: colors.beige.color01,
  },
  binIcon: {
    width: 24,
    height: 24,
    tintColor: colors.beige.color01,
  },
  messagesContainer: {
    flex: 1,
  },
  messagesContent: {
    padding: 16,
    paddingBottom: 20,
  },
  welcomeContainer: {
    alignItems: 'center',
    padding: 20,
    marginVertical: 20,
  },
  welcomeImage: {
    width: 100,
    height: 100,
    marginBottom: 20,
  },
  welcomeTitle: {
    fontFamily: fonts.primary.semibold,
    fontSize: 18,
    color: colors.black.primary,
    marginBottom: 10,
    textAlign: 'center',
  },
  welcomeText: {
    fontFamily: fonts.secondary.regular,
    fontSize: 14,
    color: colors.black.color02,
    textAlign: 'center',
    lineHeight: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: colors.grey.color04,
    backgroundColor: colors.grey.white,
  },
  input: {
    flex: 1,
    backgroundColor: colors.beige.color03,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    paddingRight: 40,
    maxHeight: 100,
    fontFamily: fonts.secondary.regular,
    fontSize: 16,
    color: colors.black.primary,
  },
  sendButton: {
    position: 'absolute',
    right: 24,
    bottom: 18,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.red.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: colors.grey.color02,
  },
  sendIcon: {
    width: 16,
    height: 16,
    tintColor: colors.grey.white,
  },
});
