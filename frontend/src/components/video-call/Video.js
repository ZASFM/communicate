import { Box, Grid, GridItem } from "@chakra-ui/react"
import { AgoraVideoPlayer } from 'agora-rtc-react';
import { useState, useEffect } from "react";

const Video = ({ tracks, users }) => {
   const [gridSpacing, setGridSpacing] = useState(12);

   useEffect(() => {
      setGridSpacing(Math.max(Math.floor(12 / (users.length + 1)), 4));
   }, [users, tracks]);

   return (
      <Grid style={{ height: "100%" }} gap={4} templateRows={1} templateColumns={2}>
         <GridItem>
            <AgoraVideoPlayer
               videoTrack={tracks[1]}
               style={{ height: "100%", width: "100%" }}
            />
         </GridItem>
         {users.length > 0 &&
            users.map((user) => {
               if (user.videoTrack) {
                  return (
                     <GridItem>
                        <AgoraVideoPlayer
                           videoTrack={user.videoTrack}
                           key={user.uid}
                           style={{ height: "100%", width: "100%" }}
                        />
                     </GridItem>
                  );
               } else return null;
            })}
      </Grid>
   )
}

export default Video