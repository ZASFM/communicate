import { ChatState } from "../contexts/ChatContext";
import SideDrawer from "../components/user/SideDrawer";
import { Box } from "@chakra-ui/react";
import MyChats from "../components/MyChats";
import ChatBox from "../components/ChatBox";
import { useState } from "react";

const ChatPage = () => {
  const { user } = ChatState();
  const [fetchAgain, setFetchAgain] = useState(false);

  return (
    <div style={{ width: "100%" }}>
      {user && 
         <SideDrawer
            fetchAgain={fetchAgain}
            setFetchAgain={setFetchAgain} 
         />
      }
      <Box
        display="flex"
        justifyContent="space-between"
        p="10px"
        w="100%"
        h="91.5vh"
      >
        {user &&
          <MyChats
            fetchAgain={fetchAgain}
          />
        }
        {user &&
          <ChatBox
            fetchAgain={fetchAgain}
            setFetchAgain={setFetchAgain}
          />
        }
      </Box>
    </div>
  );
}

export default ChatPage;
