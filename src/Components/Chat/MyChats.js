import { AddIcon } from "@chakra-ui/icons";
import { Avatar, Box, Button, Stack, Text, useToast } from "@chakra-ui/react";
import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../../App";
import ChatLoading from "./ChatLoading";
import { getSender} from "../../Config/ChatLogins";
import GroupChatModal from "./GroupChatModal"


const MyChats = ({ fetchAgain }) => {
  const [loggedUser, setLoggedUser] = useState();
  const [
    loggedInUser,
    setLoggedInUser,
    selectedChat,
    setSelectedChat,
    chats,
    setChats,
  ] = useContext(UserContext);

  const user = loggedInUser;

  const toast = useToast();

  const fetchChats = () => {
    fetch("https://talk-a-tive-server.herokuapp.com/chat", {
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setChats(data);
      })
      .catch((err) => {
        toast({
          title: "Error occured",
          description: "Failed to load the Chats",
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "bottom-left",
        });
      });
  };

  useEffect(() => {
    setLoggedUser(JSON.parse(localStorage.getItem("userInfo")));
    fetchChats();
  }, [fetchAgain]);

  return (
    <Box
      d={{ base: selectedChat ? "none" : "flex", md: "flex" }}
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
        d="flex"
        w="100%"
        justifyContent="space-between"
        alignItems="center"
      >
        my chats
        <GroupChatModal>
          <Button d="flex" fontSize={{ base: "17px", md: "10px", lg: "17px" }}>
            New Group Chat
          </Button>
        </GroupChatModal>
      </Box>
      <Box
        d="flex"
        flexDir="column"
        p={3}
        bg="#f8f8f8"
        w="100%"
        h="100%"
        borderRadius="lg"
        overflowY="hidden"
      >
        {chats ? (
          <Stack overflowY="scroll">
            {chats.map((chat) => (
              <Box
                onClick={() => setSelectedChat(chat)}
                cursor="pointer"
                d="flex"
                alignItems="center"
                bg={selectedChat === chat ? "#38b2ac" : "#e8e8e8"}
                color={selectedChat === chat ? "white" : "black"}
                px={3}
                py={2}
                borderRadius="lg"
                key={chat._id}
              >
                {/* <Avatar
                  size="sm"
                  cursor="pointer"
                  name={chat.name}
                  src={chat.latestMessage && chat.latestMessage.sender.pic}
                /> */}

                <Box ml={3} style={{ marginLeft: "5px" }}>
                  <Text>
                    {!chat.isGroupChat
                      ? getSender(loggedUser, chat.users)
                      : chat.chatName}
                  </Text>
                  {console.log(chat)}
                  <Text>
                    <b>
                      {chat.latestMessage && chat.latestMessage.sender.name} : 
                    </b>
                    {chat.latestMessage &&
                      chat.latestMessage.content.slice(0, 15)}
                  </Text>
                </Box>
              </Box>
            ))}
          </Stack>
        ) : (
          <ChatLoading />
        )}
      </Box>
    </Box>
  );
};

export default MyChats;
