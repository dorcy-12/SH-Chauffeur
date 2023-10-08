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
const mockTrips = [
  {
    id: 1,
    vehicle: { vehicle_number: "1234" },
    end_location: "Davenportplatz",
    start_time: new Date().toISOString(),
  },
  {
    id: 2,
    vehicle: { vehicle_number: "5678" },
    end_location: "Frankfurt",
    start_time: new Date().toISOString(),
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
      const fetchedTrips = mockTrips
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
        data={trips}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() =>
              navigation.navigate("Map", { location: item.end_location })
            }
          >
            <Card
              number={item.vehicle.vehicle_number}
              location={item.end_location}
              time={new Date(item.start_time).toLocaleTimeString().slice(0, 4)}
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
