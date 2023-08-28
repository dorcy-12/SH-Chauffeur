import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
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
        setElapsedSeconds((prevSeconds) => prevSeconds + 1);
        updateNotification(formatTime(prevSeconds + 1));
      }, 1000);
    } else {
      BackgroundTimer.clearInterval(interval);
    }
    return () => BackgroundTimer.clearInterval(interval);
  }, [isActive]);

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
      id: "timerNotification",
      message: `Timer: ${formattedTime}`,
      // Other notification options...
    });
  };

  const startTimer = () => {
    setIsActive(true);
    PushNotification.localNotification({
      id: "timerNotification",
      message: "Timer started",
      // Other notification options...
    });
  };

  const pauseTimer = () => {
    setIsActive(false);
    PushNotification.localNotification({
      id: "timerNotification",
      message: "Timer paused",
      // Other notification options...
    });
  };

  const stopTimer = () => {
    setIsActive(false);
    setElapsedSeconds(0);
    PushNotification.cancelLocalNotifications({ id: "timerNotification" });
  };

  return (
    <View style={styles.container}>
      <View style={styles.timerCircle}>
        <Text style={styles.timerText}>{formatTime(elapsedSeconds)}</Text>
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => (isActive ? pauseTimer() : startTimer())}
        >
          <Text style={styles.buttonText}>{isActive ? "Pause" : "Start"}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton} onPress={stopTimer}>
          <Text style={styles.buttonText}>Stop</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => {
            /* Finish logic here */
          }}
        >
          <Text style={styles.buttonText}>Finish</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.detailsContainer}>
        <Text>
          <Text style={styles.detailLabel}>Distance:</Text> {distance} km
        </Text>
        <Text>
          <Text style={styles.detailLabel}>Start:</Text> {startLocation}
        </Text>
        <Text>
          <Text style={styles.detailLabel}>End:</Text> {endLocation}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#e0e0e0",
    padding: 20,
  },
  timerCircle: {
    backgroundColor: "#424242",
    borderRadius: 150,
    width: 300,
    height: 300,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
    elevation: 5,
  },
  timerText: {
    color: "white",
    fontSize: 28,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: 20,
  },
  actionButton: {
    backgroundColor: "#2196F3",
    borderRadius: 25,
    paddingVertical: 10,
    paddingHorizontal: 20,
    margin: 5,
    elevation: 3,
    flex: 1,

    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
  },
  detailsContainer: {
    backgroundColor: "white",
    borderRadius: 15,
    width: "100%",
    alignItems: "center",
    padding: 15,
    elevation: 5,
  },
  detailLabel: {
    fontWeight: "bold",
  },
});

export default DrivingTimerScreen;
