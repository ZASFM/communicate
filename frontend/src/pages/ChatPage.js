import { ChatState } from "../contexts/ChatContext";
import SideDrawer from "../components/user/SideDrawer";
import { Box } from "@chakra-ui/react";
import MyChats from "../components/MyChats";
import ChatBox from "../components/ChatBox";

const ChatPage=()=>{
  const {user}=ChatState();

   return (
     <div style={{width:"100%"}}>
       {user && <SideDrawer/>}
       <Box
          display="flex"
          justifyContent="space-between"
          p="10px"
          w="100%"
          h="91.5vh"
       >
          {user && <MyChats/>}
          {user && <ChatBox/>}
       </Box>
     </div>
   );
 }
 
 export default ChatPage;
 