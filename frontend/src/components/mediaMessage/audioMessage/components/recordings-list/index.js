import useRecordingsList from '../../hooks/use-recordings-list';
import { AiFillWarning } from 'react-icons/ai'
import axios from 'axios';
import { useToast } from '@chakra-ui/react';
import { ChatState } from '../../../../../contexts/ChatContext';

const RecordingsList = ({ audio }) => {
   const { recordings, deleteAudio } = useRecordingsList(audio);
   const { user, selectedChat } = ChatState();
   const toast=useToast();

   const sendAudio = async () => {
      try {
         const config = {
            headers: {
               Authorization: `Bearer ${user.token}`,
               'Content-Type': 'application/json'
            }
         };

         const { data } = await axios.post('http://localhost:5000/api/v1/message', {
            content: recordings[0].audio,
            chatId: selectedChat._id,
            isMedia: true
         }, config);
      } catch (err) {
         toast({
            title: "Error Occured!",
            description: "Failed to send the Message",
            status: "error",
            duration: 5000,
            isClosable: true,
            position: "bottom",
         });
      }
   }

   return (
      <div>
         <div className="recordings-container">
            {recordings.length > 0 ? (
               <>
                  <h1>Your recordings</h1>
                  <div className="recordings-list">
                     {recordings.map((record) => (
                        <div className="record" key={record.key}>
                           <audio controls src={record.audio} />
                           <div className="delete-button-container">
                              <button
                                 className="delete-button"
                                 title="Delete this audio"
                                 onClick={() => deleteAudio(record.key)}
                              >
                                 Delete audio
                              </button>
                           </div>
                        </div>
                     ))}
                     <button className='send-button' onClick={sendAudio}>
                        Send audio
                     </button>
                  </div>
               </>
            ) : (
               <div className="no-records">
                  <AiFillWarning size={50} />
                  <span>You don't have records to send</span>
               </div>
            )}
         </div>
      </div>
   )
}

export default RecordingsList;