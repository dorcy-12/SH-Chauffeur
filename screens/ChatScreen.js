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
} from "react-native";
import {
  GiftedChat,
  InputToolbar,
  Composer,
  Send,
  Bubble,
} from "react-native-gifted-chat";
import { Ionicons, Feather } from "@expo/vector-icons";
import { useTheme } from "../context/ThemeContext";
import { AuthContext } from "../context/UserAuth";
import {
  getDiscussChannels,
  sendMessage,
  getServerMessages,
} from "../service/authservice";
import { useMessageContext } from "../context/MessageContext";
import {
  getChannels,
  insertMessage,
  getLocalMessages,
  wipeMessagesTable,
  getAllMessages,
} from "../database";
import LottieView from "lottie-react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const { width, height } = Dimensions.get("window");
const ChatScreen = () => {
  const { messages, addMessage } = useMessageContext();
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const theme = useTheme();
  const styles = createStyles(theme);
  const sidebarX = useRef(new Animated.Value(-width * 0.7)).current;
  const { userId, channels, partnerId, employeeName } = useContext(AuthContext);
  const [currentChannel, setCurrentChannel] = useState(channels[0]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFirstRender, setIsFirstRender] = useState({});

  useEffect(() => {
    const targetValue = sidebarVisible ? 0 : -width * 0.7;
    Animated.timing(sidebarX, {
      toValue: targetValue,
      duration: 300,
      useNativeDriver: true, // Changed to true as we're animating transform
    }).start();
  }, [sidebarVisible]);

  useEffect(() => {
    const reloadChannels = async () => {
      const messageCounts =
        JSON.parse(await AsyncStorage.getItem("messageCounts")) || {};
      const channelId = currentChannel.id;
      const newMessageCount = messageCounts[channelId];
      console.log(newMessageCount);
      console.log("is first rendered", isFirstRender[currentChannel.id]);
      if (newMessageCount > 0) {
        await fetchAndStoreMessages(currentChannel.id, newMessageCount);
        // Remove the current channel ID from the reload list
        messageCounts[channelId] = 0;
        await AsyncStorage.setItem(
          "messageCounts",
          JSON.stringify(messageCounts)
        );
      } else if (
        messages[currentChannel.id] === undefined ||
        isFirstRender[currentChannel.id] === undefined
      ) {
        console.log("channel has no messages  ", currentChannel.id);
        await fetchAndStoreMessages(currentChannel.id, 20, true);
        setIsFirstRender((prev) => ({
          ...prev,
          [currentChannel.id]: false,
        }));
      }
    };

    const subscription = AppState.addEventListener("change", (nextAppState) => {
      if (nextAppState === "active") {
        reloadChannels();
      }
    });
    // Call reloadChannels on initial render and when currentChannel changes
    reloadChannels();

    return () => {
      subscription.remove();
    };
  }, [currentChannel]);

  const fetchAndStoreMessages = async (channel_id, limit, replace = false) => {
    try {
      setIsLoading(true);
      console.log("fetching from server");

      const serverMessages = await getServerMessages(userId, channel_id, limit);

      if (!replace) {
        const reversedServerMessages = serverMessages.reverse();
        reversedServerMessages.map((msg) => {
          const body = msg.body.replace(/<\/?[^>]+(>|$)/g, "");
          //const attachment_ids = JSON.stringify(msg.attachment_ids || []);

          const newMessage = {
            _id: msg.id,
            text: body,
            createdAt: new Date(msg.date),
            user: {
              _id: msg.author_id[0],
              name: msg.author_id[1], // Assuming this is the author's name
            },
            // Include other properties if needed
          };
          // Update the UI
          addMessage(channel_id, [newMessage]);
        });
      } else {
        console.log("serverMessages came so ", serverMessages);
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
        console.log("the new Messages are ", newMessages);

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
      return getOtherPersonName(channel.name, employeeName);
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
    //console.log(messages[currentChannel.id]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={{ flex: 1 }}>
        <TouchableOpacity style={styles.menu} onPress={handleMenuButtonPressed}>
          <Ionicons name="menu" size={30} color={theme.secondary} />
          <Text style={styles.currentChannel}>
            {renderChannelName(currentChannel)}
          </Text>
        </TouchableOpacity>

        <Animated.View
          style={[
            {
              transform: [{ translateX: sidebarX }],
              zIndex: 10,
            },
          ]}
        >
          <ScrollView style={styles.sidebar}>
            <Text style={styles.channelHeader}>Kanälen</Text>
            {channels.map((channel, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => selectChannel(channel)}
              >
                <Text
                  style={
                    channel.name === currentChannel.name
                      ? styles.highlightedChannel
                      : styles.channel
                  }
                >
                  {renderChannelName(channel)}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </Animated.View>

        <TouchableWithoutFeedback
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
      position: "absolute",
      left: 0,
      top: 0,
      //height: "100%",
      width: "70%",
      backgroundColor: theme.primaryText,
      padding: 20,
      borderRightWidth: 1,
      borderRightColor: "#ddd",
      borderTopRightRadius: 20,
      borderBottomRightRadius: 20,
      //zIndex: 100,
    },
    channelHeader: {
      fontSize: 25,
      fontWeight: "600",
      marginTop: 20,
    },
    chatContainer: {
      flex: 1,
    },
    channel: {
      padding: 15,
      borderBottomWidth: 1,
      borderBottomColor: "#eee",
      fontSize: 16,
    },
    highlightedChannel: {
      padding: 15,
      borderBottomWidth: 1,
      borderBottomColor: "#eee",
      fontSize: 16,
      backgroundColor: theme.primary,
      color: theme.primaryText,
      borderBottomRightRadius: 20,
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

    // Additional styles...
  });

export default ChatScreen;
