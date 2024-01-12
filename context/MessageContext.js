// MessageContext.js
import React, { createContext, useContext, useState } from 'react';

const MessageContext = createContext();

export const useMessageContext = () => useContext(MessageContext);

export const MessageProvider = ({ children }) => {
  const [messages, setMessages] = useState({});

  const addMessage = (channelId, newMessage) => {
    setMessages(prevMessages => ({
      ...prevMessages,
      [channelId]: GiftedChat.append(prevMessages[channelId] || [], newMessage),
    }));
  };

  return (
    <MessageContext.Provider value={{ messages, addMessage }}>
      {children}
    </MessageContext.Provider>
  );
};
