import { Box, Button, Tooltip, Text, Menu, MenuButton, MenuList, MenuItem, MenuDivider } from "@chakra-ui/react";
import { useState } from "react";
import { BellIcon, ChevronDownIcon } from '@chakra-ui/icons';
import { Avatar } from "@chakra-ui/react";
import { ChatState } from "../../contexts/ChatContext";
import ProfileModal from "./profileModal";
import { useNavigate } from "react-router-dom";

const SideDrawer = () => {
   const [search, setSearch] = useState('');
   const [serachResults, setSearchResults] = useState({});
   const [loading, seLoading] = useState({});
   const [loadingChat, setLoadingChat] = useState({});
   const navigate=useNavigate();

   const { user } = ChatState();

   const logOutHandler=()=>{
      localStorage.removeItem('userinfo');
      navigate('/');
   }

   return (
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
            <Button variant="ghost">
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
                  <BellIcon fontSize="2xl" m={1} />
               </MenuButton>
               {/*<MenuList/> */}
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
   )
}

export default SideDrawer;