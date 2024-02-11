import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, ImageBackground, Alert } from 'react-native';
import TitleScreen from './TitleScreen';

const gridSize = 3;
const moleSize = 80;
const moleIntervalTime = 800;
const gameDuration = 1 * 60 * 1000;
const maxMissesPerLife = 10;

export default function WhackAMoleGame() {
  const [gameStarted, setGameStarted] = useState(false);
  const [moles, setMoles] = useState([]);
  const [score, setScore] = useState(0);
  const [misses, setMisses] = useState(0);
  const [lives, setLives] = useState(5);
  const [timer, setTimer] = useState(gameDuration);
  const [isPaused, setIsPaused] = useState(false);

  const startGame = () => {
    setGameStarted(true);
    setScore(0);
    setMisses(0);
    setLives(5);
    setMoles([]);
    setTimer(gameDuration);
    setIsPaused(false);
  };

  const spawnMole = () => {
    if (!isPaused) {
      const randomHole = Math.floor(Math.random() * (gridSize * gridSize));
      const newMole = { id: Date.now(), hole: randomHole };
      setMoles((prevMoles) => [...prevMoles, newMole]);

      setTimeout(() => {
        setMoles((prevMoles) => {
          const stillExists = prevMoles.some((mole) => mole.id === newMole.id);
          if (stillExists) {
            
            handleMiss();
          }
          return prevMoles.filter((mole) => mole.id !== newMole.id);
        });
      }, moleIntervalTime);
    }
  };

  const whackMole = (moleId) => {
    setMoles((prevMoles) => prevMoles.filter((mole) => mole.id !== moleId));
    setScore((prevScore) => prevScore + 1);
  };

  const handleMiss = () => {
    setMisses((prevMisses) => {
      const newMisses = prevMisses + 1;
      if (newMisses % maxMissesPerLife === 0) {
       
        setLives((prevLives) => Math.max(prevLives - 1, 0));
        if (lives === 1) {
          handleGameOver();
        }
      }
      return newMisses;
    });
  };

  const handleGameOver = () => {
    setGameStarted(false);
    setMoles([]);
    setIsPaused(false);
   
    Alert.alert('Game Over', 'Thanks for Playing');
  };

  const handleQuit = () => {
    setGameStarted(false);
    setMoles([]);
    setIsPaused(false);
  };

  const togglePause = () => {
    setIsPaused((prevIsPaused) => !prevIsPaused);
  };

  useEffect(() => {
    if (gameStarted) {
      const moleInterval = setInterval(spawnMole, moleIntervalTime);
      const timerInterval = setInterval(() => {
        setTimer((prevTimer) => Math.max(prevTimer - 1000, 0));
      }, 1000);

      setTimeout(() => {
        clearInterval(moleInterval);
        clearInterval(timerInterval);
        setGameStarted(false);
        handleGameOver();
      }, gameDuration);

      return () => {
        clearInterval(moleInterval);
        clearInterval(timerInterval);
      };
    }
  }, [gameStarted, isPaused]);

  return (
    <ImageBackground
      source={require('./image.jpg')}
      style={styles.background}
    >
      <View style={styles.container}>
        {gameStarted ? (
          <View>
            <View style={styles.scoreContainer}>
              <Text style={styles.scoreText}>Score: {score}</Text>
              <Text style={styles.scoreText}>Misses: {misses}</Text>
              <Text style={styles.scoreText}>Lives: {lives}</Text>
              <Text style={styles.scoreText}>
                Time: {Math.floor(timer / 60000)}:{((timer % 60000) / 1000).toFixed(0).padStart(2, '0')}
              </Text>
            </View>
            <View style={styles.gameArea}>
              {Array.from({ length: gridSize * gridSize }).map((_, index) => (
                <TouchableOpacity
                  key={index}
                  style={[styles.hole, moles.some((mole) => mole.hole === index) ? styles.activeHole : null]}
                  onPress={() => {
                    const mole = moles.find((mole) => mole.hole === index);
                    if (mole) {
                      whackMole(mole.id);
                    } else {
                      
                      handleMiss();
                    }
                  }}
                  activeOpacity={0.8}
                >
                  {moles.some((mole) => mole.hole === index) && (
                    <Image source={require('./mole.png')} style={styles.moleImage} />
                  )}
                </TouchableOpacity>
              ))}
            </View>
            <TouchableOpacity style={styles.quitButton} onPress={handleQuit}>
              <Text style={styles.quitButtonText}>Quit</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.pauseButton} onPress={togglePause}>
              <Text style={styles.pauseButtonText}>{isPaused ? 'Resume' : 'Pause'}</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <TitleScreen onStartGame={startGame} />
        )}
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
  scoreContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  scoreText: {
    color: '#fff',
    fontSize: 18,
  },
  gameArea: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  hole: {
    width: moleSize,
    height: moleSize,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 10,
    backgroundColor: '#9c704b',
    borderRadius: 10,
  },
  activeHole: {
    backgroundColor: 'transparent',
  },
  moleImage: {
    width: moleSize - 20,
    height: moleSize - 20,
  },
  quitButton: {
    marginTop: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#d9534f',
    borderRadius: 5,
  },
  quitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  pauseButton: {
    marginTop: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#5bc0de',
    borderRadius: 5,
  },
  pauseButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
