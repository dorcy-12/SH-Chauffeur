import messaging from "@react-native-firebase/messaging";
import AsyncStorage from "@react-native-async-storage/async-storage";
import PushNotification from "react-native-push-notification";

export async function requestUserPermission() {
  const authStatus = await messaging().requestPermission();
  const enabled =
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL;

  if (enabled) {
    console.log("Authorization status:", authStatus);
    GetItemToken();
  }
}

async function GetItemToken() {
  let fcm = await AsyncStorage.getItem("token");
  +console.log(fcm, "oldtoken");
  if (!fcm) {
    try {
      let fcmtoken = await messaging().getToken();
      if (fcmtoken) {
        await AsyncStorage.setItem("token", fcmtoken);
        console.log(fcmtoken, "newtoken");
      }
    } catch (error) {
      console.log("error in token retrieval", error);
    }
  }
}

export const NotificationListener = () => {
  // Assume a message-notification contains a "type" property in the data payload of the screen to open

  messaging().onNotificationOpenedApp((remoteMessage) => {
    console.log(
      "Notification caused app to open from background state:",
      remoteMessage.notification
    );
  });
  messaging()
    .getInitialNotification()
    .then((remoteMessage) => {
      if (remoteMessage) {
        console.log(
          "Notification caused app to open from quit state:",
          remoteMessage.notification
        );
      }
    });

  messaging().onMessage(async (remoteMessage) => {
    console.log("Remote notifications on foreground state", remoteMessage);

    if (remoteMessage.notification) {
      // Assuming the message has title, body, and messageId
      const { title, body } = remoteMessage.notification || {};
      if (title && body) {
        console.log("Push notification about to be sent");

        PushNotification.localNotification({
          channelId: "timer-channel",
          id: 17, // Convert to string 
          title: title,
          message: body,
        });
      }
    } else {
      console.log("No notification data found in remoteMessage.");
    }
  });
};
