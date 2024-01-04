import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  StatusBar,
  FlatList,
  SafeAreaView,
} from "react-native";
import { useTheme } from "../context/ThemeContext";
import DriveCard from "../Components/DriveCard";
import { AuthContext } from "../context/UserAuth";
import {fetchVehicleServices } from "../service/authservice"; // Import your API call function

const DocumentsScreen = () => {
  const theme = useTheme();
  const styles = createStyles(theme);
  const [refreshing, setRefreshing] = useState(false);
  const [drives, setDrives] = useState([]); // State to store the drives
  const {
    setIsUserLoggedIn,
    userId,
    password,
    shouldReloadServices,
    setShouldReloadServices,
  } = useContext(AuthContext);
  const loadDrives = async () => {
    try {
      const cancelledDrives = await fetchVehicleServices(userId, "cancelled", password);
      console.log("Cancelled Drives:", cancelledDrives);
  
      // Fetch 'done' drives
      const doneDrives = await fetchVehicleServices(userId, "done", password);
      console.log("Done Drives:", doneDrives);
  
      // Combine both arrays
      const combinedDrives = [...cancelledDrives, ...doneDrives];
      console.log("Combined Drives:", combinedDrives);
  
      // Update state with combined drives
      setDrives(combinedDrives);
    } catch (error) {
      console.error("Error fetching drives:", error);
    }
  };

  useEffect(() => {
    loadDrives();
  }, []);
  useEffect(() => {
    if (shouldReloadServices) {
      reloadServices();
      setShouldReloadServices(false);
      console.log("services reloaded");
    }
  }, [shouldReloadServices]);

  const reloadServices = async () => {
    setRefreshing(true);
    await loadDrives(); // Call loadServices again to fetch new data
    setRefreshing(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Fahrten</Text>
      </View>
      <FlatList
        data={drives}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => <DriveCard drive={item} />}
        contentContainerStyle={styles.content}
        refreshing={refreshing}
        onRefresh={reloadServices}
      />
    </SafeAreaView>
  );
};

const createStyles = (theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.tertiary,
      paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
    },
    content: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
    },
    header: {
      width: "100%",
      alignItems: "center",
      justifyContent: "center",
      marginBottom: 30,
      marginTop: 20,
    },
    title: {
      fontSize: 24,
      fontWeight: "bold",
    },
    content: {
      paddingHorizontal: 10,
      // Add any other styling
    },
  });

export default DocumentsScreen;
