import React, { useState, useEffect, useRef, useContext } from "react";
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
import { getChannels, insertMessage, getMessages } from "../database";
import LottieView from "lottie-react-native";

const { width, height } = Dimensions.get("window");
const ChatScreen = () => {
  const { messages, addMessage } = useMessageContext();
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const theme = useTheme();
  const styles = createStyles(theme);
  const sidebarX = useRef(new Animated.Value(-width * 0.7)).current;
  const { userId, channels, partnerId } = useContext(AuthContext);
  const [currentChannel, setCurrentChannel] = useState(channels[0]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const targetValue = sidebarVisible ? 0 : -width * 0.7;
    Animated.timing(sidebarX, {
      toValue: targetValue,
      duration: 300,
      useNativeDriver: true, // Changed to true as we're animating transform
    }).start();
  }, [sidebarVisible]);

  useEffect(() => {
    const fetchAndStoreMessages = async () => {
      const localMessages = await getMessages(currentChannel.channel_id);
      //console.log(messages[currentChannel.channel_id]);
      if (messages[currentChannel.channel_id] == undefined) {
        setIsLoading(true);
        const serverMessages = await getServerMessages(
          userId,
          currentChannel.channel_id,
          20
        );

        console.log(serverMessages);

        // Store messages in SQLite

        serverMessages.forEach(async (msg) => {
          const body = msg.body.replace(/<\/?[^>]+(>|$)/g, "");
          console.log(body);
          console.log(msg.author_id[1]);
          console.log("author id " + msg.author_id[0]);

          console.log(msg.date);
          // Convert attachment_ids array to JSON string
          const attachment_ids = JSON.stringify(msg.attachment_ids || []);
          await insertMessage(
            msg.id, // Use the correct property for message ID
            currentChannel.channel_id,
            msg.author_id[0],
            msg.author_id[1],
            body,
            new Date(msg.date),
            attachment_ids,
            msg.author_id[0] == partnerId ? "sent" : "received" // or the appropriate status
          );
      
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
          addMessage(currentChannel.channel_id, [newMessage]);
        });
        setIsLoading(false);
      }
    };

    fetchAndStoreMessages().catch(console.error);
  }, [currentChannel]);

  const onSend = async (newMessages = []) => {
    const x = await sendMessage(
      userId,
      currentChannel.channel_id,
      newMessages[0].text,
      []
    );
    console.log(x);
    console.log(newMessages);
    addMessage(currentChannel.channel_id, newMessages);
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
  const handleMenuButtonPressed = () => {
    setSidebarVisible(!sidebarVisible);
  };

  return (
    <SafeAreaView style={styles.container}>
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
        <View style={{flex: 1}}>
          <TouchableOpacity
            style={styles.menu}
            onPress={handleMenuButtonPressed}
          >
            <Ionicons name="menu" size={30} color={theme.secondary} />
            <Text style={styles.currentChannel}>{currentChannel.name}</Text>
          </TouchableOpacity>

          <Animated.View
            style={[
              styles.sidebar,
              {
                transform: [{ translateX: sidebarX }],
              },
            ]}
          >
            <ScrollView>
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
                    {channel.name}
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
            <View style={[styles.chatContainer]}>
              <GiftedChat
                messages={messages[currentChannel.channel_id] || []}
                onSend={(newMessages) => onSend(newMessages)}
                user={{ _id: partnerId }}
                renderSend={renderSend}
                renderInputToolbar={renderInputToolbar}
                renderComposer={renderComposer}
                renderChatFooter={renderChatFooter}
                renderBubble={renderBubble}
              />
            </View>
          </TouchableWithoutFeedback>
        </View>
      )}
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
      backgroundColor:"#F2F2F2",
      paddingVertical:10,
      paddingHorizontal:20
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
      height: "100%",
      width: "70%",
      backgroundColor: theme.primaryText,
      padding: 20,
      borderRightWidth: 1,
      borderRightColor: "#ddd",
      borderTopRightRadius: 20,
      zIndex: 4,
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
