import React, { useEffect, useRef } from "react";
import { Animated, StyleSheet, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface SuccessPopupProps {
  visible: boolean;
  onClose?: () => void;
}

const SuccessPopup: React.FC<SuccessPopupProps> = ({ visible, onClose }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      // Fade in to 0.8 opacity
      Animated.timing(fadeAnim, {
        toValue: 0.9,
        duration: 500,
        useNativeDriver: true,
      }).start(() => {
        // Stay visible for 2 seconds, then fade out
        setTimeout(() => {
          Animated.timing(fadeAnim, {
            toValue: 0,
            duration: 500,
            useNativeDriver: true,
          }).start(() => {
            if (onClose) onClose();
          });
        }, 2000);
      });
    }
  }, [visible, fadeAnim, onClose]);

  if (!visible) {
    return null;
  }

  return (
    <Animated.View style={[styles.popup, { opacity: fadeAnim }]}>
      <Ionicons name="checkmark-circle" size={36} color="#28a745" />
      <Text style={styles.popupText}>Successfully added money!</Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  popup: {
    position: "absolute",
    top: "50%",
    left: "50%",
    width: 170,
    height: 150,
    backgroundColor: "#EBC28E", // beige theme
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 10000, // ensure it's in front
    transform: [{ translateX: -85 }, { translateY: -75 }], // centers the view
    // Shadow for iOS
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 5,
    // Elevation for Android
    elevation: 5,
  },
  popupText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    textAlign: "center",
    marginTop: 8,
  },
});

export default SuccessPopup;
