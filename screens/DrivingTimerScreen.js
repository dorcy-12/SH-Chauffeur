import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Platform } from "react-native";
import BackgroundTimer from "react-native-background-timer";
import PushNotification from "react-native-push-notification";

function DrivingTimerScreen() {
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [distance, setDistance] = useState(0);
  const [startLocation, setStartLocation] = useState("Unknown");
  const [endLocation, setEndLocation] = useState("Unknown");

  useEffect(() => {
    let interval;
    if (isActive) {
      interval = BackgroundTimer.setInterval(() => {
        setElapsedSeconds((prevSeconds) => {
          const newSeconds = prevSeconds + 1;
          updateNotification(formatTime(newSeconds));
          return newSeconds;
        });
      }, 1000);
    } else {
      BackgroundTimer.clearInterval(interval);
    }
    return () => BackgroundTimer.clearInterval(interval);
  }, [isActive]);

  useEffect(() => {
    PushNotification.createChannel(
      {
        channelId: "timer-channel", // (required)
        channelName: "Timer Channel", // (required)
        channelDescription: "A channel for timer notifications", // (optional) default: undefined.
        
      },
      (created) => console.log(`createChannel returned '${created}'`) // (optional) callback returns whether the channel was created, false means it already existed.
    );
  }, []);

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;

    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
      2,
      "0"
    )}:${String(remainingSeconds).padStart(2, "0")}`;
  };

  const updateNotification = (formattedTime) => {
    PushNotification.localNotification({
      channelId: "timer-channel",
      id: 1,
      message: `Timer: ${formattedTime}`,
      playSound: false, // (optional) default: true
      vibrate: false, // (optional) default: true. Creates the default vibration pattern if true.
      
      // Other notification options...
    });
    console.log(formattedTime)
  };

  const startTimer = () => {
    setIsActive(true);
    console.log('we started')
    PushNotification.localNotification({
      channelId: "timer-channel",
      id: 1,
      message: `Timer started`,
      playSound: false, // (optional) default: true
      vibrate: false, // (optional) default: true. Creates the default vibration pattern if true.
      
      // Other notification options...
    });
    console.log('we reached here')
  };

  const pauseTimer = () => {
    setIsActive(false);
    PushNotification.localNotification({
      channelId: "timer-channel",
      id: 1,
      message: `Timer paused`,
      playSound: true, // (optional) default: true
      vibrate: true, // (optional) default: true. Creates the default vibration pattern if true.
      
      // Other notification options...
    });
  };

  const stopTimer = () => {
    setIsActive(false);
    setElapsedSeconds(0);
    PushNotification.cancelLocalNotification({ id: 1 });
  };

  return (
    <View style={styles.container}>
      <View style={styles.timerWrapper}>
        <Text style={styles.timerText}>{formatTime(elapsedSeconds)}</Text>
      </View>
      <View style={styles.infoContainer}>
        <Text style={styles.infoText}>Start: {startLocation}</Text>
        <Text style={styles.infoText}>End: {endLocation}</Text>
        <Text style={styles.infoText}>Distance: {distance} km</Text>
      </View>
      <View style={styles.buttonWrapper}>
        <TouchableOpacity style={styles.button} onPress={() => (isActive ? pauseTimer() : startTimer())}>
          <Text style={styles.buttonText}>{isActive ? 'Pause' : 'Start'}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, {backgroundColor:"red"}]} onPress={stopTimer}>
          <Text style={styles.buttonText}>Stop</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F2',
    alignItems: 'center',
    justifyContent: 'center',
  },
  timerWrapper: {
    marginBottom: 40,
  },
  timerText: {
    fontSize: 72,
    color: '#333333',
  },
  infoContainer: {
    marginBottom: 20,
  },
  infoText: {
    fontSize: 18,
    color: '#333333',
    marginBottom: 10,
  },
  buttonWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    paddingHorizontal: 40,
  },
  button: {
    backgroundColor: '#333333',
    borderRadius: 25,
    width: 100,
    height: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
  },
});

export default DrivingTimerScreen;
