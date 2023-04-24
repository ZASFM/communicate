import { Avatar, Tooltip } from '@chakra-ui/react';
import ScrollableFeed from 'react-scrollable-feed';
import { ChatState } from '../contexts/ChatContext';
import { isLastMessage, isSameSender, isSameSenderMargin, isSameUser } from './config/ChatLogic';

const Chat = ({ messages }) => {
   const { user } = ChatState();

   const binaryToBlob = async (binary) => {
      const uint8Array = Uint8Array.from(binary);
      const blob = new Blob([uint8Array], { type: 'audio/wav' });
      const blobUrl = URL.createObjectURL(blob);
      console.log(blobUrl);
      return blobUrl;
   }

   return (
      <ScrollableFeed>
         {messages && messages.map((m, i) => (
            <div
               key={m._id}
               style={{ display: "flex" }}
            >
               {/*Checking if is the last message of the user*/}
               {(
                  isSameSender(messages, m, i, user.user._id) || isLastMessage(messages, i, user.user._id)
               ) && (
                     <Tooltip
                        hasArrow
                        label={m.sender.name}
                        placement="bottom-start"
                     >
                        <Avatar
                           mt="7px"
                           mr={1}
                           size="sm"
                           cursor="pointer"
                           name={m.sender.name}
                           src={m.sender.pic}
                        />
                     </Tooltip>
                  )}
               <span
                  style={{
                     display: "flex",
                     backgroundColor: `${m.sender._id === user.user._id ? "#BEE3F8" : "#B9F5D0"}`,
                     borderRadius: "20px",
                     padding: "5px 15px",
                     maxWidth: "75%",
                     marginLeft: isSameSenderMargin(messages, m, i, user.user._id),
                     marginTop: isSameUser(messages, m, i, user.user._id) ? 3 : 10
                  }}
               >
                  {
                     !m.isMedia ?
                        (<span>{m.content}</span>) :
                        (
                           <audio controls>
                              <source src={binaryToBlob(m.buffer)} type="audio/mpeg"/>
                           </audio>
                        )

                  }
               </span>
            </div>
         ))}
         <div id='only-audio'>

         </div>
      </ScrollableFeed>
   )
}

export default Chat;