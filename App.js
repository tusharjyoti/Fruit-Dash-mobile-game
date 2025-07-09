import React, { useEffect, useRef, useState } from 'react';
import { View, StyleSheet, Text, Dimensions } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Fruit from './Components/Fruit';
import GameOverModal from './Components/GameOverModal';

const SCREEN_WIDTH = Dimensions.get('window').width;
const TOTAL_GAME_TIME = 1200000;

export default function App() {
  const [fruits, setFruits] = useState([]);
  const [score, setScore] = useState(0);
  const [misses, setMisses] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [bestScore, setBestScore] = useState(0);
  const gameTimer = useRef(null);

  useEffect(() => {
    loadBestScore();
    startGame();
    return () => clearInterval(gameTimer.current);
  }, []);

  const loadBestScore = async () => {
    const storedScore = await AsyncStorage.getItem('BEST_SCORE');
    if (storedScore) setBestScore(parseInt(storedScore));
  };

  const saveBestScore = async (newScore) => {
    if (newScore > bestScore) {
      setBestScore(newScore);
      await AsyncStorage.setItem('BEST_SCORE', newScore.toString());
    }
  };

  const startGame = () => {
    gameTimer.current = setInterval(() => {
      addFruit();
    }, 700);

    setTimeout(() => {
      endGame();
    }, TOTAL_GAME_TIME);
  };

  const addFruit = () => {
    const id = Date.now();
    const left = Math.random() * (SCREEN_WIDTH - 80);
    const isBad = Math.random() < 0.2;
    const newFruit = { id, left, isBad };
    setFruits((prev) => [...prev, newFruit]);
  };

  const onSwipe = (id, isBad) => {
    setFruits((prev) => prev.filter((f) => f.id !== id));
    setScore((s) => isBad ? s - 1 : s + 1);
  };

  const onMiss = (id) => {
    setFruits((prev) => prev.filter((f) => f.id !== id));
    setMisses((m) => {
      if (m + 1 >= 3) endGame();
      return m + 1;
    });
  };

  const endGame = () => {
    clearInterval(gameTimer.current);
    setGameOver(true);
    saveBestScore(score);
  };

  const restartGame = () => {
    setFruits([]);
    setScore(0);
    setMisses(0);
    setGameOver(false);
    startGame();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.score}>Score: {score}</Text>
      <Text style={styles.score}>Best: {bestScore}</Text>
      {fruits.map((fruit) => (
        <Fruit
          key={fruit.id}
          id={fruit.id}
          left={fruit.left}
          isBad={fruit.isBad}
          onSwipe={onSwipe}
          onMiss={onMiss}
        />
      ))}
      <GameOverModal visible={gameOver} score={score} onRestart={restartGame} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#222',
  },
  score: {
    color: 'white',
    fontSize: 18,
    marginTop: 20,
    marginLeft: 20,
  },
});