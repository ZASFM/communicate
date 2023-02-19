export const startRecording = async (setRecorderState) => {
   try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      setRecorderState(preState => {
         return {
            ...preState,
            initRecording: true,
            mediaStream: stream
         }
      })
   } catch (err) {
      console.log(err);
   }
}

export const saveRecording = (recorder) => {
   if (recorder.state !== 'inactive') recorder.stop();
}