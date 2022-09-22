import { Box } from '@chakra-ui/react';
import React, {useContext} from 'react';
import {UserContext} from '../../App'
import SingleChat from "./SingleChat/SingleChat";

const ChatBox = ({ fetchAgain, setFetchAgain }) => {
  const [
    loggedInUser,
    setLoggedInUser,
    selectedChat,
    setSelectedChat,
    chats,
    setChats,
  ] = useContext(UserContext);
  const user = loggedInUser;


  return (
    <Box
      d={{ base: selectedChat ? "flex" : "none", md: "flex" }}
      alignItems="center"
      flexDir="column"
      p={3}
      bg="white"
      w={{ base: "100%", md: "68%" }}
      borderRadius="lg"
      borderWidth="1px"
    >
      <SingleChat fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
    </Box>
  );
};

export default ChatBox;