import { createContext, useContext, useEffect, useState } from "react";
import { createBrowserHistory } from "history";
import { useNavigate } from "react-router-dom";
const ChatContext = createContext();

const ChatProvider = ({ children }) => {
  const history = createBrowserHistory();

  const [user, setUser] = useState(null);
  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState();
  const [fetchAgain, setFetchAgian] = useState(false);

  // useEffect(() => {
  //   let info = localStorage.getItem("userInfo");

  //   if (info) {
  //     const userInfo = JSON.parse(info);

  //     setUser(userInfo?.user);
  //   }
  // }, [window.location.pathname]);

  return (
    <ChatContext.Provider
      value={{
        user,
        setUser,
        chats,
        setChats,
        selectedChat,
        setSelectedChat,
        fetchAgain,
        setFetchAgian,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const ChatState = () => {
  return useContext(ChatContext);
};
export default ChatProvider;
