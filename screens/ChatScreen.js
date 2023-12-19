import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Platform,
  StatusBar,
  Dimensions,
} from "react-native";
import {
  GiftedChat,
  InputToolbar,
  Composer,
  Send,
} from "react-native-gifted-chat";
import { Ionicons, Feather } from "@expo/vector-icons";
import { useTheme } from "../context/ThemeContext";

const { width, height } = Dimensions.get("window");
const ChatScreen = () => {
  const [currentChannel, setCurrentChannel] = useState("Channel1");
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [messages, setMessages] = useState({}); // Store messages per channel
  const channels = ["Channel1", "Channel2", "Channel3"]; // Your channels
  const theme = useTheme();
  const styles = createStyles(theme);
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
    setCurrentChannel(channel);
    setSidebarVisible(false);
  };

  const renderSend = (props) => {
    return (
      <Send {...props}
      containerStyle={{
        paddingVertical: 0, // Adjust vertical padding here
        paddingHorizontal: 0, // Adjust horizontal padding here
        marginBottom: 0,
        marginHorizontal:0,
        justifyContent:'center'
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
         
          borderTopColor: '#E8E8E8',
          borderRadius:20,
          backgroundColor: 'white',
          paddingVertical: 10, // Adjust vertical padding here
          paddingHorizontal: 10, // Adjust horizontal padding here
          marginBottom: 20,
          marginTop:18,
          marginHorizontal:30,
        
        }}
        primaryStyle={{ alignItems: 'center', justifyContent: 'center' }}
      />
    );
  };
  
  const renderComposer = (props) => {
    return (
      <Composer
        {...props}
        textInputStyle={{

          borderColor: '#E8E8E8',
          borderRadius: 20,
          paddingTop: 0,
          paddingHorizontal: 12,
          marginLeft: 0,
          paddingBottom: 0, // Adjust bottom padding here
          alignContent:'center',
          marginBottom:0,
          maxHeight:80
        }}
      />
    );
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
        {!sidebarVisible ? (
          <Ionicons name="menu" size={30} color={theme.secondary} />
        ) : (
          <Feather name="x" size={30} color={theme.secondary} />
        )}
      </TouchableOpacity>

      {sidebarVisible && (
        <View style={styles.sidebar}>
          <Text>Kanälen</Text>
          {channels.map((channel, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => selectChannel(channel)}
            >
              <Text style={styles.channel}>{channel}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      <View style={[styles.chatContainer]}>
        <GiftedChat
          messages={messages[currentChannel] || []}
          onSend={(newMessages) => onSend(newMessages)}
          user={{ _id: 2 }}
          renderSend={renderSend}
          renderInputToolbar={renderInputToolbar}
          renderComposer={renderComposer}
          bottomOffset={0}
        />
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
    menuButton: {
      position: "absolute",
      top: height * 0.05,
      left: width * 0.05,
      zIndex: 1000,
    },
    sidebar: {
      position: "absolute", // Use absolute positioning
      left: 0,
      top: height * 0.05,
      height: "100%", // Set height to cover the screen
      width: "70%", // Adjust width as needed
      backgroundColor: "#fff",
      padding: 20,
      borderRightWidth: 1,
      borderRightColor: "#ddd",
      zIndex: 4, // Ensure sidebar is above chatContainer but below menuButton
    },
    channel: {
      padding: 15,
      borderBottomWidth: 1,
      borderBottomColor: "#eee",
      fontSize: 16,
    },
    chatContainer: {
        flex: 1,
        paddingBottom: 30
      //marginLeft: 0, // Adjust if sidebar is visible
      //zIndex: 1,
    },

    // Additional styles...
  });

export default ChatScreen;
