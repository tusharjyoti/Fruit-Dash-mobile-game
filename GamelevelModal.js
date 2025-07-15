import React from 'react';
import { Modal, View, Text, StyleSheet, Button } from 'react-native';


export default function GamelevelModal({ visible, score, Proceedtonextlevel,onRestart,quitGame}) {
  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.modalView}>
        <Text style={styles.title}>Congratz!, you can proceed to the next level.</Text>
        <Text style={styles.score}>Your Score: {score}</Text>
        <Button title="Play next level" onPress={Proceedtonextlevel} />
        <View style={styles.buttonSpacing} />
        <Button title="Play Again" onPress={onRestart} />
        <View style={styles.buttonSpacing} />
        <Button title="Quit Game" onPress={quitGame} />
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