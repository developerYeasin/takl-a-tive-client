import React, { useContext, useState } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  useDisclosure,
  IconButton,
  useToast,
  Box,
  FormControl,
  Input,
  Spinner,
} from "@chakra-ui/react";
import { ViewIcon } from "@chakra-ui/icons";
import { UserContext } from "../../../App";
import UserBadgeItem from "../UserBadgeItem";
import UserListItem from "../UserListItem";

const UpdateGroupChatModal = ({ fetchAgain, setFetchAgain, fetchMessages }) => {
  const [
    loggedInUser,
    setLoggedInUser,
    selectedChat,
    setSelectedChat,
    chats,
    setChats,
  ] = useContext(UserContext);
  const user = loggedInUser;
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [groupChatName, setGroupChatName] = useState();
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [renameLoading, setRenameLoading] = useState(false);

  const toast = useToast();

  const handleAddUser = (user1) => {
    setLoading(true);
    console.log(user1);
    console.log(selectedChat.users.find((u) => u._id === user1._id));

    if (selectedChat.users.find((u) => u._id === user1._id)) {
      toast({
        title: "User Already in gruoup",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }
    if (selectedChat.groupAdmin._id !== user._id) {
      toast({
        title: "Only admins can add someone",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }

    fetch("https://mern-takl-a-tive.herokuapp.com/chat/groupadd", {
      method: "put",
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${user.token}`,
      },
      body: JSON.stringify({
        chatId: selectedChat._id,
        userId: user1._id,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setSelectedChat(data);
        setFetchAgain(!fetchAgain);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        toast({
          title: "Error Occured",
          description: err.response.data.message,
          status: "warning",
          duration: 5000,
          isClosable: true,
          position: "top",
        });
        setRenameLoading(false);
      });
  };

  const handleRemove = (user1) => {
    if (selectedChat.groupAdmin._id !== user._id && user1._id !== user._id) {
      toast({
        title: "Only admins can add someone",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }
    fetch("https://mern-takl-a-tive.herokuapp.com/chat/groupremove", {
      method: "put",
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${user.token}`,
      },
      body: JSON.stringify({
        chatId: selectedChat._id,
        userId: user1._id,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        user1._id === user._id ? setSelectedChat() : setSelectedChat(data);
        setFetchAgain(!fetchAgain);
        fetchMessages();
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        toast({
          title: "Error Occured",
          description: err.response.data.message,
          status: "warning",
          duration: 5000,
          isClosable: true,
          position: "top",
        });
        setLoading(false);
      });
  };

  const handleRename = () => {
    setRenameLoading(true);
    if (!groupChatName) return;

    fetch("https://mern-takl-a-tive.herokuapp.com/chat/rename", {
      method: "put",
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${user.token}`,
      },
      body: JSON.stringify({
        chatId: selectedChat._id,
        chatName: groupChatName,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setSelectedChat(data);
        setFetchAgain(!fetchAgain);
        setRenameLoading(false);
      })
      .catch((err) => {
        console.log(err);
        toast({
          title: "please fill all the feilds",
          status: "warning",
          duration: 5000,
          isClosable: true,
          position: "top",
        });
        setRenameLoading(false);
      });
    setGroupChatName("");
  };
  const handleSearch = (query) => {
    setSearch(query);
    setLoading(true);

    if (search === "") {
      setLoading(false);
      return;
    }
    fetch(`https://mern-takl-a-tive.herokuapp.com/users?search=${search}`, {
      method: "GET",
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${user.token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        // console.log(data);
        setLoading(false);
        setSearchResult(data);
      })
      .catch((err) => {
        console.log(err);
        toast({
          title: "Error Occured!",
          description: "Failed to load the Sarch Result",
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "bottom-left",
        });
      });
  };

  return (
    <>
      <IconButton d={{ base: "flex" }} icon={<ViewIcon />} onClick={onOpen}>
        Open Modal
      </IconButton>

      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
            fontSize="35px"
            fontFamily="Word sans"
            d="flex"
            justifyContent="center"
          >
            {selectedChat.chatName}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Box w="100%" d="flex" flexWrap="wrap" pb={3}>
              {selectedChat.users.map((u) => (
                <UserBadgeItem
                  key={u._id}
                  user={u}
                  handleFunction={() => handleRemove(u)}
                />
              ))}
            </Box>
            <FormControl d="flex">
              <Input
                placeholder="Chat Name"
                mb={3}
                onChange={(e) => setGroupChatName(e.target.value)}
              />
              <Button
                variant="solid"
                colorScheme="teal"
                ml={1}
                isLoading={renameLoading}
                onClick={handleRename}
              >
                Update
              </Button>
            </FormControl>
            <FormControl>
              <Input
                placeholder="Add Users to group "
                mb={1}
                defaultValue={search}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </FormControl>
            <Box h="300px" overflowY="scroll">
              {loading ? (
                <Spinner size="lg" />
              ) : (
                searchResult?.map((u) => (
                  <UserListItem
                    key={u._id}
                    user={u}
                    handleFunction={() => handleAddUser(u)}
                  />
                ))
              )}
            </Box>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="red" mr={3} onClick={() => handleRemove(user)}>
              Leave Group
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default UpdateGroupChatModal;
