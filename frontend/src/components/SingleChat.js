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
import { Button } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { BsMicFill } from 'react-icons/bs';

const ENDPOINT = 'http://localhost:5000';
var socket, selectedChatCompare;

const SingleChat = ({ fetchAgain, setFetchAgain }) => {
   const [messages, setMessages] = useState([]);
   const [loading, setLoading] = useState(false);
   const [newMessage, setNewMessage] = useState('');
   const [socketConnected, setSocketConnected] = useState(false);
   const [typing, setTyping] = useState(false);
   const [isTyping, setIsTyping] = useState(false);
   const [deliverNot, setDeliverNot] = useState(false);
   const [isListening, setIsListening] = useState(false);
   const navigate = useNavigate();

   const { user, selectedChat, setSelectedChat, notifications, setNotifications } = ChatState();
   //console.log(selectedChat);
   const toast = useToast();

   const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
   const mic = new SpeechRecognition();
   mic.continuous = true;
   mic.interimResults = true;
   mic.lang = "en-US";

   const sendMessage = async (event) => {
      if (event.key === 'Enter' && newMessage) {
         socket.emit('stop typing', selectedChat._id);
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
            //console.log(data);

            socket.emit('new message', { data, room: selectedChat._id });
            setMessages([...messages, data]);
            setNewMessage('');
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
         //console.log(data);
         setLoading(false);
         setMessages(data);
         socket.emit('join chat', selectedChat._id);
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

      if (!socketConnected) return;

      if (!typing) {
         setTyping(true);
         socket.emit('typing', selectedChat._id);
      }

      let lastTimeTyping = new Date().getTime();
      let timerLength = 3000;

      //If the user stays more than 3 seconds without a typing, "typing..." should disappear
      setTimeout(() => {
         var timeNow = new Date().getTime();
         var diff = timeNow - lastTimeTyping;
         if (diff >= timerLength && typing) {
            socket.emit('stop typing', selectedChat._id);
            setTyping(false);
         }
      }, timerLength)
   }

   const addNotification = async (message) => {
      const filterId = selectedChat.users.filter(User => User._id !== user.user._id);
      /*       console.log('------');
            console.log( filterId[0]._id);
            console.log(message._id); */
      try {
         /*          await axios.post('http://localhost:5000/api/v1/user/notifications',{
                     userId:filterId[0]._id,
                     messageId:message._id,
                  }) */
      } catch (err) {
         console.log(err);
      }
   }

   useEffect(() => {
      socket = io(ENDPOINT);
      socket.emit('setup');
      socket.on('connected', () => setSocketConnected(true));
      socket.on('typing', () => setIsTyping(true));
      socket.on('stop typing', () => setIsTyping(false));
   }, [user])

   useEffect(() => {
      fetchMessages();
      selectedChatCompare = selectedChat;
      /*       if(selectedChat){
               setChatList([...chatList,selectedChat])
            }
            socket.emit('leave chat',); */
   }, [selectedChat])

   useEffect(() => {
      socket.on('message received', (newMessageReceived) => {
         //console.log(newMessageReceived);
         //throw a notification, when im not in the selected chat that:
         if (!selectedChatCompare || selectedChatCompare._id !== newMessageReceived.chat._id) {
            if (!notifications.includes(newMessageReceived)) {
               addNotification(newMessageReceived);
               setNotifications([newMessageReceived, ...notifications]);
               setFetchAgain(!fetchAgain);
            }
            //If im inside the chat, show it immediately
         } else {
            setMessages([...messages, newMessageReceived]);
            //console.log(messages);
         }
      })
   })

   const handleListen = () => {
      if (isListening) {
         mic.start();
         mic.onend = () => {
            mic.start();
         }
      } else {
         mic.stop();
         mic.onend=()=>{
            console.log('Mic stopped');
         }
      }
      
      mic.onresult=(e)=>{
         const transcript=Array.from(e.results)
            .map(results=>results[0])
            .map(result=>result.transcript)
            .join('');
         setNewMessage(transcript);
         mic.onerror=(e)=>console.log(e.error);
      }
   }

   useEffect(() => {
      handleListen();
   }, [isListening])

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
                           {getSender(user.user, selectedChat.users)}
                           <Button color='yellow.400' onClick={() => navigate('/chats/call')}>Call</Button>
                           <ProfileModal
                              user={getSenderFull(user.user, selectedChat.users)}
                           />
                        </>) :
                        (
                           <>
                              {selectedChat.chatName.toUpperCase()}
                              <Button color='yellow.400' onClick={() => navigate('/chats/call')}>Call</Button>
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
                        {isTyping ? <div>typing...</div> : <></>}
                        <div style={{ display: "flex", justifyContent: "center", gap: "15px" }}>
                           <Input
                              variant="filled"
                              bg="#E0E0E0"
                              placeholder="Enter a message.."
                              value={newMessage}
                              onChange={typingHandler}
                              width="90%"
                           />
                           <Box
                              display={"flex"}
                              justifyContent="center"
                              alignItems="center"
                              bg={"yellow.100"}
                              padding="10px"
                              rounded="lg"
                              onClick={() => setIsListening(preVal => !preVal)}
                              cursor="pointer"
                           >
                              {isListening?'Listening...':<BsMicFill/>}
                           </Box>
                        </div>
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