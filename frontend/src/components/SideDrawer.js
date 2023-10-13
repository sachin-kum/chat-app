import {
  Avatar,
  Box,
  Button,
  Drawer,
  DrawerHeader,
  DrawerOverlay,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  Text,
  Tooltip,
  DrawerContent,
  DrawerBody,
  Input,
  Spinner,
} from "@chakra-ui/react";

import { useDisclosure } from "@chakra-ui/hooks";
import React, { useState } from "react";
import { createBrowserHistory } from "history";
import { BellIcon, ChevronDownIcon, Search2Icon } from "@chakra-ui/icons";
import NotificationBadge from "react-notification-badge/lib/components/NotificationBadge";
import ProfileModel from "./Modals/ProfileModel";
import { ChatState } from "../Context/ChatProvider";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";
import { BaseUrl } from "../BaseUrl";
import ChatLoading from "./ChatLoading";
import UserListItem from "./userAvatar/UserListItem";
import "react-toastify/dist/ReactToastify.css";
const SideDrawer = () => {
  const navigate = useNavigate();
  const history = createBrowserHistory();
  const { user, setSelectedChat, chats, setChats, setUser, selectedChat } =
    ChatState();
  const [searchLabel, setSearchLabel] = useState(false);
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const logoutHandler = () => {
    localStorage.removeItem("userInfo");
    navigate("/");
    setUser("");
    setSelectedChat("");
    setChats([]);
  };

  const handleSearch = () => {
    if (!search) {
      toast.error("Please Enter something in search");
      return;
    } else {
      setLoading(true);
      setSearchLabel(true);
      axios
        .get(`${BaseUrl}/api/user/search-user?search=${search}`, {
          headers: {
            "Content-type": "application/json",
            Authorization: `${user.token}`,
          },
        })
        .then((res) => {
          setSearchResult(res.data);

          setLoading(false);
        })
        .catch((err) => {
          toast({
            title: "Error Occured!",
            description: "Failed to Load the Search Results",
            status: "error",
            duration: 5000,
            isClosable: true,
            position: "bottom-left",
          });
        });
    }
  };

  const accessChat = (UserId) => {
    setLoadingChat(true);
    const config = {
      headers: {
        "Content-type": "application/json",
        Authorization: ` ${user.token}`,
      },
    };
    axios
      .post(`${BaseUrl}/api/chat/chats`, { UserId }, config)
      .then((res) => {
        if (!chats.find((c) => c._id === res?.data._id))
          setChats([...chats, res?.data?.FullChat]);
        setSelectedChat(res?.data?.FullChat);
        setLoadingChat(false);
        onClose();
      })
      .catch((err) => {
        toast.error("Error fetching the chat");
      });
  };

  console.log("chats", chats);
  console.log("select chats", selectedChat);

  return (
    <div>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        bg="white"
        w="100%"
        p="5px 10px 5px 10px"
        borderWidth="5px"
      >
        <Tooltip label="Search Users to chat" hasArrow placement="bottom-end">
          <Button variant="ghost" onClick={onOpen}>
            <Search2Icon color="gray.600" />
            <Text display={{ base: "none", md: "flex" }} m={"auto"} px={4}>
              Search User
            </Text>
          </Button>
        </Tooltip>
        <Text fontSize="2xl" fontFamily="Work sans" m={"auto"}>
          Talk-A-Tive
        </Text>
        <div>
          <Menu p={1}>
            <MenuButton p={1}>
              <NotificationBadge
                count={10}
                // effect={Effect.SCALE}
              />
              <BellIcon fontSize="2xl" m={1} />
            </MenuButton>

            <MenuList pl={2}>
              <MenuItem>Sachin</MenuItem>
            </MenuList>
          </Menu>

          <Menu>
            <MenuButton as={Button} bg="white" rightIcon={<ChevronDownIcon />}>
              <Avatar
                size="sm"
                cursor="pointer"
                name="Sachin Kumar"
                src={user.pic}
              />
            </MenuButton>
            <MenuList>
              <ProfileModel user={user}>
                <MenuItem>My Profile</MenuItem>{" "}
              </ProfileModel>
              <MenuDivider />
              <MenuItem onClick={logoutHandler}>Logout</MenuItem>
            </MenuList>
          </Menu>
        </div>
      </Box>
      <Drawer placement="left" onClose={onClose} isOpen={isOpen}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerHeader borderBottomWidth="1px">Search Users</DrawerHeader>
          <DrawerBody>
            <Box display="flex" pb={2}>
              <Input
                placeholder="Search by name or email"
                mr={2}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <Button onClick={handleSearch}>Go</Button>
            </Box>
            {loading ? (
              <ChatLoading />
            ) : (
              <>
                {searchResult?.users?.length ? (
                  searchResult?.users.map((res) => {
                    console.log("yrr", res);
                    return (
                      <UserListItem
                        key={res._id}
                        user={res}
                        handleFunction={() => accessChat(res._id)}
                      />
                    );
                  })
                ) : (
                  <Text mt={"2"}>
                    {searchLabel ? "No User Found" : "Search User Here..."}
                  </Text>
                )}
              </>
            )}

            {loadingChat && <Spinner ml="auto" display="flex" />}
          </DrawerBody>
        </DrawerContent>
      </Drawer>
      <ToastContainer position="top-left" />
    </div>
  );
};

export default SideDrawer;
