import { Skeleton, Stack } from "@chakra-ui/react";

const ChatLoading=()=>{
   return (
      <div>
         <Stack>
            <Skeleton height="46px"/>
            <Skeleton height="46px"/>
            <Skeleton height="46px"/>
            <Skeleton height="46px"/>
            <Skeleton height="46px"/>
            <Skeleton height="46px"/>
            <Skeleton height="46px"/>
            <Skeleton height="46px"/>
            <Skeleton height="46px"/>
            <Skeleton height="46px"/>
         </Stack>
      </div>
   )
}

export default ChatLoading;