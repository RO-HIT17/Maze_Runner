import React, { useEffect } from 'react';
import { View, StyleSheet, Animated, Easing, Image } from 'react-native';

interface PlayerProps {
  position: { x: number; y: number };
}

const Player: React.FC<PlayerProps> = ({ position }) => {
  const animatedValue = new Animated.Value(0);

  useEffect(() => {
    Animated.loop(
      Animated.timing(animatedValue, {
        toValue: 1,
        duration: 1000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();
  }, []);

  const animatedStyle = {
    transform: [
      {
        rotate: animatedValue.interpolate({
          inputRange: [0, 1],
          outputRange: ['0deg', '360deg'],
        }),
      },
    ],
  };

  return (
    <Animated.View
      style={[
        styles.player,
        animatedStyle,
        { top: position.y * 20, left: position.x * 20 },
      ]}
    >
      <Image
        source={require('../assets/icon.png')}
        style={styles.image}
      />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  player: {
    position: 'absolute',
    width: 20,
    height: 20,
    backgroundColor: 'red',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: 20,
    height: 20,
    borderRadius: 10,
  },
});

export default Player;