import { createContext, useState } from "react";

export const ChatContext = createContext({ chatOpen: false, setChatOpen: (value: any) => { }, selectedChatId: '', setSelectedChatId: (value: any) => { } });

export const ChatContextProvider: React.FC<{ children: any }> = ({ children }) => {
  const [chatOpen, setChatOpen] = useState(false);
  const [selectedChatId, setSelectedChatId] = useState('');

  return (
    <ChatContext.Provider value={{ chatOpen, setChatOpen, selectedChatId, setSelectedChatId }}>
      {children}
    </ChatContext.Provider>
  );
};