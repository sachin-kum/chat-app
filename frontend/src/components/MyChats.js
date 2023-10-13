import React from "react";
import { ChatState } from "../Context/ChatProvider";

import axios from "axios";
import { BaseUrl } from "../BaseUrl";
import { useState } from "react";
import { useEffect } from "react";
import { Avatar, Box, Button, Stack, Text, useToast } from "@chakra-ui/react";
import { AddIcon, ChatIcon } from "@chakra-ui/icons";
import ChatLoading from "./ChatLoading";
// import { getSender } from "../Config/ChatLogics";
import GroupChatModal from "./Modals/GroupChatModal";
import { getSender } from "../Config/ChatLogics";

const MyChats = ({}) => {
  const [loggedUser, setLoggedUser] = useState();

  const { selectedChat, setSelectedChat, user, chats, setChats, fetchAgain } =
    ChatState();

  useEffect(() => {
    fetchChats();
  }, [fetchAgain]);

  const toast = useToast();

  const fetchChats = () => {
    axios
      .get(`${BaseUrl}/api/chat/fetch-chats`, {
        headers: {
          "Content-type": "application/json",
          Authorization: `${user.token}`,
        },
      })
      .then((res) => {
        setChats(res?.data);
      })
      .catch((err) => {
        toast({
          title: "Error Occured!",
          description: "Failed to Load the chats",
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "bottom-left",
        });
      });
  };

  return (
    <Box
      display={{ base: selectedChat ? "none" : "flex", md: "flex" }}
      flexDir="column"
      alignItems="center"
      p={3}
      bg="white"
      w={{ base: "100%", md: "31%" }}
      borderRadius="lg"
      borderWidth="1px"
    >
      <Box
        pb={3}
        px={3}
        fontSize={{ base: "28px", md: "30px" }}
        fontFamily="Work sans"
        display="flex"
        w="100%"
        justifyContent="space-between"
        alignItems="center"
      >
        <ChatIcon />
        <GroupChatModal>
          <Button
            display="flex"
            fontSize={{ base: "17px", md: "10px", lg: "17px" }}
            rightIcon={<AddIcon />}
          >
            New Group Chat
          </Button>
        </GroupChatModal>
      </Box>

      <Box
        display="flex"
        flexDir="column"
        p={3}
        bg="#F8F8F8"
        w="100%"
        h="100%"
        borderRadius="lg"
        overflowY="hidden"
      >
        {chats ? (
          <Stack overflowY="scroll" className="selected_chat_hover">
            {chats?.map((res) => {
              return (
                <Box
                  onClick={() => {
                    setSelectedChat(res);
                  }}
                  cursor="pointer"
                  bg={selectedChat === res ? "#38B2AC" : "#E8E8E8"}
                  color={selectedChat === res ? "white" : "black"}
                  px={3}
                  py={2}
                  borderRadius="lg"
                  key={res._id}
                >
                  <Text>
                    {!res.isGroupChat
                      ? getSender(loggedUser, res.users)
                      : res.chatName}
                  </Text>
                </Box>
              );
            })}
          </Stack>
        ) : (
          <ChatLoading />
        )}
      </Box>
    </Box>
  );
};

export default MyChats;
