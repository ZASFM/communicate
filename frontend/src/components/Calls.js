import { useState } from "react"
import VideoCall from "./video-call/VideoCall";
import { Button } from "@chakra-ui/react";

const Calls=()=>{
   const [inCall,setInCall]=useState(false);
   return (
      <div style={{height:'100%'}}>
         {inCall?(
            <VideoCall setInCall={setInCall}/>
         ):(
            <Button colorScheme='teal' variant='solid' onClick={()=>setInCall(true)}>
            Join
          </Button>
         )}
      </div>
   )
}

export default Calls