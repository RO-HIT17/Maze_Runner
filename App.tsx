import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Button, Text, ImageBackground, Dimensions, Alert } from 'react-native';
import Maze from './components/Maze';
import Player from './components/Player';

const { width, height } = Dimensions.get('window');
const MAZE_SIZE = 21; 
const CELL_SIZE = Math.min(width, height) / MAZE_SIZE;

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

const findSolution = (maze: number[][], start: { x: number; y: number }, end: { x: number; y: number }): { x: number; y: number }[] => {
  const directions = [
    [0, -1], 
    [1, 0],  
    [0, 1],  
    [-1, 0], 
  ];

  const queue = [{ ...start, path: [] }];
  const visited = Array.from({ length: maze.length }, () => Array(maze[0].length).fill(false));
  visited[start.y][start.x] = true;

  while (queue.length > 0) {
    const current = queue.shift();
    if (!current) break;

    const { x, y, path } = current;
    if (x === end.x && y === end.y) {
      return path;
    }

    for (const [dx, dy] of directions) {
      const nx = x + dx;
      const ny = y + dy;

      if (nx >= 0 && ny >= 0 && nx < maze[0].length && ny < maze.length && maze[ny][nx] === 0 && !visited[ny][nx]) {
        visited[ny][nx] = true;
        queue.push({ x: nx, y: ny, path: [...path, { x: nx, y: ny }] });
      }
    }
  }

  return [];
};

const App: React.FC = () => {
  const [maze, setMaze] = useState<number[][]>([]);
  const [playerPosition, setPlayerPosition] = useState<{ x: number; y: number }>({ x: 1, y: 1 });
  const [solutionPath, setSolutionPath] = useState<{ x: number; y: number }[]>([]);
  const [destination] = useState<{ x: number; y: number }>({ x: MAZE_SIZE - 2, y: MAZE_SIZE - 2 });
  const [moves, setMoves] = useState<{ x: number; y: number }[]>([]);
  const [gameStart, setGameStart] = useState<boolean>(false); 
  const [timeElapsed, setTimeElapsed] = useState<number>(0); 
  const [score, setScore] = useState<number>(100); 

  
  useEffect(() => {
    const newMaze = generateMaze(MAZE_SIZE, MAZE_SIZE);
    setMaze(newMaze);
  }, []);

  useEffect(() => {
    
    let timerInterval: NodeJS.Timeout | null = null;
    if (gameStart) {
      timerInterval = setInterval(() => {
        setTimeElapsed((prevTime) => prevTime + 1); 
      }, 1000);
    } else if (!gameStart && timerInterval) {
      clearInterval(timerInterval); 
    }

    return () => {
      if (timerInterval) clearInterval(timerInterval); 
    };
  }, [gameStart]);

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
      setMoves([...moves, { x: newX, y: newY }]);

      
      if (!gameStart) {
        setGameStart(true); 
      }
    }
  };

  const undoMove = () => {
    if (moves.length > 1) {
      const newMoves = moves.slice(0, -1);
      const lastMove = newMoves[newMoves.length - 1];
      setPlayerPosition(lastMove);
      setMoves(newMoves);
    }
  };

  const highlightSolution = () => {
    const solution = findSolution(maze, { x: 1, y: 1 }, destination);
    if (solution.length === 0) {
      Alert.alert('No Solution Found', 'There is no valid solution path.');
    } else {
      setSolutionPath(solution);
    }
  };

  const resetMaze = () => {
    const newMaze = generateMaze(MAZE_SIZE, MAZE_SIZE);
    setMaze(newMaze);
    setPlayerPosition({ x: 1, y: 1 });
    setSolutionPath([]);
    setMoves([]);
    setTimeElapsed(0);
    setScore(100); 
    setGameStart(false); 
  };

  const handleGameFinish = () => {
    const elapsedScore = Math.max(0, score - timeElapsed); 
    setScore(elapsedScore);
    Alert.alert(
      'Congratulations!',
      `You've reached the destination in ${timeElapsed} seconds! Your score is: ${elapsedScore}`,
      [{ text: 'OK', onPress: resetMaze }]
    );
    setGameStart(false); 
  };

  useEffect(() => {
    
    if (playerPosition.x === destination.x && playerPosition.y === destination.y) {
      handleGameFinish();
    }
  }, [playerPosition]);

  return (
    <ImageBackground source={require('./assets/Bg.png')} style={styles.background}>
      <View style={styles.container}>
        <Text style={styles.title}>Maze Runner</Text>
        <Text style={styles.timerText}>Time: {timeElapsed}s</Text>
        <Text style={styles.scoreText}>Score: {score}</Text>
        <View style={[styles.mazeContainer, { width: CELL_SIZE * MAZE_SIZE, height: CELL_SIZE * MAZE_SIZE }]}>
          <Maze maze={maze} cellSize={CELL_SIZE} solutionPath={solutionPath} destination={destination} />
          <Player position={playerPosition} cellSize={CELL_SIZE} />
        </View>
        <View style={styles.controls}>
          <Button title="Up" onPress={() => movePlayer(0, -1)} />
          <Button title="Down" onPress={() => movePlayer(0, 1)} />
          <Button title="Left" onPress={() => movePlayer(-1, 0)} />
          <Button title="Right" onPress={() => movePlayer(1, 0)} />
          <Button title="Undo" onPress={undoMove} />
          <Button title="Highlight Solution" onPress={highlightSolution} />
          <Button title="Reset" onPress={resetMaze} />
        </View>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
  },
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  title: {
    fontSize: 30,
    color: 'black',
    marginBottom: 20,
  },
  timerText: {
    fontSize: 20,
    color: 'black',
    marginBottom: 10,
  },
  scoreText: {
    fontSize: 20,
    color: 'black',
    marginBottom: 20,
  },
  mazeContainer: {
    marginBottom: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  controls: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    width: '80%',
  },
});

export default App;
