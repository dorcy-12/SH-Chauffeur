import React, { useState, useEffect, useMemo } from "react";
import { View, Text, ScrollView, StyleSheet, StatusBar } from "react-native";
import { useTheme } from "../context/ThemeContext";
import { Ionicons } from "@expo/vector-icons";
import TripCard from "../Components/DriveCard";
import * as SecureStore from "expo-secure-store";
import { useService } from "../context/ServiceContext";

const DocumentsScreen = () => {
  const theme = useTheme();
  const styles = createStyles(theme);
  const { activeService, setActiveService, allServices, setAllServices } = useService();


  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Fahrten</Text>
      </View>
      <View style={styles.content}>
        <Text>Hi</Text>
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
