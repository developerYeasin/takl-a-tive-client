import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../../../App";
import {
  Box,
  Text,
  IconButton,
  Spinner,
  FormControl,
  Input,
} from "@chakra-ui/react";
import { ArrowBackIcon } from "@chakra-ui/icons";
import { getSender, getSenderFull } from "../../../Config/ChatLogins";
import ProfileModel from "../ProfileModel";
import UpdateGroupChatModal from "../GroupChat/UpdateGroupChatModal";
import ScrollableChat from "./ScrollableChat";
import io from "socket.io-client";

const ENDPOINT = "https://mern-takl-a-tive.herokuapp.com";

var socket, selectedChatCompare;

const SingleChat = ({ fetchAgain, setFetchAgain }) => {
  const [
    loggedInUser,
    setLoggedInUser,
    selectedChat,
    setSelectedChat,
    chats,
    setChats,
    notification,
    setNotification,
  ] = useContext(UserContext);
  const user = loggedInUser;

  // console.log(user);

  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState();
  const [socketConnected, setSocketConnected] = useState(false);

  const [isTyping, setIsTyping] = useState(false);
  const [typing, setTyping] = useState(false)

  const sendMessage = (event) => {

    socket.emit("stop typing", selectedChat._id);

    if (event.key === "Enter" && newMessage) {
      setNewMessage("");
      fetch("https://mern-takl-a-tive.herokuapp.com/message", {
        method: "post",
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({
          content: newMessage,
          chatId: selectedChat._id,
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          // console.log(data);
          socket.emit("new message", data);
          setMessages([...messages, data]);
        })
        .catch((err) => {
          console.log(err);

        });
    }
  };
  const typingHandler = (e) => {

    setNewMessage(e.target.value);

    if(!socketConnected)return;

    if (!typing) {
      setTyping(true);
      socket.emit('typing', selectedChat._id);
    }
    let lastTypingTime = new Date().getTime();
    var timerLength = 5000;

setTimeout(() => {
  var timeNow = new Date().getTime();
  var timeDiff = timeNow - lastTypingTime;

  if (timeDiff >= timerLength && typing) {
    socket.emit("stop typing", selectedChat._id);
    setTyping(false);
  }
}, timerLength);

  };

  const fetchMessages = () => {
    if (!selectedChat) return;
    setLoading(true);
    fetch(`https://mern-takl-a-tive.herokuapp.com/message/${selectedChat._id}`, {
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setMessages(data);
        setLoading(false);
        socket.emit("join chat", selectedChat._id);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    socket = io(ENDPOINT);
    socket.emit("setup", user);
    socket.on("connected", () => setSocketConnected(true));
    socket.on("typing", () => setIsTyping(true))
    socket.on("stop typing", () => setIsTyping(false));
  }, []);

  useEffect(() => {
    fetchMessages();
    selectedChatCompare = selectedChat;
  }, [selectedChat]);

  useEffect(() => {
    socket.on("message recieved", (newMessageRecieved) => {
       if (
         !selectedChatCompare || // if chat is not selected or doesn't match current chat
         selectedChatCompare._id !== newMessageRecieved.chat._id
       ) {
         if (!notification.includes(newMessageRecieved)) {
           setNotification([newMessageRecieved, ...notification]);
           setFetchAgain(!fetchAgain);
         }
       } else {
         setMessages([...messages, newMessageRecieved]);
       }
    });
  });


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
            d="flex"
            justifyContent={{ base: "space-between" }}
            alignItems="center"
          >
            <IconButton
              d={{ base: "flex", md: "none" }}
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
                  fetchAgain={fetchAgain}
                  setFetchAgain={setFetchAgain}
                  fetchMessages={fetchMessages}
                />
              </>
            )}
          </Text>
          <Box
            d="flex"
            flexDir="column"
            justifyContent="flex-end"
            p={2}
            bg="#e8e8e8"
            w="100%"
            h="100%"
            borderRadius="lg"
            overflowY="hidden"
          >
            {loading ? (
              <Spinner
                size="xl"
                w={20}
                h={20}
                alignSelf="center"
                margin="auto"
              />
            ) : (
              <div className="messages">
                <ScrollableChat messages={messages} />
              </div>
            )}

            <FormControl onKeyDown={sendMessage} mt={3} isRequired>
              {isTyping ? <div>typing...</div> : <div></div>}

              <Input
                variant="filled"
                bg="#e0e0e0"
                placeholder="Enter a message"
                onChange={typingHandler}
                value={newMessage || ""}
              />
            </FormControl>
          </Box>
        </>
      ) : (
        <Box d="flex" alignItems="centner" justifyContent="cetner" h="100%">
          <Text fontSize="3xl" pb={3} fontFamily="Work sans">
            Click on a user to start chatting
          </Text>
        </Box>
      )}
    </>
  );
};

export default SingleChat;
