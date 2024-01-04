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
} from "react-native-gifted-chat";
import { Ionicons, Feather } from "@expo/vector-icons";
import { useTheme } from "../context/ThemeContext";
import { AuthContext } from "../context/UserAuth";
import { getDiscussChannels } from "../service/authservice";

const { width, height } = Dimensions.get("window");
const ChatScreen = () => {
  const [currentChannel, setCurrentChannel] = useState("general");
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [messages, setMessages] = useState({}); // Store messages per channel
  const theme = useTheme();
  const styles = createStyles(theme);
  const sidebarX = useRef(new Animated.Value(-width * 0.7)).current;
  const { channels } = useContext(AuthContext);

  useEffect(() => {
    const targetValue = sidebarVisible ? 0 : -width * 0.7;
    Animated.timing(sidebarX, {
      toValue: targetValue,
      duration: 300,
      useNativeDriver: true, // Changed to true as we're animating transform
    }).start();
  }, [sidebarVisible]);

  

  const onSend = (newMessages = []) => {
    setMessages((previousMessages) => ({
      ...previousMessages,
      [currentChannel]: GiftedChat.append(
        previousMessages[currentChannel] || [],
        newMessages
      ),
    }));
  };

  const selectChannel = (channel) => {
    setCurrentChannel(channel.name);
    setSidebarVisible(false);
    console.log(channels);
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

  const handleMenuButtonPressed = () => {
    console.log("pressed");
    setSidebarVisible(!sidebarVisible);
  };

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity
        style={styles.menuButton}
        onPress={handleMenuButtonPressed}
      >
        <Ionicons name="menu" size={30} color={theme.secondary} />
        <Text style={styles.currentChannel}>{currentChannel}</Text>
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
                  channel.name === currentChannel
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
            messages={messages[currentChannel] || []}
            onSend={(newMessages) => onSend(newMessages)}
            user={{ _id: 2 }}
            renderSend={renderSend}
            renderInputToolbar={renderInputToolbar}
            renderComposer={renderComposer}
            renderChatFooter={renderChatFooter}
          />
        </View>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
};

const createStyles = (theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
    },

    menuButton: {
      position: "absolute",
      top: height * 0.06,
      left: width * 0.05,
      flexDirection: "row",
      alignItems: "center",
      zIndex: 2,
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
      top: height * 0.05,
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

    // Additional styles...
  });

export default ChatScreen;
