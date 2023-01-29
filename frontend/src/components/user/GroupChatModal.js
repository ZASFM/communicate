import { useDisclosure } from "@chakra-ui/hooks";
import {
   Modal,
   ModalOverlay,
   ModalContent,
   ModalHeader,
   ModalFooter,
   ModalBody,
   ModalCloseButton,
   Button,
   useToast,
   FormControl,
   Input,
} from '@chakra-ui/react'
import axios from "axios";
import { useState } from "react";
import { ChatState } from "../../contexts/ChatContext";
import UserListItem from '../userAvatar/UserListItem';
import UserBadgeItem from "../userAvatar/UserBadgeItem";

const GroupChatModal = ({ children }) => {
   const { isOpen, onOpen, onClose } = useDisclosure();
   const [groupChatName, setGroupChatName] = useState();
   const [selectedUsers, setSelectedUsers] = useState([]);
   const [search, setSearch] = useState("");
   const [searchResult, setSearchResult] = useState([]);
   const [loading, setLoading] = useState(false);
   const toast = useToast();
   const { user, chats, setChats } = ChatState();

   const handleSearch=async(query)=>{
      setSearch(query);
      if(!query){
         return;
      }
      try{
         setLoading(true);
         const config={
            headers:{
               Authorization:`Bearer ${user.token}`
            }
         }
         const {data}=await axios.get(`http://localhost:5000/api/v1/user/login?serach=${search}`,config);
         setLoading(false);
         setSearchResult(data);
         console.log(data);
      }
      catch(err){
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

   const handleSubmit=async()=>{
      if(!groupChatName || !selectedUsers){
         toast({
            title: "Please fill all the feilds",
            status: "warning",
            duration: 5000,
            isClosable: true,
            position: "top",
          });
          return;
      }

      try{
         const config={
            headers:{
               Authorization: `Bearer ${user.token}`,
               'Content-Type':'application/json'
            }
         }

         const {data}=await axios.post('http://localhost:5000/api/v1/chat/group',{
            name:groupChatName,
            users:JSON.stringify(selectedUsers.map(u=>u._id))
         },config)
         setChats([data,...chats]);
         onClose();
         toast({
            title: "New Group Chat Created!",
            status: "success",
            duration: 5000,
            isClosable: true,
            position: "bottom",
          });
      }catch(err){
         toast({
            title: "Failed to Create the Chat!",
            description: err.response.data,
            status: "error",
            duration: 5000,
            isClosable: true,
            position: "bottom",
          });
      }
   }

   const handleDelete=(u)=>{
      setSelectedUsers(preVal=>{
         return preVal.filter(user=>user._id!==u._id);
      })
   }

   const handleGroup=(userToAdd)=>{
      if(selectedUsers.includes(userToAdd)){
         toast({
            title: "User already added",
            status: "warning",
            duration: 5000,
            isClosable: true,
            position: "top",
          });
          return;
      }
      setSelectedUsers([...selectedUsers,userToAdd]);
   }

   return (
      <>
         <span onClick={onOpen}>{children}</span>

         <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
               <ModalHeader
                  fontSize="35px"
                  fontFamily="Work sans"
                  display="flex"
                  justifyContent="center"
               >
                  Create your group chat:
               </ModalHeader>
               <ModalCloseButton />
               <ModalBody display="flex" flexDir="column" alignItems="center">
                  <FormControl>
                     <Input
                        placeholder="Chat name"
                        mb={3}
                        onChange={(e)=>setGroupChatName(e.target.value)}
                     />
                  </FormControl>
                  <FormControl>
                     <Input
                        placeholder="Add member names"
                        mb={3}
                        onChange={(e)=>handleSearch(e.target.value)}
                     />
                  </FormControl>
                  {
                     selectedUsers.map(u=>(
                        <UserBadgeItem
                           key={u._id}
                           user={u}
                           handleFunction={()=>handleDelete(u)}
                        />
                     ))
                  }
                  {loading?
                     (<div>loading</div>):
                     (searchResult?.slice(0,4).map(user=>(
                        <UserListItem
                           key={user._id}
                           user={user}
                           handleFunction={()=>handleGroup(user)}
                        />
                     )))
                  }
               </ModalBody>

               <ModalFooter>
                  <Button colorScheme='blue' onClick={handleSubmit}>
                     Create chat
                  </Button>
               </ModalFooter>
            </ModalContent>
         </Modal>
      </>
   )
}

export default GroupChatModal;