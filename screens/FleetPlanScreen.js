import React, { useState, useContext, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  SafeAreaView,
  Platform,
  StatusBar,
  Modal,
  TextInput,
  Button,
} from "react-native";
import { AntDesign, Ionicons } from "@expo/vector-icons";
import { useTheme } from "../context/ThemeContext";
import { AuthContext } from "../context/UserAuth";
import DateTimePicker from "@react-native-community/datetimepicker";
import { getCars, insertCar, getUsers } from "../database";
import { fetchVehicles } from "../service/authservice";
import LottieView from "lottie-react-native";
function FleetPlanScreen({ navigation }) {
  const theme = useTheme();
  const styles = createStyles(theme);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [mode, setMode] = useState("date");
  const { userId } = useContext(AuthContext);
  const [fleetData, setFleetData] = useState([
    {
      id: "1",
      driver: "John Doe",
      car: "Car A",
      destination: "City Center",
      status: "En Route",
    },
    // Add more fleet data here
  ]);
  const [cars, setCars] = useState({});
  const [employees, setEmployees] = useState({});
  const [searchText, setSearchText] = useState("");
  const [filteredFleetData, setFilteredFleetData] = useState(fleetData);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [newPlan, setNewPlan] = useState({
    driver: "",
    description: "",
    car: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  
  
  useEffect(() => {
    const fetchAndStoreVehicles = async () => {
      const localCars = await getCars();
      const employees = await getUsers();
      setEmployees(employees);
      if (localCars == null) {
        console.log("fetching from server");
        const serverVehicles = await fetchVehicles(userId);
        console.log(serverVehicles);
        setCars(serverVehicles);
        const insertPromises = serverVehicles.map(async (vehicle) => {
          await insertCar(
            vehicle.id,
            vehicle.name,
            vehicle.description,
            vehicle.license_plate
          );
        });

        // Wait for all insert operations to complete
        await Promise.all(insertPromises);

        setIsLoading(false);
      } else {
        console.log("fetching from local " + cars);
        setCars(localCars);
        setIsLoading(false);
      }
    };
    fetchAndStoreVehicles().catch(console.error);
  }, []);

  // Function to navigate to add plan screen
  const navigateToAddPlan = () => {
    navigation.navigate("AddPlanScreen"); // Replace with your navigation logic
  };
  const handleSearch = (text) => {
    setSearchText(text);
    if (text) {
      const filteredData = fleetData.filter(
        (item) =>
          item.driver.toLowerCase().includes(text.toLowerCase()) ||
          item.status.toLowerCase().includes(text.toLowerCase())
      );
      setFilteredFleetData(filteredData);
    } else {
      setFilteredFleetData(fleetData);
    }
  };
  const toggleModal = () => {
    setIsModalVisible(!isModalVisible);
  };

  const handleInputChange = (name, value) => {
    setNewPlan({ ...newPlan, [name]: value });
  };
  const showDatePicker = () => {
    setMode("date");
  };

  const showTimePicker = () => {
    setMode("time");
  };

  // Render fleet item
  const renderFleetItem = ({ item }) => (
    <View style={styles.fleetItem}>
      <View style={styles.header}>
        <Text style={styles.itemText}>{item.car}</Text>
        <Ionicons name="car-sport" size={25} color="black" />
      </View>
      <View style={styles.body}>
        <Text style={styles.itemText}>Driver: {item.driver}</Text>

        <Text style={styles.itemText}>Destination: {item.destination}</Text>
        <Text style={styles.itemText}>Status: {item.status}</Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
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
        <>
          <Modal
            animationType="slide"
            transparent={true}
            visible={isModalVisible}
            onRequestClose={toggleModal}
          >
            <View style={styles.modalContainer}>
              <View style={styles.modalView}>
                <Text style={styles.modalTitle}>Neuen Plan Erstellen</Text>
                <TextInput
                  placeholder="Fahrer"
                  style={styles.textInput}
                  // other props
                />
                <TextInput
                  placeholder="Auto"
                  style={styles.textInput}
                  // other props
                />
                <TextInput
                  placeholder="Beschreibung"
                  style={[styles.textInput, styles.descriptionInput]} // Updated style
                  multiline
                  numberOfLines={4} // Increased number of lines
                  // other props
                />

                <TouchableOpacity
                  onPress={showDatePicker}
                  style={styles.datePickerButton}
                >
                  <Text>Datum: {selectedDate.toLocaleDateString()}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={showTimePicker}
                  style={styles.datePickerButton}
                >
                  <Text>Zeit: {selectedDate.toLocaleTimeString()}</Text>
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
                <TouchableOpacity style={styles.submitButton}>
                  <Text style={styles.submitText}>Plan Erstellen</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
          <Text style={styles.title}>Fleet Plans</Text>
          <View style={styles.searchBar}>
            <AntDesign name="search1" size={18} color="#aaa" />
            <TextInput
              style={styles.searchInput}
              placeholder="Search employees"
              value={searchText}
              onChangeText={handleSearch}
            />
          </View>
          <FlatList
            data={filteredFleetData}
            renderItem={renderFleetItem}
            keyExtractor={(item) => item.id}
          />
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => setIsModalVisible(true)}
          >
            <AntDesign name="pluscircle" size={50} color="black" />
          </TouchableOpacity>
        </>
      )}
    </SafeAreaView>
  );
}

const createStyles = (theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#fff",

      paddingTop: Platform.OS == "android" ? StatusBar.currentHeight : 0,
      paddingHorizontal: 10,
    },
    title: {
      fontSize: 24,
      fontWeight: "bold",
      textAlign: "center",
      marginVertical: 15,
    },
    searchBar: {
      flexDirection: "row",
      marginVertical: 30,
      paddingVertical: 10,
      paddingHorizontal: 20,
      borderWidth: 1,
      borderColor: "#ddd",
      borderRadius: 10,
      alignItems: "center",
    },
    searchInput: {
      fontSize: 16,
      marginLeft: 10,
    },
    fleetItem: {
      backgroundColor: "white",
      overflow: "hidden",
      marginVertical: 8,
      marginHorizontal: 10,
      borderRadius: 10,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    itemText: {
      fontSize: 16,
      marginBottom: 5,
    },
    addButton: {
      position: "absolute",
      bottom: 20,
      right: 20,
    },
    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      backgroundColor: theme.primary,
      paddingVertical: 10,
      paddingHorizontal: 20,
    },
    body: {
      paddingHorizontal: 20,
      paddingVertical: 10,
    },
    modalContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
    modalView: {
      backgroundColor: "white",
      borderRadius: 20,
      padding: 20,
      width: "90%",
      alignItems: "center",
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 5,
    },
    modalTitle: {
      fontSize: 20,
      fontWeight: "bold",
      marginBottom: 15,
    },
    textInput: {
      width: "100%",
      padding: 10,
      marginVertical: 8,
      borderWidth: 1,
      borderColor: "#ddd",
      borderRadius: 5,
      backgroundColor: "#f9f9f9",
    },
    submitButton: {
      backgroundColor: theme.primary,
      padding: 10,
      borderRadius: 5,
      marginTop: 10,
      width: "100%",
      alignItems: "center",
    },
    submitText: {
      fontSize: 16,
      fontWeight: "bold",
      color: "white",
    },
    descriptionInput: {
      height: 100, // Increased height
    },
    datePickerButton: {
      padding: 10,
      marginVertical: 10,
      backgroundColor: "#f0f0f0",
      borderRadius: 5,
      alignItems: "center",
    },
    loadingContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },
    lottieAnimation: {
      width: 200, // Set the size as needed
      height: 200, // Set the size as needed
    },
  });

export default FleetPlanScreen;
