import { useDisclosure } from "@chakra-ui/hooks";
import { ViewIcon } from "@chakra-ui/icons";
import { Box, Button, FormControl, IconButton, Input, useToast } from "@chakra-ui/react";
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

const UpdateGroupChat = ({ fetchAgain, setFetchAgain }) => {
   const { isOpen, onOpen, onClose } = useDisclosure();
   const [groupChatName, setGroupChatName] = useState(''); 
   const [search, setSearch] = useState("");
   const [searchResult, setSearchResult] = useState([]);
   const [loading, setLoading] = useState(false);
   const [renameLoading, setRenameLoading] = useState(false);
   const toast=useToast();

   const { user, selectedChat, setSelectedChat } = ChatState();

   const handleRemove = (user) => { }

   const handleRename = async (user) => { 
      if(!groupChatName) return;
      try{
         setRenameLoading(true);
         const config={
            headers:{
               authorization:`Bearer ${user.token}`
            } 
         }
         console.log(selectedChat);
         const {data}=await axios.put('http://localhost:5000/api/v1/chat/rename',{
            chatId:selectedChat._id,
            chatName:groupChatName
         },config);
         setSelectedChat(data);
         setFetchAgain(!fetchAgain);
         setRenameLoading(false);
      }
      catch(err){
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

   const handleSearch = (user) => { }

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
               </ModalBody>

               <ModalFooter>
               <Button onClick={() => handleRemove(user)} colorScheme="red">
              Leave Group
            </Button>
               </ModalFooter>
            </ModalContent>
         </Modal>
      </>
   )
}

export default UpdateGroupChat;