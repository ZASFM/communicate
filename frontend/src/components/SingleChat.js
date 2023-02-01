import { ChatState } from "../contexts/ChatContext";
import { Box, FormControl, IconButton, Input, Spinner, Text, useToast } from '@chakra-ui/react';
import { ArrowBackIcon } from "@chakra-ui/icons";
import { getSender, getSenderFull } from "./config/ChatLogic";
import ProfileModal from "./user/profileModal";
import UpdateGroupChat from "./user/UpdateGroupChat";
import { useEffect, useState } from "react";
import axios from "axios";
import Chat from "./Chat";
import io from 'socket.io-client';

const ENDPOINT='http://localhost:5000';
var socket, selectedChatCompare;

const SingleChat = ({ fetchAgain, setFetchAgain }) => {
   const [messages, setMessages] = useState([]);
   const [loading, setLoading] = useState(false);
   const [newMessage, setNewMessage] = useState('');
   const [socketConnected, setSocketConnected] = useState(false);

   const { user, selectedChat, setSelectedChat } = ChatState();
   const toast = useToast();

   const sendMessage = async (event) => {
      if (event.key === 'Enter' && newMessage) {
         try {
            const config = {
               headers: {
                  'Content-Type': 'application/json',
                  Authorization: `Bearer ${user.token}`
               }
            }
            const { data } = await axios.post('http://localhost:5000/api/v1/message', {
               content: newMessage,
               chatId: selectedChat._id
            }, config);

            setNewMessage('');
            setMessages([...messages, data]);
         } catch (err) {
            toast({
               title: "Error Occured!",
               description: "Failed to send the Message",
               status: "error",
               duration: 5000,
               isClosable: true,
               position: "bottom",
            });
         }
      }
   }

   const fetchMessages = async () => {
      if (!selectedChat) return;

      try {
         setLoading(true);
         const config = {
            headers: {
               Authorization: `Bearer ${user.token}`
            }
         }
         const { data } = await axios.get(`http://localhost:5000/api/v1/message/${selectedChat._id}`, config);
         console.log(data);
         setLoading(false);
         setMessages(data);
      } catch (err) {
         toast({
            title: "Error Occured!",
            description: "Failed to Load the Messages",
            status: "error",
            duration: 5000,
            isClosable: true,
            position: "bottom",
         });
         setLoading(false);
      }
   }

   const typingHandler = (e) => {
      setNewMessage(e.target.value);
   }

   useEffect(() => {
      fetchMessages();
   }, [selectedChat])

   useEffect(()=>{
      socket=io(ENDPOINT);
      socket.emit('setup',user);
      socket.on('connection',()=>setSocketConnected(true));
   },[])

   return (
      <>
         {selectedChat ?
            (
               <>
                  <Text
                     fontSize={{ base: "28px", md: "30px" }}
                     pb={3}
                     px={2}
                     w="100%"
                     fontFamily="Work sans"
                     display="flex"
                     justifyContent={{ base: "space-between" }}
                     alignItems="center"
                  >
                     <IconButton
                        display={{ base: "flex", md: "none" }}
                        icon={<ArrowBackIcon />}
                        onClick={() => setSelectedChat("")}
                     />
                     {!selectedChat.isGroupChat ?
                        (<>
                           {getSender(user, selectedChat.users)}
                           <ProfileModal
                              user={getSenderFull(user, selectedChat.users)}
                           />
                        </>) :
                        (
                           <>
                              {selectedChat.chatName.toUpperCase()}
                              {
                                 <UpdateGroupChat
                                    fetchAgain={fetchAgain}
                                    setFetchAgain={setFetchAgain}
                                    fetchMessages={fetchMessages}
                                 />
                              }
                           </>
                        )
                     }
                  </Text>
                  <Box
                     display="flex"
                     flexDir="column"
                     justifyContent="flex-end"
                     p={3}
                     bg="#E8E8E8"
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
                           <Chat
                              messages={messages}
                           />
                        </div>
                     )}
                     <FormControl onKeyDown={sendMessage} isRequired mt={3}>
                        <Input
                           variant="filled"
                           bg="#E0E0E0"
                           placeholder="Enter a message.."
                           value={newMessage}
                           onChange={typingHandler}
                        />
                     </FormControl>
                  </Box>
               </>
            ) : (
               <Box
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  h="100%"
               >
                  <Text fontSize="3xl" pb={3} fontFamily="Work sans">
                     Click on a user to start chatting
                  </Text>
               </Box >
            )}
      </>
   )
}

export default SingleChat;