import React, { createContext, useState } from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ChatPage from './Components/Chat/ChatPage';
import Home from './Components/Home';
import Login from './Components/Login';
import PrivateRoute from './Components/PrivateRoute/PrivateRoute';
import SignUp from './Components/SignUp';

export const UserContext = createContext();

const App = () => {
  const [loggedInUser, setLoggedInUser] = useState();
   const [selectedChat, setSelectedChat] = useState();
   const [chats, setChats] = useState([]);
   const [notification, setNotification] = useState([])
  
  return (
    <UserContext.Provider
      value={[
        loggedInUser,
        setLoggedInUser,
        selectedChat,
        setSelectedChat,
        chats,
        setChats,
        notification,
        setNotification,
      ]}
    >
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route index element={<Login />} />
          <Route
            path="/chat"
            element={
              <PrivateRoute>
                <ChatPage />
              </PrivateRoute>
            }
          />
          <Route path="/Login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="*" element={<Login />} />
        </Routes>
      </BrowserRouter>
    </UserContext.Provider>
  );
};

export default App;