import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  BackHandler,
} from "react-native";
import MapView, { Polyline, Marker } from "react-native-maps";
import * as SecureStore from "expo-secure-store";
import { useService } from "../context/ServiceContext";

function JourneyDetailsScreen({ navigation, route }) {
  const { activeTrip, setActiveTrip, allTrips, setAllTrips } = useTrip();

  useEffect(() => {
    navigation.setOptions({
      headerLeft: null, // Disable back button in the header
      gestureEnabled: false, // Disable swipe gesture for iOS
    });
  }, [navigation]);

  useEffect(() => {
    // Disable Android back button
    const backAction = () => {
      return true; // This will prevent going back
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => backHandler.remove();
  }, []);

  const finishTrip = async () => {
    try {
      // Update the local state (allTrips) to reflect changes to activeTrip
      const updatedTrips = allTrips.map((trip) =>
        trip.id === activeTrip.id ? activeTrip : trip
      );
      setAllTrips(updatedTrips);
      // Save the updated trips back to Secure Store
      await SecureStore.setItemAsync("trips", JSON.stringify(updatedTrips));

      // Navigate to the desired screen (e.g., "Documents Folder")
      navigation.navigate("documents");
    } catch (error) {
      console.error("Error finishing the trip:", error);
    }
  };

  const getBoundingBox = (path) => {
    if (!path || path.length === 0) return {};

    let minLatitude = path[0].latitude;
    let maxLatitude = path[0].latitude;
    let minLongitude = path[0].longitude;
    let maxLongitude = path[0].longitude;

    for (const point of path) {
      minLatitude = Math.min(minLatitude, point.latitude);
      maxLatitude = Math.max(maxLatitude, point.latitude);
      minLongitude = Math.min(minLongitude, point.longitude);
      maxLongitude = Math.max(maxLongitude, point.longitude);
    }

    return {
      centerLatitude: (minLatitude + maxLatitude) / 2,
      centerLongitude: (minLongitude + maxLongitude) / 2,
      latitudeDelta: maxLatitude - minLatitude + 0.01, // Adding a small padding
      longitudeDelta: maxLongitude - minLongitude + 0.01,
    };
  };

  if (!activeTrip) {
    return <Text>Loading...</Text>;
  }

  const { centerLatitude, centerLongitude, latitudeDelta, longitudeDelta } =
    getBoundingBox(activeTrip.userPath);

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: centerLatitude,
            longitude: centerLongitude,
            latitudeDelta: latitudeDelta,
            longitudeDelta: longitudeDelta,
          }}
        >
          <Polyline
            coordinates={activeTrip.userPath}
            strokeColor="#000"
            strokeWidth={3}
          />
          <Marker coordinate={activeTrip.userPath[0]} title="Start" />
          <Marker
            coordinate={activeTrip.userPath[activeTrip.userPath.length - 1]}
            title="End"
          />
        </MapView>
        <Text style={styles.text}>
          Total Time: {activeTrip.driven_time} seconds
        </Text>
        <TouchableOpacity style={styles.finishButton} onPress={finishTrip}>
          <Text style={styles.buttonText}>Finish</Text>
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
  card: {
    width: "90%",
    padding: 16,
    borderRadius: 8,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
  },
  map: {
    width: "100%",
    height: 300,
    borderRadius: 8,
  },
  text: {
    padding: 16,
    fontSize: 18,
    color: "#333333",
  },
  finishButton: {
    backgroundColor: "#007BFF",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
  },
});

export default JourneyDetailsScreen;
