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
    <View style={styles.mazeContainer}>
      {maze.map((row, rowIndex) =>
        row.map((cell, colIndex) => {
          const isWall = cell === 1; 
          const isSolution = solutionPath.some(path => path.x === colIndex && path.y === rowIndex);
          const isDestination = destination.x === colIndex && destination.y === rowIndex;

          return (
            <View
              key={`${rowIndex}-${colIndex}`}
              style={[
                styles.cell,
                {
                  width: cellSize,
                  height: cellSize,
                  backgroundColor: isWall
                    ? '#000' 
                    : isSolution
                    ? '#ff0' 
                    : isDestination
                    ? '#f00' 
                    : '#fff', 
                  borderWidth: 0, 
                },
              ]}
            />
          );
        })
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  mazeContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: '100%',
  },
  cell: {
    margin: 0,
    padding: 0,
  },
});

export default Maze;
