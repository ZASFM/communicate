import {formatMinutes,formatSeconds} from '../../utils/format-time';

const RecorderControls = ({ recorderState, handlers }) => {
   const { recordingMinutes, recordingSeconds, initRecording } = recorderState;
   const { startRecording, saveRecording, cancelRecording } = handlers;
   return (
      <div>
         <div className="controls-container">
            <div className="recorder-display">
               <div className="recording-time">
                  {initRecording && <div className="recording-indicator"></div>}
                  <span>{formatMinutes(recordingMinutes)}</span>
                  <span>:</span>
                  <span>{formatSeconds(recordingSeconds)}</span>
               </div>
               {initRecording && (
                  <div className="cancel-button-container">
                     <button className="cancel-button" title="Cancel recording" onClick={cancelRecording}>
                        times
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
                     save
                  </button>
               ) : (
                  <button className="start-button" title="Start recording" onClick={startRecording}>
                     mic
                  </button>
               )}
            </div>
         </div>
      </div>
   )
}

export default RecorderControls;