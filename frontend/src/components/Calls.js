import { useState } from "react"
import VideoCall from "./video-call/VideoCall";
import { Button, VStack, Box } from "@chakra-ui/react";
import TrackStatus from "./video-call/TracksStatus";

const Calls = () => {
   const [inCall, setInCall] = useState(false);
   return (
      <div style={{ height: '100%', width: "100%" }}>
         {inCall ? (
            <VideoCall setInCall={setInCall} />
         ) : (
            <VStack
               divider={<div borderColor="blackAlpha.200" />}
               spacing={4}
               align='stretch'
               padding={"25px"}
               style={{marginTop:"30vh"}}
            >
               <Box h='100px' marginBottom={'20px'}>
                  <TrackStatus />
               </Box>
               <Box h='40px' display={"flex"} justifyContent="center">
                  <Button colorScheme='teal' variant='solid' onClick={() => setInCall(true)}>
                     Join
                  </Button>
               </Box>
            </VStack>
         )}
      </div>
   )
}

export default Calls