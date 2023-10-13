import {
  Button,
  FormControl,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spinner,
  useDisclosure,
  useToast,
  Box,
} from "@chakra-ui/react";
import React from "react";
import { ChatState } from "../../Context/ChatProvider";
import { useState } from "react";
import axios from "axios";
import { BaseUrl } from "../../BaseUrl";
import UserListItem from "../userAvatar/UserListItem";
import ChatLoading from "../ChatLoading";
import UserBadgeItem from "../userAvatar/UserBadgeItem";

const GroupChatModal = ({ children }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [groupChatName, setGroupChatName] = useState();
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loading1, setLoading1] = useState(false);

  const toast = useToast();

  const { user, chats, setChats } = ChatState();
  const handleSearch = (query) => {
    setSearch(query);

    if (!query) {
      setSearchResult([]);

      return;
    } else {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `${user.token}`,
        },
      };
      axios
        .get(`${BaseUrl}/api/user/search-user?search=${query}`, config)
        .then((data) => {
          setLoading(false);
          setSearchResult(data?.data?.users);
        })
        .catch((err) => {});
    }
  };

  const handleDelete = (delUser) => {
    setSelectedUsers(selectedUsers.filter((sel) => sel._id !== delUser._id));
  };

  const handleGroup = (userToAdd) => {
    if (selectedUsers.includes(userToAdd)) {
      toast({
        title: "User already added",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
      return;
    }

    setSelectedUsers([...selectedUsers, userToAdd]);
  };

  const handleSubmit = () => {
    if (!groupChatName || !selectedUsers.length) {
      toast({
        title: "Please fill all the feilds",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
      return;
    } else {
      setLoading1(true);
      const config = {
        headers: {
          Authorization: `${user.token}`,
        },
      };
      axios
        .post(
          `${BaseUrl}/api/chat/crate-group`,
          {
            name: groupChatName,
            users: JSON.stringify(selectedUsers.map((u) => u._id)),
          },
          config
        )
        .then((data) => {
          setChats([data?.data, ...chats]);
          onClose();
          setSearchResult([]);
          setSelectedUsers([]);
          setLoading1(false);

          toast({
            title: "New Group Chat Created!",
            status: "success",
            duration: 5000,
            isClosable: true,
            position: "top",
          });
        })
        .catch((err) => {
          setLoading1(false);

          toast({
            title: "Failed to Create the Chat!",
            description: err.response.data,
            status: "error",
            duration: 5000,
            isClosable: true,
            position: "bottom",
          });
        });
    }
  };

  return (
    <>
      <span onClick={onOpen}>{children}</span>

      <Modal
        onClose={() => {
          onClose();
          setSearchResult([]);
          setSelectedUsers([]);
        }}
        isOpen={isOpen}
        isCentered
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
            fontSize="35px"
            fontFamily="Work sans"
            display="flex"
            justifyContent="center"
          >
            Create Group Chat
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody display="flex" flexDir="column" alignItems="center">
            <FormControl>
              <Input
                autoComplete="off"
                placeholder="Chat Name"
                mb={3}
                onChange={(e) => setGroupChatName(e.target.value)}
              />
            </FormControl>
            <FormControl>
              <Input
                autoComplete="off"
                placeholder="Add Users eg: Sachin, Piyush, Jane"
                mb={1}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </FormControl>
            <Box w="100%" display="flex" flexWrap="wrap">
              {selectedUsers.map((u) => (
                <UserBadgeItem
                  key={u._id}
                  user={u}
                  handleFunction={() => handleDelete(u)}
                />
              ))}
            </Box>
            {loading ? (
              <Spinner />
            ) : (
              // <div>Loading...</div>
              searchResult?.map((user) => (
                <UserListItem
                  key={user._id}
                  user={user}
                  handleFunction={() => handleGroup(user)}
                />
              ))
            )}
          </ModalBody>
          <ModalFooter>
            {loading1 ? (
              <Button colorScheme="blue">
                <Spinner />
              </Button>
            ) : (
              <Button onClick={handleSubmit} colorScheme="blue">
                Create Chat
              </Button>
            )}
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default GroupChatModal;
