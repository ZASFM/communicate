import Video from "./Video"
import Controls from "./Controls"
import { useState, useEffect } from "react"
import { useClient, config, useMicrophoneAndCameraTracks, channelName } from "../config/settings"
import { Grid, GridItem } from "@chakra-ui/react"

const VideoCall = ({ setInCall }) => {
   const [users, setUsers] = useState([]);
   const [start, setStart] = useState(false);
   const client = useClient();
   const { ready, tracks } = useMicrophoneAndCameraTracks();

   useEffect(() => {
      let init = async (name) => {
         client.on("user-published", async (user, mediaType) => {
            await client.subscribe(user, mediaType);
            if (mediaType === "video") {
               setUsers((prevUsers) => {
                  return [...prevUsers, user];
               });
            }
            if (mediaType === "audio") {
               user.audioTrack.play();
            }
         });

         client.on("user-unpublished", (user, mediaType) => {
            if (mediaType === "audio") {
               if (user.audioTrack) user.audioTrack.stop();
            }
            if (mediaType === "video") {
               setUsers((prevUsers) => {
                  return prevUsers.filter((User) => User.uid !== user.uid);
               });
            }
         });

         client.on("user-left", (user) => {
            setUsers((prevUsers) => {
               return prevUsers.filter((User) => User.uid !== user.uid);
            });
         });

         try {
            await client.join(config.appId, name, config.token, null);
         } catch (error) {
            console.log("error");
         }

         if (tracks) await client.publish([tracks[0], tracks[1]]);
         setStart(true);
      };

      if (ready && tracks) {
         try {
            init(channelName);
         } catch (error) {
            console.log(error);
         }
      }
   }, [channelName, client, ready, tracks]);

   return (
      <Grid
         h="100%"
         templateColumns={1}
         templateRows={2}
         gap={3}
      >
         <GridItem h="5%">
            {ready && tracks && (
               <Controls tracks={tracks} setStart={setStart} setInCall={setInCall} />
            )}
         </GridItem>
         <GridItem h="95%">
            {start && <Video tracks={tracks} users={users} />}
         </GridItem>
      </Grid>
   )
}

export default VideoCall