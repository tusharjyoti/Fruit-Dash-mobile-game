import React from 'react';
import { Modal, View, Text, StyleSheet, Button } from 'react-native';

export default function GameOverModal({ visible, score, onRestart }) {
  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.modalView}>
        <Text style={styles.title}>Game Over</Text>
        <Text style={styles.score}>Your Score: {score}</Text>
        <Button title="Restart" onPress={onRestart} />
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalView: {
    marginTop: 200,
    marginHorizontal: 30,
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  title: {
    fontSize: 22,
    marginBottom: 10,
  },
  score: {
    fontSize: 18,
    marginBottom: 20,
  },
});