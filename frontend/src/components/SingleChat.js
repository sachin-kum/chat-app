import React, { useEffect, useState } from "react";
import { ChatState } from "../Context/ChatProvider";
import {
  Box,
  FormControl,
  IconButton,
  Input,
  Spinner,
  Text,
  useToast,
} from "@chakra-ui/react";
import { IoSendSharp } from "react-icons/io5";
import { ArrowBackIcon } from "@chakra-ui/icons";
import { getSender, getSenderFull } from "../Config/ChatLogics";
import ProfileModel from "./Modals/ProfileModel";
import UpdateGroupChatModal from "./Modals/UpdateGroupChatModal";
import axios from "axios";
import { BaseUrl } from "../BaseUrl";
import ScrollableChat from "./ScrollableChat";
import { io } from "socket.io-client";
import animationData from "./animations/typing.json";
import Lottie from "react-lottie";
const ENDPOINT = "http://localhost:8000"; // "https://talk-a-tive.herokuapp.com"; -> After deployment
let socket, selectedChatCompare;

const defaultOptions = {
  loop: true,
  autoplay: true,
  animationData: animationData,
  rendererSettings: {
    preserveAspectRatio: "xMidYMid slice",
  },
};

const SingleChat = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [socketConnected, setSocketConnected] = useState(false);
  const [typing, setTyping] = useState(false);
  const [istyping, setIsTyping] = useState(false);
  const toast = useToast();
  const {
    selectedChat,
    setSelectedChat,
    user,
    fetchAgain,
    setFetchAgian,
    chat,
    notification,
    setNotification,
  } = ChatState();

  const fetchMessages = () => {
    if (!selectedChat) return;
    setLoading(true);
    axios
      .get(`${BaseUrl}/api/message/messages/${selectedChat._id}`, {
        headers: {
          Authorization: ` ${user.token}`,
        },
      })
      .then((res) => {
        setMessages(res?.data);
        setLoading(false);
        socket.emit("join chat", selectedChat._id);
      })
      .catch((err) => {
        toast({
          title: "Error Occured!",
          description: "Failed to send the Message",
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
      });
  };

  const sendMessage = (event) => {
    event.preventDefault();
    if (newMessage.trim()) {
      setNewMessage("");
      socket.emit("stop typing", selectedChat._id);
      axios
        .post(
          `${BaseUrl}/api/message/messages`,

          {
            content: newMessage,
            chatId: selectedChat._id,
          },
          {
            headers: {
              Authorization: ` ${user.token}`,
            },
          }
        )
        .then((res) => {
          socket.emit("new message", res?.data);
          setMessages([...messages, res?.data]);
          // sendmsg(selectedChat?.users[1]._id, newMessage);
        })
        .catch((err) => {
          toast({
            title: "Error Occured!",
            description: "Failed to send the Message",
            status: "error",
            duration: 5000,
            isClosable: true,
            position: "bottom",
          });
        });
    }
  };
  useEffect(() => {
    socket = io(ENDPOINT);
    socket.emit("setup", user);
    socket.on("connected", () => setSocketConnected(true));
    socket.on("typing", () => setIsTyping(true));
    socket.on("stop typing", () => setIsTyping(false));

    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    fetchMessages();

    selectedChatCompare = selectedChat;
    // eslint-disable-next-line
  }, [selectedChat]);
  useEffect(() => {
    socket.on("message recieved", (newMessageRecieved) => {
      if (
        !selectedChatCompare || // if chat is not selected or doesn't match current chat
        selectedChatCompare._id !== newMessageRecieved.chat._id
      ) {
        if (!notification.includes(newMessageRecieved)) {
          setNotification([newMessageRecieved, ...notification]);
          setFetchAgian(!fetchAgain);
        }
      } else {
        setMessages([...messages, newMessageRecieved]);
      }
    });
  });

  const typingHandler = (e) => {
    setNewMessage(e.target.value);
    if (!socketConnected) return;

    if (!typing) {
      setTyping(true);
      socket.emit("typing", selectedChat._id);
    }
    let lastTypingTime = new Date().getTime();
    var timerLength = 3000;
    setTimeout(() => {
      var timeNow = new Date().getTime();
      var timeDiff = timeNow - lastTypingTime;
      if (timeDiff >= timerLength && typing) {
        socket.emit("stop typing", selectedChat._id);
        setTyping(false);
      }
    }, timerLength);
  };
  console.log("home", notification);

  return (
    <>
      {selectedChat ? (
        <>
          <Text
            fontSize={{ base: "28px", md: "30px" }}
            pb={3}
            px={2}
            w="100%"
            fontFamily="Work sans"
            display="flex"
            justifyContent={{ base: "space-between" }}
            alignItems="center"
          >
            <IconButton
              display={{ base: "flex", md: "none" }}
              icon={<ArrowBackIcon />}
              onClick={() => setSelectedChat("")}
            />
            {!selectedChat.isGroupChat ? (
              <>
                {getSender(user, selectedChat.users)}
                <ProfileModel user={getSenderFull(user, selectedChat.users)} />
              </>
            ) : (
              <>
                {selectedChat.chatName.toUpperCase()}
                <UpdateGroupChatModal
                  fetchMessages={fetchMessages}
                  setFetchAgian={setFetchAgian}
                  fetchAgain={fetchAgain}
                />
              </>
            )}
          </Text>
          <Box
            display="flex"
            flexDir="column"
            justifyContent="flex-end"
            p={3}
            bg="#E8E8E8"
            w="100%"
            h="100%"
            borderRadius="lg"
            overflowY="hidden"
          >
            {" "}
            {loading ? (
              <Spinner
                size="xl"
                w={10}
                h={10}
                alignSelf="center"
                margin="auto"
              />
            ) : (
              <div className="messages">
                <ScrollableChat messages={messages} />
              </div>
            )}
            <form onSubmit={sendMessage}>
              <FormControl
                position={"relative"}
                id="first-name"
                mt={3}
                className="chatmsgbox "
              >
                {istyping ? (
                  <div>
                    <Lottie
                      options={defaultOptions}
                      // height={50}
                      width={70}
                      style={{ marginBottom: 15, marginLeft: 0 }}
                    />
                  </div>
                ) : (
                  <></>
                )}
                <Input
                  w={"90%"}
                  bg="#E0E0E0"
                  color="black"
                  placeholder="Enter a message.."
                  value={newMessage}
                  onChange={typingHandler}
                />
                <button className="sendmsgIcon">
                  <IoSendSharp size={30} color="rgb(55 51 51)" />
                </button>
              </FormControl>
            </form>
          </Box>
        </>
      ) : (
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          h="100%"
        >
          <Text fontSize="3xl" pb={3} fontFamily="Work sans">
            Click on a user to start chatting
          </Text>
        </Box>
      )}
    </>
  );
};

export default SingleChat;
