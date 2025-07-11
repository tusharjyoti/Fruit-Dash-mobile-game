// Fruit.js
import React, { useEffect, useRef, useState } from 'react';
import { Animated, Dimensions, Image, StyleSheet, PanResponder } from 'react-native';

const SCREEN_HEIGHT = Dimensions.get('window').height;

const fruitImages = {
  apple: require('../assets/apple.png'),
  mango: require('../assets/mango.png'),
  watermelon: require('../assets/watermelon.png'),
  bomb: require('../assets/bomb.png'),
};

export default function Fruit({ id, left, isBad, type, onSwipe, onMiss, speed, paused }) {
  const fallAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const opacityAnim = useRef(new Animated.Value(1)).current;

  const [clicked, setClicked] = useState(false);
  const fallAnimRef = useRef(null);

  useEffect(() => {
    if (!paused && !clicked) {
      fallAnimRef.current = Animated.timing(fallAnim, {
        toValue: SCREEN_HEIGHT,
        duration: speed,
        useNativeDriver: true,
      });
      fallAnimRef.current.start(({ finished }) => {
        if (finished && !clicked) onMiss(id);
      });
    } else if (paused && fallAnimRef.current) {
      fallAnim.stopAnimation();
    }
    return () => fallAnim.stopAnimation();
  }, [paused]);

  const handleClick = () => {
    if (clicked) return;
    setClicked(true);
    Animated.parallel([
      Animated.timing(scaleAnim, {
        toValue: isBad ? 2.5 : 1.5,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onSwipe(id, isBad);
    });
  };

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => !paused,
      onPanResponderRelease: () => handleClick(),
    })
  ).current;

  return (
    <Animated.View
      {...panResponder.panHandlers}
      style={[
        styles.fruit,
        {
          transform: [{ translateY: fallAnim }, { scale: scaleAnim }],
          opacity: opacityAnim,
          left,
        },
      ]}
    >
      <Image source={fruitImages[type]} style={styles.image} />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  fruit: {
    position: 'absolute',
    width: 45,
    height: 45,
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
});
