import React from 'react';
import { View, StyleSheet } from 'react-native';

interface MazeProps {
  maze: number[][];  
  cellSize: number;  
  solutionPath: { x: number; y: number }[]; 
  destination: { x: number; y: number }; 
}

const Maze: React.FC<MazeProps> = ({ maze, cellSize, solutionPath, destination }) => {
  return (
    <View style={styles.container}>
      {maze.map((row, rowIndex) => (
        <View key={rowIndex} style={styles.row}>
          {row.map((cell, cellIndex) => (
            <View
              key={cellIndex}
              style={[
                styles.cell,
                { width: cellSize, height: cellSize },
                cell === 1 ? styles.wall : styles.path,
                solutionPath.some(pos => pos.x === cellIndex && pos.y === rowIndex)
                  ? styles.solution
                  : {},
                destination.x === cellIndex && destination.y === rowIndex
                  ? styles.destination
                  : {},
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
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  row: {
    flexDirection: 'row',
  },
  cell: {
    borderWidth: 1,
    borderColor: '#000',
  },
  wall: {
    backgroundColor: '#333',
  },
  path: {
    backgroundColor: '#fff',
  },
  solution: {
    backgroundColor: 'yellow', 
  },
  destination: {
    backgroundColor: 'green', 
  },
});

export default Maze;
