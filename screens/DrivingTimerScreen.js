import React, { useEffect, useContext } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  BackHandler,
} from "react-native";
import PushNotification from "react-native-push-notification";
import LottieView from "lottie-react-native";
import { useService } from "../context/ServiceContext";
import {
  createEmployeeCheckOut,
  changeServiceState,
} from "../service/authservice";
import { AuthContext } from "../context/UserAuth";

function DrivingTimerScreen({ navigation, route }) {
  const { userId, password, setShouldReloadServices } = useContext(AuthContext);

  useEffect(() => {
    PushNotification.localNotification({
      channelId: "timer-channel",
      id: 1,
      message: `You are driving`,
      playSound: true,
      soundName: "default",
      ongoing: true,
      // Other notification options...
    });

    // Custom back handler
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      () => true // Return true to disable back button
    );

    return () => backHandler.remove();
  }, []);

  const confirmAndNavigate = (action, state) => {
    Alert.alert(
      `Fertig!`,
      `Ihre Fahrt jetzt ${action.toLowerCase()}?`,
      [
        {
          text: "Nein",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel",
        },
        {
          text: "Ja",
          onPress: async () => {
            // Perform check-out here
            const checkOutId = await createEmployeeCheckOut(
              route.params?.checkinId,
              userId,
              password
            );
            const changeState = await changeServiceState(
              userId,
              route.params?.serviceId,
              state,
              password
            );
            setShouldReloadServices(true);
            PushNotification.cancelLocalNotification({id: '1'});
            console.log("Check-out ID:", checkOutId);
            console.log("change")
            // Navigate after successful check-out
            navigation.navigate("Main");
          },
        },
      ]
    );
  };

  const cancelDriving = () => {
    confirmAndNavigate("Stornieren", "cancelled");
  };

  const stopDriving = () => {
    confirmAndNavigate("Beenden","done");
  };

  return (
    <View style={styles.container}>
      <View style={styles.animationWrapper}>
        {/* Lottie Animation */}
        <LottieView
          source={require("../assets/Animation - 1699361565106.json")} // Adjust the path to your Lottie file
          autoPlay
          loop
        />
      </View>
      <View style={styles.buttonWrapper}>
        <TouchableOpacity
          style={[styles.button, { backgroundColor: "orange" }]}
          onPress={cancelDriving}
        >
          <Text style={styles.buttonText}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, { backgroundColor: "red" }]}
          onPress={stopDriving}
        >
          <Text style={styles.buttonText}>Stop</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F2F2F2",
    alignItems: "center",
    justifyContent: "center",
  },
  animationWrapper: {
    width: 300, // Adjust size as needed
    height: 300, // Adjust size as needed
    marginBottom: 40,
  },
  infoContainer: {
    marginBottom: 20,
  },
  infoText: {
    fontSize: 18,
    color: "#333333",
    marginBottom: 10,
  },
  buttonWrapper: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    paddingHorizontal: 40,
  },
  button: {
    backgroundColor: "#333333",
    borderRadius: 25,
    width: 100,
    height: 100,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 18,
  },
});

export default DrivingTimerScreen;
