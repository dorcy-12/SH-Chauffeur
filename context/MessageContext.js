// MessageContext.js
import React, { createContext, useContext, useState } from "react";
import { GiftedChat } from "react-native-gifted-chat";

const MessageContext = createContext();

export const useMessageContext = () => useContext(MessageContext);

export const MessageProvider = ({ children }) => {
  const [messages, setMessages] = useState({});

  const addMessage = (channelId, newMessage, replace = false) => {
    setMessages((prevMessages) => {
      const updatedMessages = replace
        ? newMessage
        : GiftedChat.append(prevMessages[channelId] || [], newMessage);
      return {
        ...prevMessages,
        [channelId]: updatedMessages,
      };
    });
  };

  const prependMessages = (channelId, olderMessages) => {
    setMessages((prevMessages) => {
      const currentMessages = prevMessages[channelId] || [];
      const updatedMessages = [...currentMessages, ...olderMessages];
      return {
        ...prevMessages,
        [channelId]: updatedMessages,
      };
    });
  };

  return (
    <MessageContext.Provider value={{ messages, addMessage, prependMessages }}>
      {children}
    </MessageContext.Provider>
  );
};
