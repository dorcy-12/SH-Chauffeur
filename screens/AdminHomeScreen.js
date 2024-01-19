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
  Modal,
  TextInput,
} from "react-native";
import Card from "../Components/Card";
import { useTheme } from "../context/ThemeContext";
import * as SecureStore from "expo-secure-store";
import LottieView from "lottie-react-native";
import PushNotification from "react-native-push-notification";
import DateTimePicker from "@react-native-community/datetimepicker";

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
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [mode, setMode] = useState("date");
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
  const toggleModal = () => {
    setIsModalVisible(!isModalVisible);
  };
  const onDateChange = (event, date) => {
    setSelectedDate(date || selectedDate);
  };
  const showDatePicker = () => {
    setMode("date");
  };

  const showTimePicker = () => {
    setMode("time");
  };

  return (
    <SafeAreaView style={styles.container}>
      <Modal
        animationType="slide"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={toggleModal}
      >
        <View style={styles.modalView}>
          <TextInput placeholder="Car" style={styles.textInput} />
          <TextInput placeholder="Driver Name" style={styles.textInput} />
          <TextInput
            placeholder="Description"
            style={styles.textInput}
            multiline
          />
          <TouchableOpacity
            onPress={showDatePicker}
            style={styles.datePickerButton}
          >
            <Text>Select Date</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={showTimePicker}
            style={styles.datePickerButton}
          >
            <Text>Select Time</Text>
          </TouchableOpacity>
          {mode && (
            <DateTimePicker
              value={selectedDate}
              mode={mode}
              is24Hour={true}
              display="default"
              onChange={(event, date) => {
                setMode(null); // Hide picker after selection
                setSelectedDate(date || selectedDate);
              }}
            />
          )}
          <Button title="Create Plan" />
        </View>
      </Modal>

      <Text style={styles.greetings}>Willkommen,</Text>
      <View style={styles.row}>
        <TouchableOpacity
          style={styles.card}
          onPress={() => navigation.navigate("employeeList")}
        >
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Alle Mitarbeiter</Text>
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
            <Text style={styles.headerTitle}>Active Mitarbeiter</Text>
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
            <Text style={styles.headerTitle}>Inactive Mitarbeiter</Text>
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
            <Text style={styles.headerTitle}>Arbeit Stunden</Text>
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
      <TouchableOpacity onPress={toggleModal}>
        <AntDesign name="pluscircle" size={50} color="black" />
      </TouchableOpacity>
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
      flexDirection: "column",
      justifyContent: "space-between",
    },
    description: {
      fontSize: 30, // Adjusted font size
      fontWeight: "bold", // Changed font weight
      color: "#333333", // Updated color for better readability
      alignSelf: "flex-end",
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
    modalView: {
      margin: 20,
      backgroundColor: "white",
      borderRadius: 20,
      padding: 35,
      alignItems: "center",
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 5,
    },
    textInput: {
      width: "100%",
      padding: 10,
      marginVertical: 10,
      borderWidth: 1,
      borderColor: "#ddd",
      borderRadius: 5,
      backgroundColor: "#f9f9f9",
    },
    datePicker: {
      width: "100%",
      padding: 10,
      marginVertical: 10,
    },
    datePickerButton: {
      padding: 10,
      marginVertical: 10,
      backgroundColor: "#f0f0f0",
      borderRadius: 5,
      alignItems: 'center',
    },
    
  });

export default AdminHomeScreen;
