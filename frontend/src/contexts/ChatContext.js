import {useContext,createContext,useState,useEffect} from 'react';
import { Navigate } from 'react-router-dom';

const ChatContext=createContext();
const ChatProvider=({children})=>{
   const [user,setUser]=useState();
   const [selectedChat,setSelectedChat]=useState();
   const [chats,setChats]=useState([]);

   useEffect(()=>{
      const userInfo=JSON.parse(localStorage.getItem('userinfo'));
      setUser(userInfo);

      if(!userInfo){
         <Navigate to="/"/>
      }
   },[])
   return (
      <ChatContext.Provider
         value={{
            user,
            setUser,
            selectedChat,
            setSelectedChat,
            chats,
            setChats
         }}
      >
         {children}
      </ChatContext.Provider>
   )
}

export {ChatContext,ChatProvider};
export const ChatState=()=>{
   return useContext(ChatContext);
}