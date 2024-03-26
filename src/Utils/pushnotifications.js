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

export const NotificationListener = (
  addMessage,
  updateNotificationCounts,
  addService
) => {
  messaging().setBackgroundMessageHandler(async (remoteMessage) => {
    const { title, body } = remoteMessage.notification || {};
    const { data } = remoteMessage;
    // Process the message data and store it in the database
    if (data && data.notification_id == "chat") {
      //await storeMessage(data, body);
      let messageCounts =
        JSON.parse(await AsyncStorage.getItem("messageCounts")) || {};
      const channelId = parseInt(data.channel_id, 10);
      messageCounts[channelId] = (messageCounts[channelId] || 0) + 1;
      await AsyncStorage.setItem(
        "messageCounts",
        JSON.stringify(messageCounts)
      );
      console.log("Message count updated for channel", channelId);
    }
  });

  messaging().onNotificationOpenedApp((remoteMessage) => {
    console.log(
      "Notification caused app to open from background state:",
      remoteMessage.notification
    );
  });

  messaging()
    .getInitialNotification()
    .then(async (remoteMessage) => {
      if (remoteMessage) {
        console.log("Notification caused app to open from quit state:");
      }
    });

  messaging().onMessage(async (remoteMessage) => {
    const { title, body } = remoteMessage.notification || {};
    const notificationData = remoteMessage.data;
    console.log("Remote notifications on foreground state", remoteMessage);
    if (notificationData && notificationData.notification_id === "chat") {
      //storeMessage(notificationData, body);
      const channelId = parseInt(notificationData.channel_id, 10);
      await displayMessage(notificationData);
      updateNotificationCounts("chat", 1, channelId, title, body);
      //showLocalNotification(title, body);
    } else if (notificationData.notification_id == "fahrDienst") {
      const newService = {
        id: parseInt(notificationData.id, 10),
        state: notificationData.state,
        description: notificationData.description,
        notes: notificationData.notes,
        date: notificationData.date,
        purchaser_id: notificationData.purchaser_id
          ? JSON.parse(notificationData.purchaser_id)
          : null, // Fallback to null if undefined
        vehicle_id: notificationData.vehicle_id
          ? JSON.parse(notificationData.vehicle_id)
          : null, // Fallback to null if undefined
      };
      addService(newService);

      console.log("the new service ", newService);
    }
  });

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

  const storeMessage = async (data, message) => {
    const {
      message_id,
      channel_id,
      author_id,
      author_name,
      timestamp,
      attachment_ids,
    } = data;
  
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

  const displayMessage = async (data, messageBody) => {
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
      text: messageBody,
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
