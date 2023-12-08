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
import { fetchVehicleServices } from "../service/authservice";
import { useService } from "../context/ServiceContext";
import { AuthContext } from "../context/UserAuth";
import * as SecureStore from "expo-secure-store";
import LottieView from "lottie-react-native";
import PushNotification from "react-native-push-notification";

function HomeScreen({ navigation }) {
  const theme = useTheme();
  const styles = createStyles(theme);
  const [services, setServices] = useState([]);
  const { activeService, setActiveService } = useService();
  const [refreshing, setRefreshing] = useState(false); // Add this line
  const { setIsUserLoggedIn, userId, password, setEmployeeId } =
    useContext(AuthContext);
  const [isLoading, setIsLoading] = useState(true);

  const { shouldReloadServices, setShouldReloadServices } =
    useContext(AuthContext);

  useEffect(() => {
    PushNotification.createChannel(
      {
        channelId: "timer-channel", // (required)
        channelName: "Timer Channel", // (required)
        channelDescription: "A channel for timer notifications", // (optional) default: undefined.
        vibrate: false,
        sound: true,
        onlyAlertOnce: true,
      },
      (created) => console.log(`createChannel returned '${created}'`) // (optional) callback returns whether the channel was created, false means it already existed.
    );
  }, []);

  const notifythis = () => {
    PushNotification.localNotification({
      channelId: "timer-channel",
      id: 1,
      message: `Timer läuft`,
      playSound: true,
      soundName: "default",
      ongoing: true,
      // Other notification options...
    });
  };

  const notnotifythis = () => {
    PushNotification.cancelLocalNotification({id: 1});
  };

  const loadServices = async () => {
    setIsLoading(true);
    try {
      // Assuming vehicleId is available or retrieved from context/user input
      const fetchedServices = await fetchVehicleServices(
        userId,
        "todo",
        password
      );
      const employeeid = await SecureStore.getItemAsync("employeeId");
      console.log("the suer" + userId);
      setServices(fetchedServices);
      setEmployeeId(employeeid);
      console.log(fetchedServices);
      console.log(employeeid);
    } catch (error) {
      console.error("Error loading services:", error);
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    loadServices();
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
    await loadServices(); // Call loadServices again to fetch new data
    setRefreshing(false);
  };

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
          <View style={styles.header}>
            <Text style={styles.title}>Dienstplan</Text>
          </View>
          <FlatList
            data={services}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => {
                  setActiveService(item);
                  navigation.navigate("ServiceDetailScreen");
                }}
              >
                <Card
                  vehicleName={item.vehicle_id[1]} // Vehicle name
                  serviceType={item.service_type_id[1]} // Service type
                  serviceDate={item.date} // Service date
                  description={item.description}
                />
              </TouchableOpacity>
            )}
            contentContainerStyle={styles.content}
            refreshing={refreshing}
            onRefresh={reloadServices}
          />
        </>
      )}
      <TouchableOpacity
        onPress={() => {
          notifythis();
        }}
      >
       <Text>i am here to notify</Text> 
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => {
          notnotifythis();
        }}
      >
       <Text>i am not here to notify</Text> 
      </TouchableOpacity>
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
export default HomeScreen;
