// App.js
import React, { useEffect, useRef, useState } from 'react';
import { View, StyleSheet, Text, Dimensions, BackHandler, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Sound from 'react-native-sound';
import Fruit from './components/Fruit';
import GameOverModal from './components/GameOverModal';

Sound.setCategory('Playback');
const swipeSound = new Sound('swipe.mp3', Sound.MAIN_BUNDLE);
const bombSound = new Sound('bomb.mp3', Sound.MAIN_BUNDLE);

const SCREEN_WIDTH = Dimensions.get('window').width;

export default function App() {
  const [fruits, setFruits] = useState([]);
  const [score, setScore] = useState(0);
  const [bombClicks, setBombClicks] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [bestScore, setBestScore] = useState(0);
  const [paused, setPaused] = useState(false);
  const [speed, setSpeed] = useState(4000);
  const fruitTimer = useRef(null);

  useEffect(() => {
    loadBestScore();
    startGame();
    return () => clearInterval(fruitTimer.current);
  }, []);

  useEffect(() => {
    if (!paused && !gameOver) {
      fruitTimer.current = setInterval(() => {
        for (let i = 0; i < 3; i++) addFruit();
      }, 1200);
    } else {
      clearInterval(fruitTimer.current);
    }
    return () => clearInterval(fruitTimer.current);
  }, [paused, gameOver]);

  const loadBestScore = async () => {
    const stored = await AsyncStorage.getItem('BEST_SCORE');
    if (stored) setBestScore(parseInt(stored));
  };

  const saveBestScore = async (newScore) => {
    if (newScore > bestScore) {
      setBestScore(newScore);
      await AsyncStorage.setItem('BEST_SCORE', newScore.toString());
    }
  };

  const startGame = () => {
    setFruits([]);
    setScore(0);
    setBombClicks(0);
    setGameOver(false);
    setPaused(false);
    setSpeed(4000);
  };

  const addFruit = () => {
    const id = Date.now() + Math.random();
    const left = Math.random() * (SCREEN_WIDTH - 60);
    const isBad = Math.random() < 0.2;
    const type = isBad ? 'bomb' : ['apple', 'mango', 'watermelon'][Math.floor(Math.random() * 3)];
    setFruits((prev) => [...prev, { id, left, isBad, type }]);
  };

  const onSwipe = (id, isBad) => {
    if (paused) return;
    setFruits((prev) => prev.filter((f) => f.id !== id));
    if (isBad) {
      bombSound.play();
      setBombClicks((prev) => {
        const next = prev + 1;
        if (next >= 3) {
          saveBestScore(score);
          setGameOver(true);
        }
        return next;
      });
    } else {
      swipeSound.play();
      setScore((s) => {
        const newScore = s + 1;
        if (newScore % 15 === 0) setSpeed((sp) => Math.max(1000, sp - 500));
        return newScore;
      });
    }
  };

  const onMiss = (id) => {
    if (paused) return;
    setFruits((prev) => prev.filter((f) => f.id !== id));
  };

  const quitGame = () => {
    BackHandler.exitApp();
  };

  const togglePause = () => {
    setPaused(!paused);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.score}>Score: {score}</Text>
        <Text style={styles.score}>Best: {bestScore}</Text>
        <Text style={styles.score}>Bombs clicked: {bombClicks}/3</Text>
        <View style={styles.buttons}>
          <TouchableOpacity onPress={togglePause} style={styles.btn}>
            <Text style={styles.btnText}>{paused ? 'Resume' : 'Pause'}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={quitGame} style={styles.btn}>
            <Text style={styles.btnText}>Quit</Text>
          </TouchableOpacity>
        </View>
      </View>

      {fruits.map((fruit) => (
        <Fruit
          key={fruit.id}
          id={fruit.id}
          left={fruit.left}
          isBad={fruit.isBad}
          type={fruit.type}
          onSwipe={onSwipe}
          onMiss={onMiss}
          speed={speed}
          paused={paused}
        />
      ))}

      <GameOverModal visible={gameOver} score={score} onRestart={startGame} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#222',
  },
  header: {
    paddingTop: 20,
    paddingHorizontal: 10,
  },
  score: {
    color: 'white',
    fontSize: 16,
    marginVertical: 3,
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 10,
  },
  btn: {
    backgroundColor: '#444',
    padding: 6,
    borderRadius: 5,
    marginLeft: 10,
  },
  btnText: {
    color: '#fff',
    fontSize: 14,
  },
});
