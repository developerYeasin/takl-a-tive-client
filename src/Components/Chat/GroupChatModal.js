import React, { useContext, useState } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Button,
  FormControl,
  Input,
  useToast,
  Box,
} from "@chakra-ui/react";
import { UserContext } from '../../App';
import UserListItem from './UserListItem';
import UserBadgeItem from './UserBadgeItem'

const GroupChatModal = ({children}) => {
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

     const toast = useToast();


     const handleSearch = (query) => {
         setSearch(query);
          
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
     }
     
     const hangleGroup = (userToAdd) => {
         if(selectedUsers.includes(userToAdd)){
                 toast({
                   title: "user already added",
                   status: "error",
                   duration: 5000,
                   isClosable: true,
                   position: "top",
                 });
                 return;
         }
         setSelectedUsers([...selectedUsers, userToAdd]);
     };

     const handleDelete = (delUser) => {

         setSelectedUsers(selectedUsers.filter(sel => sel._id !== delUser._id)); 

     }

     const handleSubmit = () => {
         if(!groupChatName || !selectedUsers){
              toast({
                title: "please fill all the feilds",
                status: "warning",
                duration: 5000,
                isClosable: true,
                position: "top",
              });
              return;
         }

         fetch("https://mern-takl-a-tive.herokuapp.com/chat/group", {
           method: "post",
           headers: {
             "Content-type": "application/json",
             Authorization: `Bearer ${user.token}`,
           },
           body: JSON.stringify({
             name: groupChatName,
             users: JSON.stringify(selectedUsers.map((u) => u._id)),
           }),
         })
           .then((res) => res.json())
           .then((data) => {
             console.log(data);
             setChats([data, ...chats]);
             onClose();
             toast({
               title: "New Group Chat Created",
               status: "success",
               duration: 5000,
               isClosable: true,
               position: "bottom",
             });
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
           });


     };

    return (
      <>
        <span onClick={onOpen}>{children}</span>

        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader
              fontSize="35px"
              fontFamily="Work sans"
              d="flex"
              justifyContent="center"
            >
              Create Group Chat
            </ModalHeader>
            <ModalCloseButton />
            <ModalBody d="flex" flexDir="column" alignItems="center">
              <FormControl>
                <Input
                  placeholder="Chat Name"
                  mb={3}
                  onChange={(e) => setGroupChatName(e.target.value)}
                />
              </FormControl>
              <FormControl>
                <Input
                  placeholder="Add Users eg: "
                  mb={1}
                  onChange={(e) => handleSearch(e.target.value)}
                />
              </FormControl>

              <Box w="100%" d="flex" flexWrap="wrap" pb={3}>
                {selectedUsers.map((u) => (
                  <UserBadgeItem
                    key={u._id}
                    user={u}
                    handleFunction={() => handleDelete(u)}
                  />
                ))}
              </Box>
              {loading ? (
                <div>Loading</div>
              ) : (
                searchResult
                  ?.slice(0, 4)
                  .map((users) => (
                    <UserListItem
                      key={users._id}
                      user={users}
                      handleFunction={() => hangleGroup(users)}
                    />
                  ))
              )}
            </ModalBody>

            <ModalFooter>
              <Button colorScheme="blue" mr={3} onClick={handleSubmit}>
                Create
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </>
    );
};

export default GroupChatModal;