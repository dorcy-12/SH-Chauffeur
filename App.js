import React, { useState, useEffect, createContext } from "react";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, Alert } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import RootNavigator from "./Navigator/RootNavigator";
import { ThemeProvider } from "./context/ThemeContext";
import PushNotification from "react-native-push-notification";
import PushNotificationIOS from "@react-native-community/push-notification-ios";
import * as SecureStore from "expo-secure-store";
import { AuthContext } from "./context/UserAuth";
import { ServiceProvider } from "./context/ServiceContext";
import loading from "./assets/loading.json";
import LottieView from "lottie-react-native";
import {
  requestUserPermission,
  NotificationListener,
} from "./src/Utils/pushnotifications";
import messaging from "@react-native-firebase/messaging";
import AsyncStorage from "@react-native-async-storage/async-storage";

PushNotification.configure({
  onRegister: function (token) {
    console.log("TOKEN:", token);
  },

  // (required) Called when a remote is received or opened, or local notification is opened
  onNotification: function (notification) {
    console.log("NOTIFICATION:", notification);

    // process the notification

    // (required) Called when a remote is received or opened, or local notification is opened
    notification.finish(PushNotificationIOS.FetchResult.NoData);
  },

  // (optional) Called when Registered Action is pressed and invokeApp is false, if true onNotification will be called (Android)
  onAction: function (notification) {
    console.log("ACTION:", notification.action);
    console.log("NOTIFICATION:", notification);

    // process the action
  },
  channelId: "timer-channel",
  // (optional) Called when the user fails to register for remote notifications. Typically occurs when APNS is having issues, or the device is a simulator. (iOS)
  onRegistrationError: function (err) {
    console.error(err.message, err);
  },

  permissions: {
    alert: true,
    badge: true,
    sound: true,
  },
  popInitialNotification: true,
  requestPermissions: Platform.OS === "ios",
});

export default function App() {
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(null);
  const [userId, setUserId] = useState(null);
  const [partnerId, setPartnerId] = useState(null);
  const [employeeProfile, setEmployeeProfile] = useState(null);
  const [password, setPassword] = useState(null);
  const [shouldReloadServices, setShouldReloadServices] = useState(false);
  const [channels, setChannels] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkToken = async () => {
      const uid = await SecureStore.getItemAsync("userId");
      const password = await SecureStore.getItemAsync("password");
      const employeeProfile = await SecureStore.getItemAsync("employeeProfile");
      const remoteChannels = await AsyncStorage.getItem("channels");
      if (uid && password && employeeProfile) {
        setIsUserLoggedIn(true);
        setUserId(uid); // Assuming token is the userId
        setPassword(password);
        setEmployeeProfile(JSON.parse(employeeProfile));
        setChannels(JSON.parse(remoteChannels));
      }

      setIsLoading(false); // Update loading state after check
      console.log("app is re renderd" + isLoading);
    };

    checkToken();
  }, []);

  useEffect(() => {
    async function setupNotifications() {
      await requestUserPermission();
      NotificationListener();
    }

    setupNotifications();
  }, []); // Adding an empty dependency array to run only once

  return (
    <AuthContext.Provider
      value={{
        isUserLoggedIn,
        setIsUserLoggedIn,
        userId,
        setUserId,
        partnerId,
        setPartnerId,
        employeeProfile,
        setEmployeeProfile,
        password,
        setPassword,
        shouldReloadServices,
        setShouldReloadServices,
        channels,
        setChannels,
      }}
    >
      <ThemeProvider>
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <LottieView
              source={loading}
              autoPlay
              loop
              style={styles.lottieAnimation}
            />
          </View>
        ) : (
          <NavigationContainer>
            <ServiceProvider>
              <RootNavigator />
            </ServiceProvider>
          </NavigationContainer>
        )}
      </ThemeProvider>
    </AuthContext.Provider>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  lottieAnimation: {
    width: 200, // Set the size as needed
    height: 200, // Set the size as needed
  },
  // ... other styles
});
