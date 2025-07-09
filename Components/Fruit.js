import React, { useEffect, useRef } from 'react';
import { Animated, Image, StyleSheet, Dimensions, PanResponder } from 'react-native';

const SCREEN_HEIGHT = Dimensions.get('window').height;

export default function Fruit({ id, left, isBad, onSwipe, onMiss }) {
  const translateY = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(translateY, {
      toValue: SCREEN_HEIGHT,
      duration: 3000,
      useNativeDriver: true,
    }).start(() => onMiss(id));
  }, []);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderRelease: () => onSwipe(id, isBad),
    })
  ).current;

  return (
    <Animated.View
      style={[styles.fruit, { left, transform: [{ translateY }] }]}
      {...panResponder.panHandlers}
    >
      <Image
        source={isBad ? require('../assets/bomb.png') : require('../assets/apple.png')}
        style={styles.image}
      />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  fruit: {
    position: 'absolute',
    width: 50,
    height: 50,
  },
  image: {
    width: 50,
    height: 50,
    resizeMode: 'contain',
  },
});