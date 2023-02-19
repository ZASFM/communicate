export const deleteAudio = (audioKey, setRecordings) => {
   setRecordings((preState) => preState.filter(record => record.key !== audioKey));
}