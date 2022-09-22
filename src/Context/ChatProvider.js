import { createContext, useContext, useEffect, useState } from "react";

const ChatContext = createContext();


export const ChatState = () => {
  return useContext(ChatContext);
};

const ChatProvider = ({ children }) => {
  const [user, setUser] = useState();

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    setUser(userInfo);

  }, []);

  // console.log(user)

  return (
    <ChatContext.Provider value={{ user, setUser }}>
      {children}
    </ChatContext.Provider>
  );
};


export default ChatProvider;
