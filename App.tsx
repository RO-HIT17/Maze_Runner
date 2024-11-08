import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Button, Text, ImageBackground } from 'react-native';
import Maze from './components/Maze';
import Player from './components/Player';

const generateMaze = (rows: number, cols: number): number[][] => {
  const maze = Array.from({ length: rows }, () => Array(cols).fill(1));

  const carvePassagesFrom = (cx: number, cy: number) => {
    const directions = [
      [0, -1], 
      [1, 0],  
      [0, 1],
      [-1, 0], 
    ];
    directions.sort(() => Math.random() - 0.5);

    directions.forEach(([dx, dy]) => {
      const nx = cx + dx * 2;
      const ny = cy + dy * 2;

      if (nx >= 0 && ny >= 0 && nx < cols && ny < rows && maze[ny][nx] === 1) {
        maze[cy + dy][cx + dx] = 0;
        maze[ny][nx] = 0;
        carvePassagesFrom(nx, ny);
      }
    });
  };

  maze[1][1] = 0;
  carvePassagesFrom(1, 1);
  maze[rows - 2][cols - 2] = 0;

  return maze;
};

const App: React.FC = () => {
  const [maze, setMaze] = useState<number[][]>([]);
  const [playerPosition, setPlayerPosition] = useState<{ x: number; y: number }>({ x: 1, y: 1 });

  useEffect(() => {
    const newMaze = generateMaze(21, 21);
    setMaze(newMaze);
  }, []);

  const movePlayer = (dx: number, dy: number) => {
    const newX = playerPosition.x + dx;
    const newY = playerPosition.y + dy;
    if (
      newX >= 0 &&
      newX < maze[0].length &&
      newY >= 0 &&
      newY < maze.length &&
      maze[newY][newX] === 0
    ) {
      setPlayerPosition({ x: newX, y: newY });
    }
  };

  return (
    <ImageBackground source={require('./assets/Bg.png')} style={styles.background}>
      <View style={styles.container}>
        <Text style={styles.title}>Maze Runner</Text>
        <View style={styles.mazeContainer}>
          <Maze maze={maze} />
          <Player position={playerPosition} />
        </View>
        <View style={styles.controls}>
          <Button title="Up" onPress={() => movePlayer(0, -1)} />
          <Button title="Down" onPress={() => movePlayer(0, 1)} />
          <Button title="Left" onPress={() => movePlayer(-1, 0)} />
          <Button title="Right" onPress={() => movePlayer(1, 0)} />
        </View>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: 'cover',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
  },
  mazeContainer: {
    position: 'relative',
    width: 420,
    height: 420,
    backgroundColor: '#ddd',
    borderWidth: 2,
    borderColor: '#333',
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    position: 'absolute',
    bottom: 50,
  },
});

export default App;