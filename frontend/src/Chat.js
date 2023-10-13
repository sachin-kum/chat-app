import axios from "axios";
import React, { useEffect, useState } from "react";
import { BaseUrl } from "./BaseUrl";
import { Box } from "@chakra-ui/react";
import SideDrawer from "./components/SideDrawer";
import MyChats from "./components/MyChats";
import ChatBox from "./components/ChatBox";
import { ChatState } from "./Context/ChatProvider";
import { useNavigate } from "react-router-dom";

const Chat = () => {
  const { user, setUser } = ChatState();
  const navigate = useNavigate();

  useEffect(() => {
    let info = localStorage.getItem("userInfo");

    if (info) {
      const userInfo = JSON.parse(info);

      setUser(userInfo?.user);
    }
  }, []);

  return (
    <>
      <div style={{ width: "100%" }}>
        {user && <SideDrawer />}
        <Box
          display="flex"
          justifyContent="space-between"
          w="100%"
          h="91.5vh"
          p="10px"
        >
          {user && <MyChats />}
          {user && <ChatBox />}
        </Box>
      </div>
    </>
  );
};

export default Chat;
