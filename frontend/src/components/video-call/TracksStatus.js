import { Box } from "@chakra-ui/react";
import { HStack } from "@chakra-ui/react";
import { useMicrophoneAndCameraTracks } from "../config/settings";
import { BsFillMicFill, BsFillCameraVideoFill } from 'react-icons/bs'

const TrackStatus = () => {
   const { tracks } = useMicrophoneAndCameraTracks();
   console.log(tracks);
   return (
      <HStack
         spacing='24px'
         display={"flex"}
         justifyContent="center"
         alignItems="center"
         gap={'35px'}
      >
         <Box
            display={'flex'}
            flexDir="column"
            gap="10px"
         >
            <Box
               border="1px"
               borderColor="gray.200"
               bg="gray.200"
               padding="20px"
               rounded="lg"
               display="flex"
               justifyContent="center"
            >
               <BsFillMicFill />
            </Box>
            {(tracks && tracks[0]) ?
               <div style={{ color: "green" }}>
                  Connected
               </div> :
               <div>Connecting...</div>
            }
         </Box>
         <Box
            display={'flex'}
            flexDir="column"
            gap="10px"
         >
            <Box
               border="1px"
               borderColor="gray.200"
               bg="gray.200"
               padding="20px"
               rounded="lg"
               display="flex"
               justifyContent="center"
            >
               <BsFillCameraVideoFill />
            </Box>
            {(tracks && tracks[1]) ?
               <div style={{ color: "green" }} >
                  Connected
               </div> :
               <div>Connecting...</div>}
         </Box>
      </HStack>
   )
}

export default TrackStatus;