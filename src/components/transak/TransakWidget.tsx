import React, { useState, useEffect, useRef } from "react";
import { 
  View, 
  StyleSheet, 
  TouchableOpacity, 
  Text, 
  Animated, 
  Dimensions 
} from "react-native";
import { TransakWebView, Environments, Events } from "@transak/react-native-sdk";
import { env } from '@/src/constants/AppConfig';

const { height: screenHeight } = Dimensions.get("window");

const styles = StyleSheet.create({
  overlay: {
    position: "absolute",
    top: 90, // Leave space on top
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "#FFF",
    zIndex: 9999,
  },
  closeButton: {
    position: "absolute",
    top: -50, // position relative to overlay top
    left: 0,  // span the full width
    right: 0,
    backgroundColor: "#FFF", // white background
    padding: 20,
    borderRadius: 15, // increased border radius
    zIndex: 10000, // ensure it's above the WebView
    alignItems: "center", // center the text horizontally
  },
  closeButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#EBC28E", // dark text for contrast
  },
});

interface TransakWidgetProps {
  visible: boolean;
  onClose?: () => void;
  configOverrides?: Record<string, any>;
}

const TransakWidget: React.FC<TransakWidgetProps> = ({
  visible,
  onClose,
  configOverrides = {},
}) => {
  // Internal visibility state so we control unmount timing
  const [isVisible, setIsVisible] = useState<boolean>(visible);
  // Animated value for sliding (initially offscreen at the bottom)
  const slideAnim = useRef(new Animated.Value(screenHeight)).current;

  const transakConfig = {
    apiKey: env.TRANSAK_API_KEY,
    environment: Environments.STAGING,
    partnerOrderId: "order-12345",
    walletAddress: "0x567bDc4086eFc460811798d1075a21359E34072d",
    fiatCurrency: "USD",
    defaultCryptoCurrency: "USDC",
    themeColor: "EBC28E", // beige
    exchangeScreenTitle: "PolyStream - Top Up",
    widgetHeight: "70%",
    widgetWidth: "100%",
    email: "",
    ...configOverrides,
  };

  // Centralized close handler which animates the widget down before hiding it
  const handleTransakClose = () => {
    Animated.timing(slideAnim, {
      toValue: screenHeight, // move offscreen (bottom)
      duration: 200,
      useNativeDriver: true,
    }).start(() => {
      setIsVisible(false);
      if (onClose) onClose();
    });
  };

  // Event handler for Transak events
  const onTransakEventHandler = (event: string, data: any) => {
    switch (event) {
      case Events.ORDER_CREATED:
      case Events.ORDER_PROCESSING:
      case Events.ORDER_COMPLETED:
        console.log(event, data);
        handleTransakClose();
        break;
      default:
        console.log("Transak Event:", event, data);
    }
  };

  // When the `visible` prop changes, animate the widget accordingly.
  useEffect(() => {
    if (visible) {
      setIsVisible(true);
      Animated.timing(slideAnim, {
        toValue: 0, // slide into view (translateY = 0)
        duration: 200,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: screenHeight,
        duration: 200,
        useNativeDriver: true,
      }).start(() => {
        setIsVisible(false);
      });
    }
  }, [visible, slideAnim]);

  if (!isVisible) {
    return null;
  }

  return (
    <Animated.View style={[styles.overlay, { transform: [{ translateY: slideAnim }] }]}>
      {/* Close Button */}
      <TouchableOpacity style={styles.closeButton} onPress={handleTransakClose}>
        <Text style={styles.closeButtonText}>Close</Text>
      </TouchableOpacity>

      {/* Transak WebView */}
      <TransakWebView
        transakConfig={transakConfig}
        onTransakEvent={onTransakEventHandler}
      />
    </Animated.View>
  );
};

export default TransakWidget;
