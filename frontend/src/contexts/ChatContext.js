import { useContext, createContext, useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';

const ChatContext = createContext();
const ChatProvider = ({ children }) => {
   //user is the logged in user
   const [user, setUser] = useState();
   //will be the chat that im currently in:
   const [selectedChat, setSelectedChat] = useState();
   //list of the chats that I have been initiating so far
   const [chats, setChats] = useState([]);
   //List of the notifications of the logged in user
   const [notifications, setNotifications] = useState([]);

   useEffect(() => {
      const userInfo = JSON.parse(localStorage.getItem('userinfo'));
      setUser(userInfo);

      if (!userInfo) {
         <Navigate to="/" />
      }
   }, [])

   return (
      <ChatContext.Provider
         value={{
            user,
            setUser,
            selectedChat,
            setSelectedChat,
            chats,
            setChats,
            notifications,
            setNotifications
         }}
      >
         {children}
      </ChatContext.Provider>
   )
}

export { ChatContext, ChatProvider };
export const ChatState = () => {
   return useContext(ChatContext);
}