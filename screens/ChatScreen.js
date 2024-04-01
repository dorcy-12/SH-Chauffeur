import React, { useState, useEffect, useRef, useContext } from "react";
import { AppState } from "react-native";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Platform,
  StatusBar,
  Dimensions,
  ScrollView,
  TouchableWithoutFeedback,
  Animated,
  Image,
  Modal,
  TextInput,
  Button,
} from "react-native";
import {
  GiftedChat,
  InputToolbar,
  Composer,
  Send,
  Bubble,
} from "react-native-gifted-chat";
import {
  Ionicons,
  Feather,
  MaterialIcons,
  FontAwesome5,
  Octicons,
} from "@expo/vector-icons";
import { useTheme } from "../context/ThemeContext";
import { AuthContext } from "../context/UserAuth";
import {
  getDiscussChannels,
  sendMessage,
  getServerMessages,
  countNewMessages,
} from "../service/authservice";
import { useMessageContext } from "../context/MessageContext";
import {
  getChannels,
  insertMessage,
  getLocalMessages,
  wipeMessagesTable,
  getAllMessages,
  getUsers,
  getLatestLocalMessageId,
  getEarlierMessages,
} from "../database";
import LottieView from "lottie-react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useIsFocused } from "@react-navigation/native";
import { NotificationContext } from "../context/NotificationContext";
import { channel } from "expo-updates";

const { width, height } = Dimensions.get("window");
const ChatScreen = () => {
  const {
    notificationCounts,
    updateNotificationCounts,
    setCurrentScreen,
    setCurrentChannelId,
    resetNotificationCounts,
  } = useContext(NotificationContext);
  const isFocused = useIsFocused();
  const [employees, setEmployees] = useState([]);
  const { messages, addMessage, prependMessages } = useMessageContext();
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const theme = useTheme();
  const styles = createStyles(theme);
  const sidebarX = useRef(new Animated.Value(-width * 0.7)).current;
  const { userId, channels, setChannels, partnerId, employeeId } =
    useContext(AuthContext);
  const [currentChannel, setCurrentChannel] = useState(channels[0]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFirstRender, setIsFirstRender] = useState({});
  const [isForeground, setIsForeground] = useState(false);
  const categorizedChannels = {
    channels: channels.filter((channel) => channel.channel_type === "channel"),
    directMessages: channels.filter(
      (channel) => channel.channel_type === "chat"
    ),
  };
  const [currentUser, setCurrentUser] = useState("");
  const [newChannelModalVisible, setNewChannelModalVisible] = useState(false);
  const [newChannelName, setNewChannelName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionSuccess, setSubmissionSuccess] = useState(null);
  const [isLoadingEarlier, setIsLoadingEarlier] = useState(false);
  const [hasMoreToLoad, setHasMoreToLoad] = useState({});
  const [offset, setOffset] = useState(20);
  useEffect(() => {
    const targetValue = sidebarVisible ? 0 : -width * 0.7;
    Animated.timing(sidebarX, {
      toValue: targetValue,
      duration: 300,
      useNativeDriver: true, // Changed to true as we're animating transform
    }).start();
  }, [sidebarVisible]);
  useEffect(() => {
    if (isFocused) {
      setCurrentScreen("chat");
      setCurrentChannelId(currentChannel.id);
      setIsForeground(true);
      updateNotificationCounts(
        "chat",
        -(notificationCounts.chat.channels[currentChannel.id] || 0),
        currentChannel.id
      );
      console.log("current channel is ", currentChannel);
      console.log("useeffect called with isFocused in chat ", isFocused);
    } else {
      setCurrentChannelId(null);
      console.log("the channel set in the useffect is receded ");
    }

    console.log("is focused iin chat is ", isFocused);
  }, [isFocused]);
  useEffect(() => {
    const reloadChannels = async () => {
      const messageCounts =
        JSON.parse(await AsyncStorage.getItem("messageCounts")) || {};
      const channelId = currentChannel.id;
      const newMessageCount = messageCounts[channelId];
      setCurrentChannelId(currentChannel.id);

      if (
        messages[currentChannel.id] === undefined ||
        isFirstRender[currentChannel.id] === undefined
      ) {
        console.log("channel has no messages  ", currentChannel.id);
        console.log("messages in current channel", messages[currentChannel.id]);
        console.log("is first render", isFirstRender[currentChannel.id]);
        await fetchAndStoreMessages(currentChannel.id, 20, true);
        setIsFirstRender((prev) => ({
          ...prev,
          [currentChannel.id]: false,
        }));
        setHasMoreToLoad((prev) => ({
          ...prev,
          [currentChannel.id]: true,
        }));
      } else if (newMessageCount > 0) {
        console.log("fetching only new ");
        await fetchAndStoreMessages(currentChannel.id, newMessageCount); // not sure if this is needed since background
        // Remove the current channel ID from the reload list
        messageCounts[channelId] = 0;
        await AsyncStorage.setItem(
          "messageCounts",
          JSON.stringify(messageCounts)
        );
      }
      console.log("We are about to change the counts");
      resetNotificationCounts("chat", currentChannel.id);
    };

    const subscription = AppState.addEventListener("change", (nextAppState) => {
      if (nextAppState === "active") {
        //console.log("we are in event listener");
        reloadChannels();
      }
    });
    // Call reloadChannels on initial render and when currentChannel changes
    reloadChannels();

    return () => {
      subscription.remove();
    };
  }, [currentChannel]);

  useEffect(() => {
    const fetchEmployees = () => {
      getUsers()
        .then((employees) => {
          if (employees) {
            console.log("fetchEmployess was called");
            setEmployees(employees);
            setCurrentUser(employees.find((e) => e.employee_id == employeeId));
          }
        })
        .catch((error) => {
          console.error("Error fetching employees:", error);
        });
    };
    fetchEmployees();
  }, []);

  const fetchAndStoreMessages = async (channel_id, limit, replace = false) => {
    try {
      setIsLoading(true);
      console.log("fetching from server");

      const serverMessages = await getServerMessages(userId, channel_id, limit);

      if (!replace) {
        const reversedServerMessages = serverMessages.reverse();
        const newMessages = reversedServerMessages.map((msg) => {
          const body = msg.body.replace(/<\/?[^>]+(>|$)/g, "");
          return {
            _id: msg.id,
            text: body,
            createdAt: new Date(msg.date),
            user: {
              _id: msg.author_id[0],
              name: msg.author_id[1], // Assuming this is the author's name
            },
            // Include other properties if needed
          };
        });
        addMessage(channel_id, [newMessages]);
      } else {
        const newMessages = serverMessages.map((msg) => {
          const body = msg.body.replace(/<\/?[^>]+(>|$)/g, "");
          //const attachment_ids = JSON.stringify(msg.attachment_ids || []);

          return {
            _id: msg.id,
            text: body,
            createdAt: new Date(msg.date),
            user: {
              _id: msg.author_id[0],
              name: msg.author_id[1], // Assuming this is the author's name
            },
          };
        });

        addMessage(channel_id, newMessages, true);
      }
    } catch (error) {
      console.log("error in retrieving messages ", error);
    } finally {
      setSidebarVisible(false);
      setIsLoading(false);
    }
  };

  const renderChannelName = (channel) => {
    if (channel.channel_type === "chat") {
      return getOtherPersonName(channel.name, currentUser.name);
    }
    return channel.name;
  };

  const getOtherPersonName = (chatTitle, myName) => {
    const names = chatTitle.split(",").map((name) => name.trim());
    return names.find((name) => name !== myName) || chatTitle;
  };

  const onSend = async (newMessages = []) => {
    addMessage(currentChannel.id, newMessages);
    const x = await sendMessage(
      userId,
      currentChannel.id,
      newMessages[0].text,
      []
    );
    console.log(x);
    console.log(newMessages);
  };

  const selectChannel = (channel) => {
    setCurrentChannel(channel);
    setSidebarVisible(false);
    console.log(channel);
  };

  const renderSend = (props) => {
    return (
      <Send
        {...props}
        containerStyle={{
          paddingVertical: 0, // Adjust vertical padding here
          paddingHorizontal: 0, // Adjust horizontal padding here
          marginBottom: 0,
          marginHorizontal: 0,
          justifyContent: "center",
        }}
      >
        <View style={{}}>
          <Ionicons name="send" size={24} color={theme.secondary} />
        </View>
      </Send>
    );
  };

  const renderInputToolbar = (props) => {
    return (
      <InputToolbar
        {...props}
        containerStyle={{
          borderTopColor: "#E8E8E8",
          borderRadius: 20,
          backgroundColor: "white",
          paddingVertical: 10, // Adjust vertical padding here
          paddingHorizontal: 10, // Adjust horizontal padding here
          marginBottom: 20,
          marginTop: 18,
          marginHorizontal: 30,
        }}
        primaryStyle={{ alignItems: "center", justifyContent: "center" }}
      />
    );
  };

  const renderComposer = (props) => {
    return (
      <Composer
        {...props}
        textInputStyle={{
          borderColor: "#E8E8E8",
          borderRadius: 20,
          paddingTop: 0,
          paddingHorizontal: 12,
          marginLeft: 0,
          paddingBottom: 0, // Adjust bottom padding here
          alignContent: "center",
          marginBottom: 0,
          maxHeight: 200,
        }}
        textInputProps={{
          maxLength: 200, // Set your desired character limit here
        }}
      />
    );
  };

  const renderChatFooter = () => {
    // Render a custom footer to create space, if needed
    return <View style={{ height: height * 0.07 }} />;
  };

  const renderBubble = (props) => {
    return (
      <Bubble
        {...props}
        wrapperStyle={{
          left: {
            backgroundColor: "#fff",
          },
          right: {
            backgroundColor: theme.secondary, // Background color for your messages
          },
        }}
        textStyle={{
          left: {
            color: "#000", // Text color for messages from other users
          },
          right: {
            color: "#fff", // Text color for your messages
          },
        }}
      />
    );
  };
  const renderTicks = (message) => {
    // Replace with your logic to determine the message status
    const { status } = message;
    if (status === "read") {
      return "✓✓"; // or your custom read icon
    } else if (status === "delivered") {
      return "✓✓"; // or your custom delivered icon
    } else if (status === "sent") {
      return "✓"; // or your custom sent icon
    }
    return null;
  };

  const handleMenuButtonPressed = async () => {
    setSidebarVisible(!sidebarVisible);
    console.log(channels);
  };
  const handleAddChannel = async () => {
    if (!newChannelName.trim()) {
      alert("Please enter a channel name.");
      return;
    }

    // Prepare the channel data for the API call
    const channelData = {
      name: newChannelName,
    };

    try {
      setIsSubmitting(true);
      const channelId = await createChannel(userId, channelData);

      // Now, insert the new channel into the SQLite database with the returned ID

      const insertedChannel = await insertChannel(
        channelId, // Use the ID returned from the server
        newChannelName,
        "",
        "channel", // Assuming this is a group channel type
        [] // Initially, no partner IDs
      );

      // Update the UI and state as necessary
      setChannels((prevChannels) => [
        ...prevChannels,
        {
          name: newChannelName,
          id: channelId, // Include the server-generated ID
          description: "0",
          channel_type: "channel",
          channel_partner_ids: [],
        },
      ]);
      setSubmissionSuccess(true);
    } catch (error) {
      console.error("Failed to add new channel: ", error);
      setSubmissionSuccess(false);
    } finally {
      setIsSubmitting(false);
      setNewChannelName(""); // Reset the form fields
      setTimeout(() => {
        setSubmissionSuccess(null); // Reset submission status
        setNewChannelModalVisible(false); // Close the modal
      }, 1000);
    }
  };

  const fetchEarlierMessages = async () => {
    if (!hasMoreToLoad[currentChannel.id]) return;

    setIsLoadingEarlier(true);

    const msgLength = messages[currentChannel.id].length;

    const earlierMessages = await getServerMessages(
      userId,
      currentChannel.id,
      20,
      msgLength
    );

    if (earlierMessages.length > 0) {
      //format the messages first in gifted chat syntax
      const newMessages = earlierMessages.map((msg) => {
        const body = msg.body.replace(/<\/?[^>]+(>|$)/g, "");
        return {
          _id: msg.id,
          text: body,
          createdAt: new Date(msg.date),
          user: {
            _id: msg.author_id[0],
            name: msg.author_id[1], // Assuming this is the author's name
          },
        };
      });

      //prepend the messages
      await prependMessages(currentChannel.id, newMessages);

      if (earlierMessages.length < 20) {
        // Assuming 20 is your standard fetch size
        setHasMoreToLoad((prev) => ({ ...prev, [currentChannel.id]: false }));
      }
    } else {
      setHasMoreToLoad(prevState => ({
        ...prevState,
        [currentChannel.idh]: false
      }));// No more messages to load
    }

    setIsLoadingEarlier(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Modal
        animationType="slide"
        transparent={true}
        visible={newChannelModalVisible}
        onRequestClose={() => {
          setNewChannelModalVisible(!newChannelModalVisible);
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.label}>Neue Kanal Hinzufügen</Text>
            <TextInput
              placeholder="Name"
              value={newChannelName}
              onChangeText={setNewChannelName}
              style={styles.modalText}
            />
            {isSubmitting ? (
              <View style={styles.submitAnimContainer}>
                <LottieView
                  source={require("../assets/loading.json")}
                  autoPlay
                  loop
                  style={{ width: 70, height: 70 }}
                />
              </View>
            ) : submissionSuccess === false ? (
              <View style={styles.submitAnimContainer}>
                <Ionicons name="close-circle" size={40} color="red" />
              </View>
            ) : submissionSuccess === true ? (
              <View style={styles.submitAnimContainer}>
                <Ionicons name="checkmark-circle" size={40} color="green" />
              </View>
            ) : (
              <TouchableOpacity
                style={styles.submit}
                onPress={handleAddChannel}
              >
                <Text style={styles.submitText}>Erstellen</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </Modal>

      <View
        style={{
          flex: 1,
        }}
      >
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.menu}
            onPress={handleMenuButtonPressed}
          >
            <Ionicons name="menu" size={30} color={theme.secondary} />
            <Text style={styles.currentChannel}>
              {renderChannelName(currentChannel)}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() =>
              navigation.navigate("group-info", { current: currentChannel })
            }
          >
            <Octicons name="gear" size={24} color="black" />
          </TouchableOpacity>
        </View>

        <Animated.View
          style={[
            {
              position: "absolute",
              transform: [{ translateX: sidebarX }],
              zIndex: 10,
              height: "100%",
              width: "70%",
            },
          ]}
        >
          <ScrollView style={styles.sidebar}>
            <View style={styles.profileContainer}>
              <Image
                source={{
                  uri: `data:image/png;base64,${
                    currentUser ? currentUser.profile_picture : ""
                  }`,
                }}
                style={styles.profilePicture}
              />
              <Text style={styles.userName}>{currentUser.name}</Text>
            </View>

            <View style={styles.channelHeader}>
              <Text style={styles.channelHeaderText}>Kanälen</Text>
            </View>
            {categorizedChannels.channels.map((channel, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => selectChannel(channel)}
                style={
                  channel.name === currentChannel.name
                    ? styles.highlightedChannel
                    : styles.channel
                }
              >
                <Text
                  style={
                    channel.name === currentChannel.name
                      ? { color: "white" }
                      : { color: "black" }
                  }
                >
                  {renderChannelName(channel)}
                </Text>
                {(notificationCounts.chat.channels[channel.id] || 0) > 0 && (
                  <View style={styles.badgeContainer}>
                    <Text style={styles.badgeText}>
                      {notificationCounts.chat.channels[channel.id] || null}
                    </Text>
                  </View>
                )}
              </TouchableOpacity>
            ))}
            <View style={styles.channelHeader}>
              <Text style={styles.channelHeaderText}>Direkt Nachrichten</Text>
            </View>

            {categorizedChannels.directMessages.map((channel, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => selectChannel(channel)}
                style={
                  channel.name === currentChannel.name
                    ? styles.highlightedChannel
                    : styles.channel
                }
              >
                <Text
                  style={
                    channel.name === currentChannel.name
                      ? { color: "white" }
                      : { color: "black" }
                  }
                >
                  {renderChannelName(channel)}
                </Text>
                {(notificationCounts.chat.channels[channel.id] || 0) > 0 && (
                  <View style={styles.badgeContainer}>
                    <Text style={styles.badgeText}>
                      {notificationCounts.chat.channels[channel.id] || null}
                    </Text>
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </ScrollView>
        </Animated.View>
        <TouchableWithoutFeedback
          style={{ flex: 1 }}
          onPress={() => {
            setSidebarVisible(false);
          }}
        >
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
            <View style={[styles.chatContainer]}>
              <GiftedChat
                messages={messages[currentChannel.id] || []}
                onSend={(newMessages) => onSend(newMessages)}
                user={{ _id: partnerId }}
                renderSend={renderSend}
                renderInputToolbar={renderInputToolbar}
                renderComposer={renderComposer}
                renderChatFooter={renderChatFooter}
                renderBubble={renderBubble}
                loadEarlier={hasMoreToLoad[currentChannel.id]} // Show load earlier button
                isLoadingEarlier={isLoadingEarlier} // Show loading indicator when fetching earlier messages
                onLoadEarlier={fetchEarlierMessages}
              />
            </View>
          )}
        </TouchableWithoutFeedback>
      </View>
    </SafeAreaView>
  );
};

const createStyles = (theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
    },
    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingRight: 30,
    },

    menu: {
      flexDirection: "row",
      alignItems: "center",
      zIndex: 2,
      backgroundColor: "#F2F2F2",
      paddingVertical: 10,
      paddingHorizontal: 20,
    },
    currentChannel: {
      marginLeft: 20,
      fontSize: 18,
      fontWeight: "600",
      color: theme.text,
    },
    sidebar: {
      backgroundColor: theme.primaryText,
      padding: 20,
      borderRightWidth: 1,
      borderRightColor: "#ddd",
      borderTopRightRadius: 20,
      borderBottomRightRadius: 20,
      //zIndex: 100,
    },
    channelHeader: {
      marginTop: 20,
      marginBottom: 10,
      flexDirection: "row",
      justifyContent: "space-between",
    },
    channelHeaderText: {
      fontSize: 25,
      fontWeight: "600",
      color: "#a1a1a1",
    },
    chatContainer: {
      flex: 1,
    },
    channel: {
      fontSize: 16,
      flex: 1,
      padding: 15,
      borderBottomWidth: 1,
      borderBottomColor: "#eee",
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },
    highlightedChannel: {
      fontSize: 16,
      backgroundColor: theme.secondary,
      color: theme.primaryText,
      borderBottomRightRadius: 20,
      flex: 1,
      padding: 15,
      borderBottomWidth: 1,
      borderBottomColor: "#eee",
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
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

    badgeContainer: {
      borderRadius: 15,
      paddingVertical: 2,
      paddingHorizontal: 6,
      justifyContent: "center",
      alignItems: "center",
    },
    badgeText: {
      color: "#fff",
      fontSize: 12,
    },
    profileContainer: {
      alignItems: "center",
      padding: 10,
    },
    profilePicture: {
      width: 100,
      height: 100,
      borderRadius: 50,
      marginBottom: 20,
    },
    userName: {
      marginTop: 8,
      fontWeight: "bold",
    },
    centeredView: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: `rgba(0,0,0,0.85)`,
    },
    modalView: {
      backgroundColor: "white",
      borderRadius: 10,
      paddingHorizontal: 35,
      paddingVertical: 20,
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 5,
      width: "80%",
    },
    modalText: {
      marginTop: 15,
      //textAlign: "center",
      borderWidth: 1,
      paddingVertical: 8,
      paddingHorizontal: 8,
      borderRadius: 10,
      borderColor: "grey",
    },
    label: {
      fontWeight: "500",
      fontSize: 18,
    },
    submit: {
      padding: 10,
      backgroundColor: theme.primary,
      borderRadius: 10,
      width: "50%",
      alignItems: "center",
      marginTop: 20,
      alignSelf: "flex-end",
    },
    submitText: {
      fontSize: 14,
      fontWeight: "600",
      color: "white",
    },
    submitAnimContainer: {
      marginTop: 20,
      alignItems: "flex-end",
    },
  });

export default ChatScreen;
