import React from "react";
import { View, Text, ScrollView, StyleSheet, StatusBar } from "react-native";
import { useTheme } from "../context/ThemeContext";
import { Ionicons } from "@expo/vector-icons";
import TripCard from "../Components/TripCard";

const DocumentsScreen = () => {
  const theme = useTheme();
  const styles = createStyles(theme);

  const trips = [
    {
      carNumber: "SH 302",
      startTime: "8:30 AM",
      endTime: "10:00 AM",
      date: "20th August 2023",
      kilometers: "45",
    },
    {
      carNumber: "SH 303",
      startTime: "8:30 AM",
      endTime: "10:00 AM",
      date: "24th August 2023",
      kilometers: "45",
    },
    // ... Add more trip objects here
  ];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Fahrten</Text>
      </View>
      <View style={styles.content}>
        {trips.map((trip, index) => (
          <TripCard key={index} trip={trip} />
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
        marginBottom:30,
        marginTop:20
        // Add any other styling
      },
      title: {
        fontSize: 24,
        fontWeight: "bold",
      },
  });

export default DocumentsScreen;
