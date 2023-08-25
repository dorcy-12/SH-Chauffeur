import React, { useState, useEffect } from "react";
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

function MapScreen({ navigation, route }) {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [currentInput, setCurrentInput] = useState("");
  const [destinationInput, setDestinationInput] = useState("");
  const theme = useTheme();
  const styles = createStyles(theme);

  useEffect(() => {
    if (route.params?.location) {
      setDestinationInput(route.params.location);
    }
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        return;
      }

      let currentLocation = await Location.getCurrentPositionAsync({});
      console.log(currentLocation);
      setLocation(currentLocation);

      // Reverse geocoding to get the street name
      let address = await Location.reverseGeocodeAsync({
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude,
      });

      if (address && address.length > 0) {
        console.log(address)
        console.log("Street Name:", address[0].street);
        setCurrentInput(address[0].street + "," + address[0].streetNumber)

      }
    })();

    // Set modal visibility after 1 second regardless of location fetch status
    setTimeout(() => {
      setModalVisible(true);
    }, 1000);
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      {location ? (
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
        >
          <Marker
            coordinate={{
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
            }}
            title="My Location"
          />
        </MapView>
      ) : (
        <Text>{errorMsg ? errorMsg : "Fetching location..."}</Text>
      )}
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
                // Handle the drive action here
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
  });
export default MapScreen;
