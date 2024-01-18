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

export const NotificationListener = (addMessage) => {
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
    const { title, body } = remoteMessage.notification || {};
    console.log("triggered");
    console.log("Remote notifications on foreground state", remoteMessage);
    if (remoteMessage.data) {
      const notificationData = remoteMessage.data.message_id;
      const parsedData = JSON.parse(notificationData.replace(/'/g, '"'));
      console.log(parsedData);
      storeMessage(parsedData,body);
      await displayMessage(parsedData);
    }

    /*
     await insertMessage(
            msg.id,
            currentChannel.id,
            msg.author_id[0],
            msg.author_id[1],
            body,
            msg.date,
            attachment_ids,
            msg.author_id[0] == partnerId ? "sent" : "received"
          );
    if (remoteMessage.notification) {
      //const { title, body } = remoteMessage.notification || {};
    
      if (remoteMessage.data) {
        //storeMessage(remoteMessage.data, body);
        //console.log(remoteMessage.data.message_id);
        
      }
    
      if (title && body) {
        console.log("Push notification about to be sent");
        
        PushNotification.localNotification({
          channelId: "timer-channel",
          id: 1, // Convert to string
          title: title,
          message: body,
        });
        
      }
    } else {
      console.log("No notification data found in remoteMessage.");
    }*/
  });

  const storeMessage = async (data, message) => {
    const { message_id, channel_id, author_id, author_name,timestamp, attachment_ids } =
      data;
    try {
      await insertMessage(
        parseInt(message_id, 10),
        parseInt(channel_id, 10),
        parseInt(author_id, 10),
        author_name,
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

  const displayMessage = async (data) => {
    console.log("in desplay message with" + data);
    const {
      message_id,
      channel_id,
      author_id,
      message,
      author_name,
      timestamp,
    } = data;
    console.log("message id is " + message_id);
    const time = new Date(timestamp);
    const newMessage = {
      _id: parseInt(message_id, 10), // Assuming you have a unique message ID
      text: message,
      createdAt: time, // Or use timestamp from the notification data
      user: {
        _id: parseInt(author_id, 10), // Unique ID for the author
        name: author_name, // Author's name
      },
    };
    console.log(
      "Message adding to gifteed chat" +
        data.channel_id +
        "on chat" +
        channel_id
    );
    addMessage(parseInt(channel_id, 10), newMessage);
    console.log("finished addind");
  };
};
export default NotificationListener;
