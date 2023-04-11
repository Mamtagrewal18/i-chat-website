import { useContext, createContext, useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useHistory } from "react-router-dom";
const chatContext = createContext();
const ChatProvider = ({ children }) => {
  const router = useRouter();
  const [user, setUser] = useState();
  // const [chats, setChats] = useState([]);
  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState();
  // const history = useHistory();
  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    setUser(userInfo);

    if (!userInfo) router.replace("/");
    return () => {};
  }, []);

  return (
    <chatContext.Provider
      value={{
        user,
        setUser,
        chats,
        setChats,
        selectedChat,
        setSelectedChat,
      }}
    >
      {children}
    </chatContext.Provider>
  );
};

export const ChatState = () => {
  return useContext(chatContext);
};
export default ChatProvider;
