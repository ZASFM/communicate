import {formatMinutes,formatSeconds} from '../../utils/format-time';
import {FaTimesCircle} from 'react-icons/fa'

const RecorderControls = ({ recorderState, handlers }) => {
   const { recordingMinutes, recordingSeconds, initRecording } = recorderState;
   const { startRecording, saveRecording, cancelRecording } = handlers;
   return (
      <div>
         <div className="controls-container">
            <div className="recorder-display">
               <div className="recording-time">
                  {initRecording && <div className="recording-indicator"></div>}
                  Your recording:<span> </span>
                  <span>{formatMinutes(recordingMinutes)}</span>
                  <span>:</span>
                  <span>{formatSeconds(recordingSeconds)}</span>
               </div>
               {initRecording && (
                  <div className="cancel-button-container">
                     <button className="cancel-button" title="Cancel recording" onClick={cancelRecording}>
                        <span>Cancel</span> <FaTimesCircle/>
                     </button>
                  </div>
               )}
            </div>
            <div className="start-button-container">
               {initRecording ? (
                  <button
                     className="start-button"
                     title="Save recording"
                     disabled={recordingSeconds === 0}
                     onClick={saveRecording}
                  >
                     Save audio
                  </button>
               ) : (
                  <button className="start-button" title="Start recording" onClick={startRecording}>
                     Start 
                  </button>
               )}
            </div>
         </div>
      </div>
   )
}

export default RecorderControls;