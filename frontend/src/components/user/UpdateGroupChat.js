import { useDisclosure } from "@chakra-ui/hooks";
import { ViewIcon } from "@chakra-ui/icons";
import { Box, Button, FormControl, IconButton, Input, Spinner, useToast } from "@chakra-ui/react";
import {
   Modal,
   ModalOverlay,
   ModalContent,
   ModalHeader,
   ModalFooter,
   ModalBody,
   ModalCloseButton,
} from '@chakra-ui/react';
import axios from "axios";
import { useState } from "react";
import { ChatState } from "../../contexts/ChatContext";
import UserBadgeItem from "../userAvatar/UserBadgeItem";
import UserListItem from "../userAvatar/UserListItem";
import { Link } from "react-router-dom";

const UpdateGroupChat = ({ fetchAgain, setFetchAgain, fetchMessages }) => {
   const { isOpen, onOpen, onClose } = useDisclosure();
   const [groupChatName, setGroupChatName] = useState('');
   const [search, setSearch] = useState("");
   const [searchResult, setSearchResult] = useState([]);
   const [loading, setLoading] = useState(false);
   const [renameLoading, setRenameLoading] = useState(false);
   const toast = useToast();

   const { user, selectedChat, setSelectedChat } = ChatState();

   const handleRemove = async (userTR) => {
      if (selectedChat.groupAdmin.id !== user._id && userTR._id !== user._id) {
         toast({
            title: "Only admins can remove someone!",
            status: "error",
            duration: 5000,
            isClosable: true,
            position: "bottom",
         });
         return;
      }
      try {
         setLoading(true);
         const config = {
            headers: {
               Authorization: `Bearer ${user.token}`
            }
         }
         const { data } = await axios.put('http://localhost:5000/api/v1/chat/groupremove', {
            chatId: selectedChat._id,
            userId: userTR._id,
         }, config);
         user._id === userTR._id ? setSelectedChat() : setSelectedChat(data);
         setLoading(false);
         fetchMessages();
         setFetchAgain(!fetchAgain);
      } catch (err) {
         toast({
            title: "Error Occured!",
            description: err.response.data.message,
            status: "error",
            duration: 5000,
            isClosable: true,
            position: "bottom",
         });
         setLoading(false);
      }
   }
   const handleAddUser = async (userTA) => {
      if (selectedChat.users.find(u => u._id === userTA._id)) {
         toast({
            title: "User Already in group!",
            status: "error",
            duration: 5000,
            isClosable: true,
            position: "bottom",
         });
         return;
      }

      if (selectedChat.groupAdmin._id === user._id) {
         toast({
            title: "Only admins can add someone!",
            status: "error",
            duration: 5000,
            isClosable: true,
            position: "bottom",
         });
         return;
      }

      try {
         setLoading(true);
         const config = {
            headers: {
               Authorization: `Bearer ${user.token}`
            }
         }
         const { data } = await axios.put('http://localhost:5000/api/v1/chat/groupadd', {
            chatId: selectedChat._id,
            userId: userTA._id,
         }, config);
         setSelectedChat(data);
         setLoading(false);
         setFetchAgain(!fetchAgain);
      } catch (err) {
         toast({
            title: "Error Occured!",
            description: err.response.data.message,
            status: "error",
            duration: 5000,
            isClosable: true,
            position: "bottom",
         });
         setLoading(false);
      }
   }

   const handleRename = async () => {
      if (!groupChatName) return;
      try {
         setRenameLoading(true);
         const config = {
            headers: {
               Authorization: `Bearer ${user.token}`,
            }
         }
         console.log(selectedChat);
         const { data } = await axios.put('http://localhost:5000/api/v1/chat/rename', {
            chatId: selectedChat._id,
            chatName: groupChatName
         }, config);
         setSelectedChat(data);
         setFetchAgain(!fetchAgain);
         setRenameLoading(false);
      }
      catch (err) {
         toast({
            title: "Error Occured!",
            description: err.response.data.message,
            status: "error",
            duration: 5000,
            isClosable: true,
            position: "bottom",
         });
         setLoading(false);
      }
      setGroupChatName('');
   }

   const handleSearch = async (query) => {
      setSearch(query);
      if (!query) {
         return;
      }
      try {
         setLoading(true);
         const config = {
            headers: {
               Authorization: `Bearer ${user.token}`
            }
         }
         const { data } = await axios.get(`http://localhost:5000/api/v1/user/login?serach=${search}`, config);
         setLoading(false);
         setSearchResult(data);
         console.log(data);
      }
      catch (err) {
         toast({
            title: "Error Occured!",
            description: "Failed to Load the Search Results",
            status: "error",
            duration: 5000,
            isClosable: true,
            position: "bottom-left",
         });
      }
   }
   return (
      <>
         <IconButton onClick={onOpen} icon={<ViewIcon />} display={{ base: "flex" }} />

         <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
               <ModalHeader
                  fontSize="35px"
                  fontFamily="Work sans"
                  d="flex"
                  justifyContent="center"
               >
                  {selectedChat.chatName}
               </ModalHeader>
               <ModalCloseButton />
               <ModalBody>
                  <Box>
                     {selectedChat.users.map(u => (
                        <UserBadgeItem
                           key={u._id}
                           user={u}
                           handleFunction={() => handleRemove(u)}
                        />
                     ))}
                  </Box>
                  <FormControl display="flex">
                     <Input
                        placeholder="Chat Name"
                        mb={3}
                        value={groupChatName}
                        onChange={(e) => setGroupChatName(e.target.value)}
                     />
                     <Button
                        variant="solid"
                        colorScheme="teal"
                        ml={1}
                        isLoading={renameLoading}
                        onClick={handleRename}
                     >
                        Update
                     </Button>
                  </FormControl>
                  <FormControl>
                     <Input
                        placeholder="Add User to group"
                        mb={1}
                        onChange={(e) => handleSearch(e.target.value)}
                     />
                  </FormControl>
                  {loading ? (
                     <Spinner size="lg" />
                  ) : (
                     searchResult?.map((user) => (
                        <UserListItem
                           key={user._id}
                           user={user}
                           handleFunction={() => handleAddUser(user)}
                        />
                     ))
                  )}
               </ModalBody>

               <ModalFooter>
                  <Button onClick={() => handleRemove(user)} colorScheme="red">
                     Leave Group
                  </Button>
                  <Button variant='ghost'>
                     <Link to={`/calendar/${selectedChat._id}`}>
                        Calendar
                     </Link>
                  </Button>
               </ModalFooter>
            </ModalContent>
         </Modal>
      </>
   )
}

export default UpdateGroupChat;