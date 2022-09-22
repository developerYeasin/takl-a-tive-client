import { Avatar, Tooltip } from "@chakra-ui/react";
import React, { useContext } from "react";
import ScrollableFeed from "react-scrollable-feed";
import { UserContext } from "../../../App";
import { isLastMessage, isSameSender, isSameSenderMargin, isSameUser } from "../../../Config/ChatLogins";

const ScrollableChat = ({ messages }) => {
  const [
    loggedInUser,
    setLoggedInUser,
    selectedChat,
    setSelectedChat,
    chats,
    setChats,
  ] = useContext(UserContext);
  const user = loggedInUser;

//   console.log(messages.map((m) => console.log("ami", m.sender.pic))); 

  return (
    <ScrollableFeed>
      {messages &&
        messages.map((m, i) => (
          <div style={{ display: "flex" }} key={m._id}>
            {(isSameSender(messages, m, i, user._id) ||
              isLastMessage(messages, i, user._id)) && (
              <Tooltip label={m.sender.name} placement="bottom-start" hasArrow>
                <Avatar
                  mt="7px"
                  mr={1}
                  size="sm"
                  cursor="pointer"
                  name="m.sender.name"
                  src={m.sender.pic}
                />
              </Tooltip>
            )}
            <span
              style={{
                background: `${
                  m.sender._id === user._id ? "#bee3f8" : "#b9f5d0"
                }`,
                borderRadius: "20px",
                padding: "5px 15px",
                maxWidth: "75%",
                marginLeft: isSameSenderMargin(messages, m, i, user._id),
                marginTop: isSameUser(messages, m, i) ? 3 : 10,
              }}
            >
              {m.content}
            </span>
          </div>
        ))}
    </ScrollableFeed>
  );
};

export default ScrollableChat;
