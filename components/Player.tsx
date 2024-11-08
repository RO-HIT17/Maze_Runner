import React from 'react';
import { View, StyleSheet } from 'react-native';

interface PlayerProps {
  position: { x: number; y: number };
  cellSize: number;
}

const Player: React.FC<PlayerProps> = ({ position, cellSize }) => {
  return (
    <View
      style={[
        styles.player,
        {
          left: position.x * cellSize,
          top: position.y * cellSize,
          width: cellSize,
          height: cellSize,
        },
      ]}
    />
  );
};

const styles = StyleSheet.create({
  player: {
    position: 'absolute',
    backgroundColor: 'red',
    borderRadius: 50,
  },
});

export default Player;
