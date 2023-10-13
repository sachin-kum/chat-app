import { ViewIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  FormControl,
  IconButton,
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
} from "@chakra-ui/react";
import React, { useState } from "react";
import UserBadgeItem from "../userAvatar/UserBadgeItem";
import { ChatState } from "../../Context/ChatProvider";
import axios from "axios";
import { BaseUrl } from "../../BaseUrl";
import UserListItem from "../userAvatar/UserListItem";
const UpdateGroupChatModal = ({ fetchMessages, fetchAgain, setFetchAgian }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [groupChatName, setGroupChatName] = useState();
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [renameloading, setRenameLoading] = useState(false);
  const toast = useToast();

  const { selectedChat, setSelectedChat, user } = ChatState();
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

  const handleRename = () => {
    if (!groupChatName) return;
    setRenameLoading(true);
    axios
      .put(
        `${BaseUrl}/api/chat/rename-group`,
        {
          chatId: selectedChat._id,
          chatName: groupChatName,
        },
        {
          headers: {
            Authorization: ` ${user.token}`,
          },
        }
      )
      .then((res) => {
        setSelectedChat(res?.data);
        setFetchAgian(!fetchAgain);
        setRenameLoading(false);
      })
      .catch((err) => {
        toast({
          title: "Error Occured!",
          description: err,
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
        setRenameLoading(false);
      });
    setGroupChatName("");
  };

  const handleAddUser = (user1) => {
    if (selectedChat.users.find((u) => u._id === user1._id)) {
      toast({
        title: "User Already in group!",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }

    if (selectedChat.groupAdmin._id !== user._id) {
      toast({
        title: "Only admins can add someone!",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }

    setLoading(true);
    axios
      .put(
        `${BaseUrl}/api/chat/add-to-group`,
        {
          chatId: selectedChat._id,
          userId: user1._id,
        },
        {
          headers: {
            Authorization: ` ${user.token}`,
          },
        }
      )
      .then((res) => {
        setSelectedChat(res?.data);
        setFetchAgian(!fetchAgain);
        setLoading(false);
      })
      .catch((err) => {
        toast({
          title: "Error Occured!",

          status: "error",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
        setLoading(false);
      });
    setGroupChatName("");
  };

  const handleRemove = (user1) => {
    if (selectedChat.groupAdmin._id !== user._id && user1._id !== user._id) {
      toast({
        title: "Only admins can remove someone!",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }

    setLoading(true);
    axios
      .put(
        `${BaseUrl}/api/chat/remove-from-group`,
        {
          chatId: selectedChat._id,
          userId: user1._id,
        },
        {
          headers: {
            Authorization: ` ${user.token}`,
          },
        }
      )
      .then((res) => {
        user1._id === user._id ? setSelectedChat() : setSelectedChat(res?.data);
        setFetchAgian(!fetchAgain);
        fetchMessages();
        setLoading(false);
      })
      .catch((err) => {
        toast({
          title: "Error Occured!",

          status: "error",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
        setLoading(false);
      });
    setGroupChatName("");
  };

  return (
    <>
      <IconButton d={{ base: "flex" }} icon={<ViewIcon />} onClick={onOpen} />
      <Modal onClose={onClose} isOpen={isOpen} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
            fontSize="35px"
            fontFamily="Work sans"
            d="flex"
            justifyContent="center"
          >
            {selectedChat.chatName}
          </ModalHeader>

          <ModalCloseButton />

          <ModalBody d="flex" flexDir="column" alignItems="center">
            <Box w="100%" display="flex" flexWrap="wrap" pb={3}>
              {selectedChat.users.map((u) => (
                <UserBadgeItem
                  key={u._id}
                  user={u}
                  admin={selectedChat.groupAdmin}
                  handleFunction={() => handleRemove(u)}
                />
              ))}
            </Box>
            <FormControl display="flex">
              <Input
                placeholder="Chat Name"
                mb={3}
                value={groupChatName}
                onChange={(e) => setGroupChatName(e.target.value)}
              />
              <Button
                variant="solid"
                colorScheme="teal"
                ml={1}
                isLoading={renameloading}
                onClick={handleRename}
              >
                Update
              </Button>
            </FormControl>
            <FormControl>
              <Input
                placeholder="Add User to group"
                mb={1}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </FormControl>
            {loading ? (
              <Spinner />
            ) : (
              // <div>Loading...</div>
              searchResult?.map((user) => (
                <UserListItem
                  key={user._id}
                  user={user}
                  handleFunction={() => handleAddUser(user)}
                />
              ))
            )}
          </ModalBody>
          <ModalFooter>
            <Button onClick={() => handleRemove(user)} colorScheme="red">
              Leave Group
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default UpdateGroupChatModal;
