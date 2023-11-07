import React, { useCallback, useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Alert } from "react-native";
import BackgroundTimer from "react-native-background-timer";
import PushNotification from "react-native-push-notification";
import * as SecureStore from "expo-secure-store";
import * as Location from "expo-location";
import { useTrip } from "../context/TripContext";




const formatTime = (seconds) => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;

  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
    2,
    "0"
  )}:${String(remainingSeconds).padStart(2, "0")}`;
};

const updateNotification = () => {
  PushNotification.localNotification({
    channelId: "timer-channel",
    id: 1,
    message: `Timer läuft`,
    playSound: true,
    soundName: "default",
    ongoing: true,
    // Other notification options...
  });
};

function DrivingTimerScreen({ navigation, route }) {
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [Trip, setTrip] = useState(null);
  const [CumDistance, setCumDistance] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [startLocation, setStartLocation] = useState("Unknown");
  const [location, setLocation] = useState("Unknown");
  const [endLocation, setEndLocation] = useState("Unknown");
  const [userPath, setUserPath] = useState([]); // To store the user's path
  const [locationIntervalId, setLocationIntervalId] = useState(null); // Reference to the location update interval
  const {activeTrip, setActiveTrip} = useTrip();

  const preventNavigationIfTimerIsActive = useCallback(
    (e) => {
      if (isActive) {
        e.preventDefault();

        // Optionally show an alert to inform the user
        Alert.alert(
          "Timer is running",
          "You cannot navigate away while the timer is active.",
          [{ text: "OK" }]
        );
      }
    },
    [isActive]
  );

  useEffect(() => {
    const unsubscribe = navigation.addListener(
      "beforeRemove",
      preventNavigationIfTimerIsActive
    );

    return unsubscribe;
  }, [navigation, preventNavigationIfTimerIsActive]);

  useEffect(() => {
    setStartLocation(activeTrip.start_location);
    setEndLocation(activeTrip.end_location);
  }, [activeTrip]);

  useEffect(() => {
    let interval;
    if (isActive) {
      // Call the notification function only once when the timer starts
      updateNotification();
      interval = BackgroundTimer.setInterval(() => {
        setElapsedSeconds((prevSeconds) => prevSeconds + 1);
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
        vibrate: false,
        sound: true,
        onlyAlertOnce: true,
      },
      (created) => console.log(`createChannel returned '${created}'`) // (optional) callback returns whether the channel was created, false means it already existed.
    );
  }, []);

  

  
  const haversine_distance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Radius of the Earth in kilometers
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) *
        Math.cos(lat2 * (Math.PI / 180)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;
    return distance;
  };

  const decide_ping_frequency = (distance) => {
    if (distance < 5) return 30; // 30 seconds
    if (distance >= 5 && distance <= 20) return 120; // 2 minutes
    return 300; // 5 minutes
  };

  const fetchCurrentLocation = async () => {
    let currentLocation = await Location.getCurrentPositionAsync({});
    return currentLocation;
  };

  const startLocationUpdates = async () => {
    const currentLocation = await fetchCurrentLocation();
    setUserPath((prevPath) => [...prevPath, currentLocation.coords]);

    const distanceToDestination = haversine_distance(
      currentLocation.coords.latitude,
      currentLocation.coords.longitude,
      endLocation.latitude,
      endLocation.longitude
    ); // Assuming endLocation is in this format: {latitude: xx, longitude: yy}
    const pingFrequency = decide_ping_frequency(distanceToDestination);

    const intervalId = BackgroundTimer.setInterval(async () => {
      const newLocation = await fetchCurrentLocation();

      // Check if there's a previous location to calculate distance from
      if (userPath.length > 0) {
        const lastLocation = userPath[userPath.length - 1];
        const newDistance = haversine_distance(
          lastLocation.latitude,
          lastLocation.longitude,
          newLocation.coords.latitude,
          newLocation.coords.longitude
        );
        setCumDistance((prevCumDistance) => prevCumDistance + newDistance);
      }

      setUserPath((prevPath) => [...prevPath, newLocation.coords]);
    }, pingFrequency * 1000);

    setLocationIntervalId(intervalId);
  };

  const stopLocationUpdates = async () => {
    if (locationIntervalId) {
      BackgroundTimer.clearInterval(locationIntervalId);
      setLocationIntervalId(null);
    }
  };

  const startTimer = () => {
    setIsActive(true);
    startLocationUpdates();
    console.log("we started");
    console.log("we reached here");
  };

  const pauseTimer = useCallback(() => {
    setIsActive(false);
    PushNotification.localNotification({
      channelId: "timer-channel",
      id: 1,
      message: `Timer paused`,
      playSound: true,
      soundName: "default",

      // Other notification options...
    });
  },[])

  const stopTimer = useCallback(async () => {
    setIsActive(false);
    stopLocationUpdates();
    setElapsedSeconds(0);

    try {
      // Get the current location
      const location = await Location.getCurrentPositionAsync();
      console.log("location is here");
      // Reverse geocode the location to get address
      const addresses = await Location.reverseGeocodeAsync(location.coords);
      console.log("adrresses is here");
      if (addresses && addresses.length > 0) {
        const { street } = addresses[0];
        console.log("the street is " + street);
        await saveTrip(street);
      }
    } catch (error) {
      console.error("Error getting end location:", error);
      setEndLocation("Unknown");
    }

  
    PushNotification.cancelLocalNotification({ id: 1 });

    navigation.navigate("Journey");
    // Maybe navigate to another screen or show a confirmation to the user
  }, [elapsedSeconds]);

  const saveTrip = async () => {
    const updatedTrip = {
      ...activeTrip,
      distance: CumDistance,
      userPath: userPath,
      driven_time: elapsedSeconds,
      is_completed: true,
    };

    setActiveTrip(updatedTrip);
  };

  return (
    <View style={styles.container}>
      <View style={styles.timerWrapper}>
        <Text style={styles.timerText}>{formatTime(elapsedSeconds)}</Text>
      </View>
      <View style={styles.infoContainer}>
        <Text style={styles.infoText}>Start: {startLocation}</Text>
        <Text style={styles.infoText}>End: {endLocation}</Text>
        <Text style={styles.infoText}>
          Distance: {CumDistance.toFixed(2)} km
        </Text>
      </View>
      <View style={styles.buttonWrapper}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => (isActive ? pauseTimer() : startTimer())}
        >
          <Text style={styles.buttonText}>{isActive ? "Pause" : "Start"}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, { backgroundColor: "red" }]}
          onPress={stopTimer}
        >
          <Text style={styles.buttonText}>Stop</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F2F2F2",
    alignItems: "center",
    justifyContent: "center",
  },
  timerWrapper: {
    marginBottom: 40,
  },
  timerText: {
    fontSize: 72,
    color: "#333333",
  },
  infoContainer: {
    marginBottom: 20,
  },
  infoText: {
    fontSize: 18,
    color: "#333333",
    marginBottom: 10,
  },
  buttonWrapper: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    paddingHorizontal: 40,
  },
  button: {
    backgroundColor: "#333333",
    borderRadius: 25,
    width: 100,
    height: 100,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 18,
  },
});

export default DrivingTimerScreen;
