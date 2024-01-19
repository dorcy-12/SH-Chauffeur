import React, { useState, useEffect, useMemo, useContext } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  Button,
  Platform,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  FlatList,
} from "react-native";
import Card from "../Components/Card";
import { useTheme } from "../context/ThemeContext";
import * as SecureStore from "expo-secure-store";
import LottieView from "lottie-react-native";
import PushNotification from "react-native-push-notification";
import {
  Ionicons,
  MaterialIcons,
  Fontisto,
  AntDesign,
} from "@expo/vector-icons";
import { getUserCounts } from "../database";

function AdminHomeScreen({ navigation }) {
  const theme = useTheme();
  const styles = createStyles(theme);
  const [employeeCounts, setEmployeeCounts] = useState({
    totalEmployees: 0,
    activeEmployees: 0,
    inactiveEmployees: 0,
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    getUserCounts()
      .then((counts) => {
        if (counts) {
          setEmployeeCounts(counts);
        }
        setIsLoading(false); // Stop loading
      })
      .catch((error) => {
        console.log("Error fetching user counts: ", error);
        setIsLoading(false); // Stop loading
      });
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.greetings}>Willkommen,</Text>
      <View style={styles.row}>
        <TouchableOpacity
          style={styles.card}
          onPress={() => navigation.navigate("employeeList")}
        >
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Total Employees</Text>
            <MaterialIcons name="people-outline" size={20} color="black" />
          </View>
          {isLoading ? (
            <View style={styles.loadingContainer}>
              <LottieView
                source={require("../assets/loading.json")}
                autoPlay
                loop
                style={styles.lottieAnimation}
              />
            </View>
          ) : (
            <Text style={styles.description}>
              {employeeCounts.totalEmployees}
            </Text>
          )}
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.card}
          onPress={() =>
            navigation.navigate("employeeList", { filter: "active" })
          }
        >
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Active Employees</Text>
            <Fontisto name="radio-btn-active" size={20} color="green" />
          </View>
          {isLoading ? (
            <View style={styles.loadingContainer}>
              <LottieView
                source={require("../assets/loading.json")}
                autoPlay
                loop
                style={styles.lottieAnimation}
              />
            </View>
          ) : (
            <Text style={styles.description}>
              {employeeCounts.activeEmployees}
            </Text>
          )}
        </TouchableOpacity>
      </View>
      <View style={styles.row}>
        <TouchableOpacity
          style={styles.card}
          onPress={() =>
            navigation.navigate("employeeList", { filter: "inactive" })
          }
        >
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Inactive Employees</Text>
            <Fontisto name="radio-btn-active" size={20} color="red" />
          </View>
          {isLoading ? (
            <View style={styles.loadingContainer}>
              <LottieView
                source={require("../assets/loading.json")}
                autoPlay
                loop
                style={styles.lottieAnimation}
              />
            </View>
          ) : (
            <Text style={styles.description}>
              {employeeCounts.inactiveEmployees}
            </Text>
          )}
        </TouchableOpacity>
        <TouchableOpacity style={styles.card}>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Hours Worked</Text>
            <AntDesign name="clockcircleo" size={20} color="black" />
          </View>
          {isLoading ? (
            <View style={styles.loadingContainer}>
              <LottieView
                source={require("../assets/loading.json")}
                autoPlay
                loop
                style={styles.lottieAnimation}
              />
            </View>
          ) : (
            <Text style={styles.description}>50</Text>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const createStyles = (theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      paddingTop: Platform.OS == "android" ? StatusBar.currentHeight : 0,
      paddingHorizontal: 20,
    },
    greetings: {
      fontSize: 28, // Adjusted font size
      fontWeight: "bold", // Changed font weight
      color: "#333", // Updated color for better readability
      marginVertical: 30,
      width: "80%",
    },
    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginBottom: 10,
    },
    headerTitle: {
      fontSize: 18, // Adjusted font size
      fontWeight: "600", // Changed font weight
      color: "#333333", // Updated color for better readability
      width: "80%",
    },
    card: {
      borderWidth: 0, // Removed border
      backgroundColor: "white",
      padding: 20,
      width: "45%",
      borderRadius: 15, // Increased border radius
      shadowColor: "#000", // Added shadow for depth
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3, // Elevation for Android
    },
    description: {
      fontSize: 30, // Adjusted font size
      fontWeight: "bold", // Changed font weight
      color: "#333333", // Updated color for better readability
    },
    row: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginBottom: 20,
    },
    loadingContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },
    lottieAnimation: {
      width: 60, // Set the size as needed
      height: 60, // Set the size as needed
    },
  });

export default AdminHomeScreen;
