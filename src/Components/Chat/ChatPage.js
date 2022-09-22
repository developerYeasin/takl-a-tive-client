import React, { useContext, useState } from "react";
import styled from "styled-components";
import { Box } from "@chakra-ui/react";
import {UserContext} from '../../App';
import SideDrawer from "./SideDrawer";
import MyChats from "./MyChats";
import ChatBox from "./ChatBox";

const ChatPage = () => {
  const [loggedInUser, setLoggedInUser] = useContext(UserContext);
  const user = loggedInUser;
  const [fetchAgain, setFetchAgain] = useState(false)

  return (
    <Container>
      {user && <SideDrawer />}
      <Box d="flex" justifyContent="space-between" w="100%" h="92.10vh">
        {user && (
          <MyChats fetchAgain={fetchAgain}  />
        )}
        {user && (
          <ChatBox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
        )}
      </Box>
    </Container>
  );
};
const Container = styled.div`
width: 100%;
`;

export default ChatPage;
