import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  StyleSheet,
  View,
  Text,
  Dimensions,
  SafeAreaView,
  Modal,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { useTheme } from "../context/ThemeContext";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";
import { Ionicons, AntDesign } from "@expo/vector-icons";
import { useTrip } from "../context/TripContext";

function MapScreen({ navigation, route }) {
  const [location, setLocation] = useState(null);
  const [destinationCoords, setDestinationCoords] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [currentInput, setCurrentInput] = useState("");
  const [destinationInput, setDestinationInput] = useState("");
  const mapRef = useRef(null);
  const theme = useTheme();
  const styles = createStyles(theme);
  const {activeTrip, setActiveTrip }= useTrip();

  useEffect(() => {
    loadInitialData();
    const timerId = setTimeout(() => {
      setModalVisible(true);
    }, 1000);

    return () => clearTimeout(timerId);
  }, []);

  const loadInitialData = async () => {
    const currentLocation = await getCurrentLocation();
    const streetAddress = await reverseGeocodeLocation(currentLocation);
    setCurrentInput(streetAddress);
    if (currentLocation && streetAddress) {
      updateActiveTrip(currentLocation, streetAddress);
    }
  };

  const getCurrentLocation = useCallback(async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      setErrorMsg("Permission to access location was denied");
      return null;
    }
    console.log(1);

    let currentLocation = await Location.getCurrentPositionAsync({});
    setLocation(currentLocation);
    return currentLocation;
  }, []);

  const reverseGeocodeLocation = useCallback(async (location) => {
    if (!location) return "";

    console.log(2);
    let address = await Location.reverseGeocodeAsync({
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
    });

    if (address && address.length > 0) {
      return address[0].street + "," + address[0].streetNumber;
    }
    return "";
  }, []);

  const updateActiveTrip = async (currentLocation, streetAddress) => {
    console.log(3);
    if (!activeTrip) return;
    
    // Update the destination input
    setDestinationInput(activeTrip.end_location);
    
    const coords = await Location.geocodeAsync(activeTrip.end_location);
    if (coords && coords.length > 0) {
      setDestinationCoords(coords[0]);
    }

    // Update the active trip's start location and set the updated trip in context
    const updatedTrip = {
      ...activeTrip,
      start_location: streetAddress
    };
    setActiveTrip(updatedTrip);
    
    if (mapRef.current) {
      mapRef.current.fitToCoordinates([currentLocation.coords, coords[0]], {
        edgePadding: { top: 50, right: 50, bottom: 50, left: 50 },
        animated: true,
      });
    }
  };
  const toggleModalVisibility = () => {
    console.log(4);
    setModalVisible(true);
  };

  return (
    <SafeAreaView style={styles.container}>
      {location ? (
        <MapView
          ref={mapRef}
          style={styles.map}
          initialRegion={{
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
            latitudeDelta: 0.009,
            longitudeDelta: 0.009,
          }}
        >
          <Marker
            coordinate={{
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
            }}
            title="My Location"
          />
          {destinationCoords && (
            <Marker coordinate={destinationCoords} title="Destination" />
          )}
        </MapView>
      ) : (
        <Text>{errorMsg ? errorMsg : "Fetching location..."}</Text>
      )}

      {/* Button to Toggle Modal */}
      <TouchableOpacity
        style={styles.toggleModalButton}
        onPress={toggleModalVisibility}
      >
        <AntDesign name="car" size={24} color="#FFFFFF" />
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <TextInput
              placeholder="Current Location"
              value={currentInput}
              onChangeText={setCurrentInput}
              style={styles.input}
            />
            <TextInput
              placeholder="Destination"
              value={destinationInput}
              onChangeText={setDestinationInput}
              style={styles.input}
            />
            <TouchableOpacity
              style={styles.button}
              onPress={() => {
                navigation.navigate("Timer");
                setModalVisible(false);
              }}
            >
              <Text style={styles.buttonText}>Jetzt fahren</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const createStyles = (theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },
    map: {
      flex: 1,
      width: Dimensions.get("window").width,
      height: Dimensions.get("window").height,
    },
    centeredView: {
      flex: 1,
      justifyContent: "flex-end",
      alignItems: "center",
    },
    modalView: {
      width: "90%",
      backgroundColor: "white",
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      padding: 20,
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
    input: {
      width: "95%",
      height: 58,
      marginVertical: 15,
      paddingHorizontal: 25,
      backgroundColor: "#ffffff",
      // iOS shadow properties
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.23,
      shadowRadius: 2.62,
      // Android shadow property
      elevation: 9,
      borderRadius: 16,
    },
    button: {
      width: "60%",
      height: 45,
      backgroundColor: theme.primary, // Change to your preferred color
      borderRadius: 40,
      justifyContent: "center",
      alignItems: "center",
      marginTop: 10,
      // iOS shadow properties
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.23,
      shadowRadius: 2.62,
      // Android shadow property
      elevation: 4,
    },
    buttonText: {
      color: theme.primaryText,
      fontSize: 16,
      fontWeight: "bold",
    },
    toggleModalButton: {
      position: "absolute", // Here's the trick
      bottom: 20, // Position from the bottom
      right: 20, // Position from the right
      width: 100,
      height: 50,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: theme.primary, // Change to your preferred color
      borderRadius: 25,
      // Add shadow for iOS
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.23,
      shadowRadius: 2.62,
      // Add elevation for Android
      elevation: 4,
    },
    buttonText: {
      color: theme.primaryText,
      fontSize: 16,
      fontWeight: "bold",
    },
  });
export default MapScreen;
