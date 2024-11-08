import React from 'react';
import { View, StyleSheet } from 'react-native';

interface MazeProps {
  maze: number[][];
}

const Maze: React.FC<MazeProps> = ({ maze }) => {
  return (
    <View style={styles.container}>
      {maze.map((row, rowIndex) => (
        <View key={rowIndex} style={styles.row}>
          {row.map((cell, cellIndex) => (
            <View
              key={cellIndex}
              style={[
                styles.cell,
                cell === 1 ? styles.wall : styles.path,
              ]}
            />
          ))}
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  row: {
    flexDirection: 'row',
  },
  cell: {
    width: 20,
    height: 20,
  },
  wall: {
    backgroundColor: '#333',
    borderWidth: 1,
    borderColor: '#000',
  },
  path: {
    backgroundColor: '#fff',
  },
});

export default Maze;