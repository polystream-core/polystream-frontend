import React, { useEffect } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { colors } from '@/src/constants/Colors';

export default function TypingIndicator() {
  const animations = [
    useAnimatedDot(0),
    useAnimatedDot(500),
    useAnimatedDot(1000),
  ];

  return (
    <View style={styles.container}>
      {animations.map((animation, index) => (
        <Animated.View
          key={`dot-${index}`}
          style={[
            styles.dot,
            {
              transform: [{ translateY: animation }]
            }
          ]}
        />
      ))}
    </View>
  );
}

function useAnimatedDot(delay: number) {
  const animation = new Animated.Value(0);
  
  useEffect(() => {
    const startAnimation = () => {
      Animated.sequence([
        Animated.timing(animation, {
          toValue: -5,
          duration: 300,
          delay,
          useNativeDriver: true,
        }),
        Animated.timing(animation, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start(() => startAnimation());
    };

    startAnimation();
    
    return () => {
      // Cleanup animation
      animation.stopAnimation();
    };
  }, [animation, delay]);

  return animation;
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: colors.beige.color02,
    alignSelf: 'flex-start',
    borderRadius: 16,
    borderBottomLeftRadius: 4,
    borderColor: colors.beige.color01,
    borderWidth: 1,
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginVertical: 6,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.grey.color01,
    marginHorizontal: 3,
  }
});
