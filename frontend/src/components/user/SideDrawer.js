import {
   Box,
   Button,
   Tooltip,
   Text,
   Menu,
   MenuButton,
   MenuList,
   MenuItem,
   MenuDivider,
   Drawer,
   DrawerOverlay,
   DrawerContent,
   DrawerHeader,
   DrawerBody,
   Input,
   useToast,
   Spinner
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { BellIcon, ChevronDownIcon } from '@chakra-ui/icons';
import { Avatar } from "@chakra-ui/react";
import { ChatState } from "../../contexts/ChatContext";
import ProfileModal from "./profileModal";
import { useNavigate } from "react-router-dom";
import { useDisclosure } from "@chakra-ui/hooks";
import axios from "axios";
import ChatLoading from "../ChatLoading";
import UserListItem from "../userAvatar/UserListItem";
import { getSender } from "../config/ChatLogic";
import { Effect } from 'react-notification-badge';
import NotificationBadge from "react-notification-badge";

const SideDrawer = ({fetchAgain,setFetchAgain}) => {
   const [search, setSearch] = useState('');
   const [searchResults, setSearchResults] = useState([]);
   const [loading, setLoading] = useState(false);
   const [loadingChat, setLoadingChat] = useState(false);
   const [notifications1, setNotifications1]=useState([]);
   const navigate = useNavigate();
   const toast = useToast();

   const { user, setSelectedChat, chats, setChats } = ChatState();
   const { isOpen, onOpen, onClose } = useDisclosure();

   const logOutHandler = () => {
      localStorage.removeItem('userinfo');
      navigate('/');
   }

   //handles function searching for users that have same email/name with my query
   const handleSearch = async () => {
      if (!search) {
         toast({
            title: "Please Enter something in search",
            status: "warning",
            duration: 5000,
            isClosable: true,
            position: "top-left",
         });
         return;
      }

      try {
         setLoading(true);
         const config = {
            headers: {
               Authorization: `Bearer ${user.token}`,
            }
         }

         //will return all the users that share the name/email of search that are not me:
         const { data } = await axios.get(`http://localhost:5000/api/v1/user/login?search=${search}`, config);
         console.log(data);
         setLoading(false);
         setSearchResults(data);
      }
      catch (error) {
         console.log(error);
         toast({
            title: "Error fetching the chat",
            description: error.message,
            status: "error",
            duration: 5000,
            isClosable: true,
            position: "bottom-left",
         });
      }
      setLoading(false);
   }

   const accessChat = async (userId) => {
      setLoadingChat(true);
      try {
         const config = {
            headers: {
               'Content-Type': 'application/json',
               Authorization: `Bearer ${user.token}`,
            }
         }

         //retrieving the existing chat with the user that has userId, or creating a new one if it does noes exists
         const { data } = await axios.post('http://localhost:5000/api/v1/chat', { userId }, config)
         if (!chats.find(item => item._id === data.id)) setChats([data, ...chats]);
         setSelectedChat(data);
         setLoadingChat(false);
         onClose();
      }
      catch (err) {
         setLoadingChat(false);
         toast({
            title: "Error fetching the chat",
            description: err.message,
            status: "error",
            duration: 5000,
            isClosable: true,
            position: "bottom-left",
         });
      }
   }

   useEffect(()=>{
      //fetching all my notifications
      const fetchNotifications=async()=>{
         const myId=JSON.parse(localStorage.getItem('userinfo')).user._id;
         try{ 
            const {data}=await axios.get(`http://localhost:5000/api/v1/user/notifications/${myId}`);
            setNotifications1(data.notifications);
         }catch(err){
            console.log(err);
         }
      }
      fetchNotifications();
      //this function will be triggered everytime i manually set my frontend to refetch queries back again, and on sending any notifications i will refetch again
   },[fetchAgain])
   
   //removing notification from db
   const removeNotifications=async(notificationId)=>{
      try{
         const config={
            headers:{
               Authorization:`Bearer ${user.token}`,
               'Content-Type':'application/json'
            }
         };
         const {data}=await axios.put('http://localhost:5000/api/v1/user/notifications',{
            userId:user.user._id,
            messageId:notificationId
         },config);
         if(data.status===200) setFetchAgain(fetching=>!fetching);
      }catch(err){
         console.log(err);
      }
   }

   return (
      <>
         <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            bg="white"
            w="100%"
            p="5px 10px 5px 10px"
            borderWidth="5px"
         >
            <Tooltip
               label="Search users to chat"
               hasArrow
               placement="bottom-end"
            >
               <Button variant="ghost" onClick={onOpen}>
                  <i className="fas fa-search"></i>
                  <Text display={{ base: "none", md: "flex" }} px="4">
                     Search User
                  </Text>
               </Button>
            </Tooltip>

            <Text fontSize="2xl" fontFamily="Work sans">
               Your chats
            </Text>
            <div>
               <Menu>
                  <MenuButton p={1}>
                     <NotificationBadge
                        count={notifications1.length}
                        effect={Effect.SCALE}
                     />
                     <BellIcon fontSize="2xl" m={1} />
                  </MenuButton>
                  <MenuList>
                     {!notifications1.length && 'No new messages'}
                     {notifications1!==[] && notifications1.map(n => (
                        <MenuItem
                           key={n._id}
                           onClick={() => {
                              //making my chat be the chat that im seeing
                              setSelectedChat(n.chat);
                              //removing chat from notifications array on db
                              removeNotifications(n._id);
                              //removing notification on frontend
                              setNotifications1(notifications1.filter(no => no !== n));
                           }}
                        >
                           {
                              `New message from ${n.sender.name}`
                           }
                        </MenuItem>
                     ))}
                  </MenuList>
               </Menu>
               <Menu>
                  <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
                     <Avatar size="sm" cursor="pointer" name={user.user.name} src={user.user.pic} />
                  </MenuButton>
                  <MenuList>
                     <ProfileModal user={user.user}>
                        <MenuItem>My profile</MenuItem>
                     </ProfileModal>
                     <MenuDivider />
                     <MenuItem onClick={logOutHandler}>Logout</MenuItem>
                  </MenuList>
               </Menu>
            </div>
         </Box>
         <Drawer
            placement="left"
            onClose={onClose}
            isOpen={isOpen}
         >
            <DrawerOverlay></DrawerOverlay>
            <DrawerContent>
               <DrawerHeader
                  borderBottomWidth="1px"
               >
                  Search users
               </DrawerHeader>
               <DrawerBody>
                  <Box display="flex" pb={2}>
                     <Input
                        placeholder="Search by name or email"
                        mr={2}
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                     />
                     <Button onClick={handleSearch}>Go</Button>
                  </Box>
                  {loading ?
                     (<ChatLoading />) :
                     (
                        searchResults !== [] && searchResults.map(user => (
                           <UserListItem
                              key={user._id}
                              user={user}
                              handleFunction={() => accessChat(user._id)}
                           />
                        ))
                     )
                  }
                  {loadingChat && <Spinner ml="auto" display="flex" />}
               </DrawerBody>
            </DrawerContent>
         </Drawer>
      </>
   )
}

export default SideDrawer;