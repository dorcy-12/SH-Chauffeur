import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, StyleSheet, StatusBar } from "react-native";
import { useTheme } from "../context/ThemeContext";
import { Ionicons } from "@expo/vector-icons";
import TripCard from "../Components/TripCard";
import * as SecureStore from "expo-secure-store";
import { useTrip } from "../context/TripContext";


const DocumentsScreen = () => {
  const theme = useTheme();
  const styles = createStyles(theme);

  const {trips, setTrips, allTrips,setAllTrips} = useTrip();


  useEffect(() => {
    const fetchCompletedTrips = async () => {
      try {
        const storedTripsString = await SecureStore.getItemAsync("trips");
        const allTrips = storedTripsString ? JSON.parse(storedTripsString) : [];
        const completedTrips = allTrips.filter((trip) => trip.is_completed);
        setTrips(completedTrips);
      } catch (error) {
        console.error("Error fetching trips:", error);
      }
    };

    fetchCompletedTrips();
  }, []);
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Fahrten</Text>
      </View>
      <View style={styles.content}>
        {trips.map((trip, index) => (
          <TripCard
            key={index}
            trip={{
              carNumber: trip.vehicle.vehicle_number,
              startTime: new Date(trip.start_time).toLocaleTimeString(),
              endTime: new Date(trip.stopped).toLocaleTimeString(),
              date: new Date(trip.start_time).toLocaleDateString(),
              kilometers: trip.distance,
            }}
          />
        ))}
      </View>
    </ScrollView>
  );
};

const createStyles = (theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.tertiary,
      paddingTop: Platform.OS == "android" ? StatusBar.currentHeight : 0,
    },
    content: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      // Add any other styling
    },
    header: {
      width: "100%",
      alignItems: "center",
      justifyContent: "center",
      marginBottom: 30,
      marginTop: 20,
      // Add any other styling
    },
    title: {
      fontSize: 24,
      fontWeight: "bold",
    },
  });

export default DocumentsScreen;
