import React, { useState, useEffect } from "react";
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
import { fetchTrips } from "../service/authservice";
import * as SecureStore from 'expo-secure-store';


const mockTrips = [

  {
    id: 1,
    vehicle: { vehicle_number: "1234" },
    start_location: "",
    end_location: "Davenportplatz",
    start_time: new Date().toISOString(),
    driven_time: 0,
    distance: 0,
    stopped:"",
    userPath: null,
    is_completed: false
  },
  {

    id: 2,
    vehicle: { vehicle_number: "5678" },
    start_location: "",
    end_location: "Opelstrase, 12",
    start_time: new Date().toISOString(),
    driven_time: 0,
    distance: 0,
    stopped:"",
    userPath: null,
    is_completed:false
  },
  // ... Add more mock trips as needed
];
function HomeScreen({ navigation }) {
  const theme = useTheme();
  const styles = createStyles(theme);
  const [trips, setTrips] = useState([]);

  const [refreshing, setRefreshing] = useState(false); // Add this line

  useEffect(() => {
    loadTrips();
  }, []);
  

  const loadTrips = async () => {
    setRefreshing(true);
    try {
      await SecureStore.setItemAsync('trips', JSON.stringify(mockTrips));
      console.log("updated the trips successfully");
      const fetchedTripsData = await SecureStore.getItemAsync("trips");
      const fetchedTrips = fetchedTripsData ? JSON.parse(fetchedTripsData) : [];
      setTrips(fetchedTrips);
    } catch (error) {
      console.error("Error loading trips:", error);
    }
    setRefreshing(false); // Set refreshing to false after loading is complete
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Dienstplan</Text>
      </View>
      {/* Content */}

      <FlatList
        data={trips.filter(trip => !trip.is_completed)}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() =>
              navigation.navigate("Map", {tripId:item.id})
            }
          >
            <Card
              number={item.is_completed ? "true" : "false"}
              location={item.end_location}
              time={new Date(item.start_time).toLocaleTimeString().slice(0,5)}
              date={new Date(item.start_time).toLocaleDateString()}
            />
          </TouchableOpacity>
        )}
        contentContainerStyle={styles.content}
        refreshing={refreshing} // Add this line
        onRefresh={loadTrips} // Add this line
      />
    </SafeAreaView>
  );
}

const createStyles = (theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#F7F8F9",
      paddingTop: Platform.OS == "android" ? StatusBar.currentHeight : 0,
    },
    header: {
      width: "100%",
      alignItems: "center",
      justifyContent: "center",
      marginVertical: 20,
      // Add any other styling
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
export default HomeScreen;
