import { AddIcon } from "@chakra-ui/icons";
import { Box, Button, Stack, useToast, Text } from "@chakra-ui/react";
import axios from "axios";
import { useEffect, useState } from "react";
import { ChatState } from "../contexts/ChatContext";
import ChatLoading from "./ChatLoading";
import { getSender, checkStatus } from "./config/ChatLogic";
import GroupChatModal from "./user/GroupChatModal";
import io from 'socket.io-client';

const ENDPOINT = 'http://localhost:5000';
let socket;
const MyChats = ({ fetchAgain }) => {
   const {
      user,
      setUser,
      selectedChat,
      setSelectedChat,
      chats,
      setChats
   } = ChatState();
   const [loggedUser, setLoggedUser] = useState();
   const [onlineUsers, setOnlineUsers] = useState([]);
   const toast = useToast();

   const fetchChat = async () => {
      try {
         const config = {
            headers: {
               Authorization: `Bearer ${user.token}`
            }
         }

         const { data } = await axios.get('http://localhost:5000/api/v1/chat', config);
         setChats(data);
      }
      catch (err) {
         toast({
            title: "Error Occured!",
            description: "Failed to Load the chats",
            status: "error",
            duration: 5000,
            isClosable: true,
            position: "bottom-left",
         });
      }
   }

   useEffect(() => {
      setLoggedUser(JSON.parse(localStorage.getItem('userinfo')));
      fetchChat();
   }, [fetchAgain])

   useEffect(() => {
      socket = io(ENDPOINT);
   }, [user])

   //whenever someone enters the application with emit and online message, here im listning foe those emitters, and adding the id of the user, to my online users array and changing the status to green
   useEffect(() => {
      socket.on('online', (id) => {
         setOnlineUsers(preVal => [...preVal, id]);
      });
      if (socket.connected) return () => socket.removeAllListeners('online');
   })

   useEffect(()=>{
      socket.emit('online', user.user._id);
   },[onlineUsers])

   return (
      <Box
         display={{ base: selectedChat ? "none" : "flex", md: "flex" }}
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
            display="flex"
            w="100%"
            justifyContent="space-between"
            alignItems="center"
         >
            My chats:
            <GroupChatModal>
               <Button
                  display="flex"
                  fontSize={{ base: "17px", md: "10px", lg: "17px" }}
                  rightIcon={<AddIcon />}
               >
                  New Group Chat
               </Button>
            </GroupChatModal>
         </Box>
         <Box
            display="flex"
            flexDir="column"
            p={3}
            bg="#F8F8F8"
            w="100%"
            h="100%"
            borderRadius="lg"
            overflowY="hidden"
         >
            {chats ? (
               <Stack overflow="scroll">
                  {chats.map(chat => (
                     <Box
                        onClick={() => setSelectedChat(chat)}
                        cursor="pointer"
                        bg={selectedChat === chat ? "#38B2AC" : "#E8E8E8"}
                        color={selectedChat === chat ? "white" : "black"}
                        px={3}
                        py={2}
                        borderRadius="lg"
                        key={chat._id}
                     >
                        <Text>
                           {!chat.isGroupChat ?
                              (<>
                                 {getSender(loggedUser.user, chat.users)}
                                 {
                                    onlineUsers === []?
                                    null: 
                                    (checkStatus(onlineUsers,chat.users,loggedUser.user)? <span> 🟢</span>:<span> ⚪</span>)
                                 } 
                              </>)
                              : (chat.chatName)
                           }

                        </Text>
                        {chat.latestMessage && (
                           <Text fontSize="xs">
                              <b>{chat.latestMessage.sender.name} : </b>
                              {chat.latestMessage.content.length > 50
                                 ? chat.latestMessage.content.substring(0, 51) + "..."
                                 : chat.latestMessage.content}
                           </Text>
                        )}
                     </Box>
                  ))}
               </Stack>
            )
               : (
                  <ChatLoading />
               )}
         </Box>
      </Box>
   )
}

export default MyChats;