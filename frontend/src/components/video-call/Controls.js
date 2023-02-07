import { Grid, Button, GridItem } from "@chakra-ui/react"
import { useClient } from "../config/settings"
import { useState } from "react"

const Controls = ({ tracks, setInCall, setStart }) => {
   const client = useClient();
   const [trackState, setTrackState] = useState({
      video: true,
      audio: true
   })

   const mute = async (type) => {
      if (type === "audio") {
         await tracks[0].setEnabled(!trackState.audio);
         setTrackState((ps) => {
            return { ...ps, audio: !ps.audio };
         });
      } else if (type === "video") {
         await tracks[1].setEnabled(!trackState.video);
         setTrackState((ps) => {
            return { ...ps, video: !ps.video };
         });
      }
   };

   const leaveChannel = async () => {
      await client.leave();
      client.removeAllListeners();
      tracks[0].close();
      tracks[1].close();
      setStart(false);
      setInCall(false);
   };
   return (
      <Grid
         gap={2}
         templateRows={1}
         templateColumns='repeat(3,1fr)'
      >
         <GridItem>
            <Button color={trackState.audio ? 'pink.200' : 'yellow.200'} onClick={() => mute('audio')}>
               {trackState.audio ? 'Mute' : 'UnMute'}
            </Button>
         </GridItem>
         <GridItem>
            <Button color={trackState.video ? 'pink.400' : 'yellow.200'} onClick={() => mute('video')}>
               {trackState.video ? 'Off camera' : 'On camera'}
            </Button>
         </GridItem>
         <GridItem>
            <Button onClick={() => leaveChannel()} color="pink.400">
               Leave
            </Button>
         </GridItem>
      </Grid>
   )
}

export default Controls