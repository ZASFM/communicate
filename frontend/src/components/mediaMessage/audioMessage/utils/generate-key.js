import {v4 as uuid} from 'uuid';

const generateKey=()=>{
   return uuid();
}

export default generateKey;