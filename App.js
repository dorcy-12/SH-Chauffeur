import React, { useState, useEffect, useContext } from "react";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import RootNavigator from "./Navigator/RootNavigator";
import { ThemeProvider } from "./context/ThemeContext";
import PushNotification from "react-native-push-notification";
import PushNotificationIOS from "@react-native-community/push-notification-ios";
import * as SecureStore from "expo-secure-store";
import { AuthContext } from "./context/UserAuth";
import { ServiceProvider, useService } from "./context/ServiceContext";
import loading from "./assets/loading.json";
import LottieView from "lottie-react-native";
import * as SQLite from "expo-sqlite";
import {
  NotificationProvider,
  NotificationContext,
} from "./context/NotificationContext";
import {
  requestUserPermission,
  NotificationListener,
} from "./src/Utils/pushnotifications";
import messaging from "@react-native-firebase/messaging";
import { initDB, getChannels, getUsers, getUserProfile } from "./database";
import { MessageProvider, useMessageContext } from "./context/MessageContext";

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

const App2 = () => {
  const { addMessage } = useMessageContext();
  const { addService, updateService, deleteService } = useService();
  const {channels, setChannels} = useContext(AuthContext)
  const { updateNotificationCounts } = useContext(NotificationContext);
  useEffect(() => {
    async function setupNotifications() {
      await requestUserPermission();
      NotificationListener(
        addMessage,
        updateNotificationCounts,
        addService,
        updateService,
        deleteService,
        channels,
        setChannels
      );
    }

    setupNotifications();
  }, []); // Adding an empty dependency array to run only once

  return (
    <NavigationContainer>
      <RootNavigator />
    </NavigationContainer>
  );
};

export default function App() {
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);
  const [userId, setUserId] = useState(null);
  const [partnerId, setPartnerId] = useState(null);
  const [employeeId, setEmployeeId] = useState(null);
  const [password, setPassword] = useState(null);
  const [shouldReloadServices, setShouldReloadServices] = useState(false);
  const [channels, setChannels] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initializeApp = async () => {
      const uid = await SecureStore.getItemAsync("userId");
      console.log(uid);
      const password = await SecureStore.getItemAsync("password");
      const employeeId = await SecureStore.getItemAsync("employeeId");

      console.log("password");
      if (uid && password) {
        const fetchedChannels = await getChannels();
        console.log("fetched cahnnes ", fetchedChannels);
        const user = await getUserProfile(employeeId);
        const partner = user.partner_id;
        console.log("the partner is " + partner);
        setUserId(uid);
        setPassword(password);
        setChannels(fetchedChannels);
        setPartnerId(partner);
        setEmployeeId(employeeId);
        setIsUserLoggedIn(true);
        setIsLoading(false);
      } else {
        initDB((isDbInitialized) => {
          if (isDbInitialized) {
            setIsLoading(false);
          } else {
            console.error("Database initialization failed");
          }
        });
      }
    };

    initializeApp();
  }, []);
  return (
    <AuthContext.Provider
      value={{
        isUserLoggedIn,
        setIsUserLoggedIn,
        userId,
        setUserId,
        partnerId,
        setPartnerId,
        employeeId,
        setEmployeeId,
        password,
        setPassword,
        shouldReloadServices,
        setShouldReloadServices,
        channels,
        setChannels,
      }}
    >
      <NotificationProvider>
        <MessageProvider>
          <ServiceProvider>
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
                <App2 />
              )}
            </ThemeProvider>
          </ServiceProvider>
        </MessageProvider>
      </NotificationProvider>
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
