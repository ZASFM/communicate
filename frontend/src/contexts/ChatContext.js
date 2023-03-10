import { useContext, createContext, useState, useEffect } from 'react';
import { json, Navigate } from 'react-router-dom';

const ChatContext = createContext();
const ChatProvider = ({ children }) => {
   const [user, setUser] = useState();
   const [selectedChat, setSelectedChat] = useState();
   const [chats, setChats] = useState([]);
   const [notifications, setNotifications] = useState([]);
   const [filterChat,setFilterChat]=useState([]);

   useEffect(() => {
      const userInfo = JSON.parse(localStorage.getItem('userinfo'));
      setUser(userInfo);

      if (!userInfo) {
         <Navigate to="/" />
      }
   }, [])

/*    useEffect(()=>{
      const filterId=selectedChat.users.filter(User=>User._id!==user.user._id);;
   },[selectedChat]) */

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