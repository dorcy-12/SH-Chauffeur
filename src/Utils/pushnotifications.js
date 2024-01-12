import messaging from "@react-native-firebase/messaging";
import AsyncStorage from "@react-native-async-storage/async-storage";
import PushNotification from "react-native-push-notification";
import { insertMessage } from "../../database";
import { useMessageContext } from "../../context/MessageContext";

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
  console.log(fcm, "oldtoken");
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
  const { addMessage } = useMessageContext();
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
      const { title, body } = remoteMessage.notification || {};
      if (remoteMessage.data) {
        storeMessage(remoteMessage.data, body);
        //displayMessage(remoteMessage.data, body);
      }
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

  const storeMessage = async (data, message) => {
    const { message_id, channel_id, author_id, timestamp, attachment_ids } =
      data;
    try {
      await insertMessage(
        message_id,
        channel_id,
        author_id,
        message,
        timestamp,
        attachment_ids,
        "received"
      );
      console.log("Message stored in SQLite database");
    } catch (error) {
      console.error("Error storing message in SQLite database:", error);
    }
  };

  const displayMessage = (data, message) => {
    const {
      channel_id,
      message_id,
      author_name,
      author_id,
      date: timestamp,
    } = data;
    const time = new Date(timestamp);
    const newMessage = {
      _id: message_id, // Assuming you have a unique message ID
      text: message,
      createdAt: time, // Or use timestamp from the notification data
      user: {
        _id: author_id, // Unique ID for the author
        name: author_name, // Author's name
      },
    };
    addMessage(channel_id, newMessage);
  };
};
export default NotificationListener;