import React, { createContext, useState, useEffect, useRef } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import PushNotification from "react-native-push-notification";
import { AppState } from "react-native";

export const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [notificationCounts, setNotificationCounts] = useState({
    chat: {
      total: 0,
      channels: {},
    },
    home: 0,
    planner: 0,
  });
  const notificationCountsRef = useRef(notificationCounts);
  const [currentScreen, setCurrentScreen] = useState("");
  const currentScreenRef = useRef(currentScreen);
  const [currentChannelId, setCurrentChannelId] = useState(null);
  const currentChannelIdRef = useRef(currentChannelId);

  useEffect(() => {
    notificationCountsRef.current = notificationCounts;
  }, [notificationCounts]);

  useEffect(() => {
    currentScreenRef.current = currentScreen;
  }, [currentScreen]);
  useEffect(() => {
    currentChannelIdRef.current = currentChannelId;
  }, [currentChannelId]);

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
  useEffect(() => {
    const reloadChannels = async () => {
      const checksCount = JSON.parse(await AsyncStorage.getItem("checks")) || 0;
      const messagesCount =
        JSON.parse(await AsyncStorage.getItem("messageCounts")) || {};
      if (checksCount > 0) {
        updateNotificationCounts("home", checksCount);
        console.log(
          "background cuonts was called here with check count ",
          checksCount
        );
        await AsyncStorage.setItem("checks", JSON.stringify(0));
      }
      Object.entries(messagesCount).forEach(async ([channelId, count]) => {
        if (count > 0) {
          // Assuming updateNotificationCounts can handle channelId specific updates
          await renewNotificationCounts("chat", count, channelId);
          console.log("called with coount" + count + "in channel ", channelId);
          messagesCount[channelId] = 0;
        }
      });

      //await AsyncStorage.setItem("messageCounts", JSON.stringify({}));
      console.log("at the end", messagesCount);
    };

    const subscription = AppState.addEventListener("change", (nextAppState) => {
      if (nextAppState === "active") {
        reloadChannels();
      }
    });
    return () => {
      subscription.remove();
    };
  }, []);

  const updateNotificationCounts = async (
    screen,
    num,
    channelId = null,
    title = null,
    body = null
  ) => {
    console.log("Channel id brought in is ", channelId);
    console.log("active channel is ", currentChannelIdRef.current);
    if (
      currentScreenRef.current !== screen ||
      (channelId !== currentChannelIdRef.current && currentChannelIdRef.current)
    ) {
      const updatedCounts = { ...notificationCountsRef.current };
      if (screen === "chat") {
        updatedCounts.chat.total += num;
        if (channelId !== null) {
          updatedCounts.chat.channels[channelId] =
            (updatedCounts.chat.channels[channelId] || 0) + num;
        }
      } else if (screen === "home") {
        updatedCounts.home += num;
      } else if (screen === "planner") {
        updatedCounts.planner += num;
      }
      setNotificationCounts(updatedCounts);
      if (title && body) {
        showLocalNotification(title, body);
      }
    }
  };
  const renewNotificationCounts = async (
    screen,
    num,
    channelId = null,
    title = null,
    body = null
  ) => {
    console.log("Channel id brought in is ", channelId);
    console.log("active channel is ", currentChannelIdRef.current);
    if (
      currentScreenRef.current !== screen ||
      (channelId !== currentChannelIdRef.current && currentChannelIdRef.current)
    ) {
      const updatedCounts = { ...notificationCountsRef.current };
      updatedCounts.chat.total = 0;
      if (screen === "chat") {
        updatedCounts.chat.total += num;
        if (channelId !== null) {
          updatedCounts.chat.channels[channelId] = num;
        }
      } else if (screen === "home") {
        updatedCounts.home = num;
      } else if (screen === "planner") {
        updatedCounts.planner = num;
      }
      setNotificationCounts(updatedCounts);
    }
  };
  const resetNotificationCounts = async (screen, channelId = null) => {
    const updatedCounts = { ...notificationCountsRef.current };
    if (screen === "chat") {
      updatedCounts.chat.total -= updatedCounts.chat.channels[channelId] || 0;
      if (channelId !== null) {
        updatedCounts.chat.channels[channelId] = 0;
      }
    } else if (screen === "home") {
      updatedCounts.home = 0;
    } else if (screen === "planner") {
      updatedCounts.planner = 0;
    }
    setNotificationCounts(updatedCounts);
  };
  const showLocalNotification = (title, message) => {
    if (title && message) {
      PushNotification.localNotification({
        channelId: "timer-channel",
        title: title,
        message: message,
        id: 1,
      });
    }
  };

  return (
    <NotificationContext.Provider
      value={{
        notificationCounts,
        updateNotificationCounts,
        setCurrentScreen,
        setCurrentChannelId,
        resetNotificationCounts,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};
