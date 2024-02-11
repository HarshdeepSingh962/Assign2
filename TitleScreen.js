import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ImageBackground, Image } from 'react-native';

export default function TitleScreen({ onStartGame }) {
  return (
    <ImageBackground
      source={require('./image.jpg')}
      style={styles.background}
    >
      <View style={styles.container}>
        <Image source={require('./1.jpg')} style={styles.logoImage} />
        <Text style={styles.instructions}>
          Welcome to Whack-a-Mole!  {'\n'}
          Click the moles as fast as you can, but be careful not to miss.
          Each hit increases your score. Try to achieve the highest score possible!{'\n'}{'\n'}
          Note: One live is equal to 10 misses 

        </Text>
        <TouchableOpacity style={styles.startButton} onPress={onStartGame}>
          <Text style={styles.buttonText}>Start Game</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', 
    padding: 20,
  },
  logoImage: {
    width: 150, 
    height: 150, 
    marginBottom: 20,
  },
  instructions: {
    textAlign: 'center',
    fontSize: 18,
    color: '#fff',
    marginBottom: 30,
  },
  startButton: {
    paddingVertical: 15,
    paddingHorizontal: 30,
    backgroundColor: '#4CAF50',
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
});
