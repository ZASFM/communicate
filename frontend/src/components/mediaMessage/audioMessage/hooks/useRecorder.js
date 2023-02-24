import {startRecording,saveRecording} from '../handlers/recorder-controls';
import { useState, useEffect } from 'react';

const initialState = {
   recordingMinutes: 0,
   recordingSeconds: 0,
   initRecording: false,
   mediaStream: null,
   mediaRecorder: null,
   audio: null,
};

const useRecorder=()=>{
   const [recorderState,setRecorderState]=useState(initialState);

   useEffect(()=>{
      const MAX_RECORDER_TIME = 5;
      let recordingInterval = null;
      if(recorderState.initRecording){
         recordingInterval=setInterval(()=>{
            setRecorderState(preState=>{
               if(
                  recorderState.recordingMinutes===MAX_RECORDER_TIME &&
                  recorderState.recordingSeconds===0
               ){
                  clearInterval(recordingInterval);
                  return preState
               }

               if(recorderState.recordingSeconds>=0 && recorderState.recordingSeconds<59){
                  return {
                     ...preState,
                     recordingSeconds:preState.recordingSeconds+1
                  }
               }

               if(recorderState.recordingSeconds===59){
                  return {
                     preState,
                     recordingMinutes:preState.recordingMinutes+1,
                     recordingSeconds:0
                  }
               }
            })
         },1000);
      }else{
         clearInterval(recordingInterval)
      }
      return ()=>clearInterval(recordingInterval);
   });

   useEffect(()=>{
      if(recorderState.mediaStream){
         setRecorderState(preState=>{
            return {
               ...preState,
               mediaRecorder: new MediaRecorder(preState.mediaStream),
            }
         })
      }
   },[recorderState.mediaStream]);

   useEffect(()=>{
      const recorder=recorderState.mediaRecorder;
      let chunks=[];
      console.log(chunks);

      if(recorder && recorder.state==='inactive'){
         recorder.start();

         recorder.ondataavailable=(e)=>{
            chunks.push(e.data);
            console.log(chunks);
         }

         recorder.onstop=()=>{
            const blob= new Blob(chunks,{type: "audio/ogg"});
            chunks=[];
            setRecorderState(preState=>{
               if(preState.mediaRecorder){
                  return {
                     ...preState,
                     audio:window.URL.createObjectURL(blob)
                  }
               }else {
                  return initialState;
               }
            })
         }
      }
      return ()=>{
         if(recorder) recorder.stream.getAudioTracks().forEach(track=>track.stop());
      }
   },[recorderState.mediaRecorder]);

   return {
      recorderState,
      startRecording:()=>startRecording(setRecorderState),
      cancelRecording:()=>setRecorderState(initialState),
      saveRecording:()=>saveRecording(recorderState.mediaRecorder)
   }
}

export default useRecorder;