import React, { useState, useEffect, createContext } from "react";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import RootNavigator from "./Navigator/RootNavigator";
import { ThemeProvider } from "./context/ThemeContext";
import PushNotification from "react-native-push-notification";
import PushNotificationIOS from "@react-native-community/push-notification-ios";
import { getToken } from "./service/authservice";
import { AuthContext } from "./context/UserAuth";
/*
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
  channelId:"timer-channel",
   // (optional) Called when the user fails to register for remote notifications. Typically occurs when APNS is having issues, or the device is a simulator. (iOS)
  onRegistrationError: function(err) {
    console.error(err.message, err);
  },

  permissions: {
    alert: true,
    badge: true,
    sound: true,
  },
  popInitialNotification: true,
  requestPermissions: Platform.OS === 'ios'

});
*/

export default function App() {
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(null);

  useEffect(() => {
    const checkToken = async () => {
      const token = await getToken();
      setIsUserLoggedIn(!!token); // Ensure it's a boolean
    };

    checkToken();
  }, []);

  return (
    <AuthContext.Provider value={{ isUserLoggedIn, setIsUserLoggedIn }}>
      <ThemeProvider>
        <NavigationContainer>
          <RootNavigator />
        </NavigationContainer>
      </ThemeProvider>
    </AuthContext.Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
