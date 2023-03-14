import { useState, useEffect } from "react";
import { deleteAudio } from '../handlers/recordings-list';
import generateKey from '../utils/generate-key';

const useRecordingsList = (audio) => {
   const [recordings, setRecordings] = useState([]);
 
   useEffect(() => {
      if (audio) {
         setRecordings(preState => {
            return [...preState, { key: generateKey(), audio }]
         })
      }
   }, [audio]);

   return {
      recordings,
      deleteAudio: (audioKey) => deleteAudio(audioKey, setRecordings)
   }
}

export default useRecordingsList;