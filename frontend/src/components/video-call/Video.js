import { Box, SimpleGrid } from "@chakra-ui/react"
import { AgoraVideoPlayer } from 'agora-rtc-react';
import { useState, useEffect } from "react";

const Video = ({ tracks, users }) => {
   const [gridSpacing, setGridSpacing] = useState(12);

   useEffect(() => {
      setGridSpacing(Math.max(Math.floor(12 / (users.length + 1)), 4));
   }, [users, tracks]);

   return (
      <SimpleGrid style={{ height: "100%" }} spacing="40px" columns={[gridSpacing, null, 2]}>
         <Box>
            <AgoraVideoPlayer
               videoTrack={tracks[1]}
               style={{ height: "100%", width: "100%" }}
            />
         </Box>
         {users.length > 0 &&
            users.map((user) => {
               if (user.videoTrack) {
                  return (
                     <Box>
                        <AgoraVideoPlayer
                           videoTrack={user.videoTrack}
                           key={user.uid}
                           style={{ height: "100%", width: "100%" }}
                        />
                     </Box>
                  );
               } else return null;
            })}
      </SimpleGrid>
   )
}

export default Video