import { createContext, useState } from "react";

export const ChatContext = createContext({ chatOpen: false, setChatOpen: (value: any) => { } });

export const ChatContextProvider: React.FC<{ children: any }> = ({ children }) => {
  const [chatOpen, setChatOpen] = useState(false);

  return (
    <ChatContext.Provider value={{ chatOpen, setChatOpen }}>
      {children}
    </ChatContext.Provider>
  );
};