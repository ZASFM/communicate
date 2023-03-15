//returning the chat user name that is not me
export const getSender = (loggedUser, users) => {
   return users[0]._id === loggedUser._id ? users[1].name : users[0].name
}

//I want to see that the user that has emitted and online status is one of the users is my chat, if so show it in green
export const checkStatus=(onlineUsers,users,loggedUser)=>{
   const notMe=users.filter(user=>user._id!==loggedUser._id);
   if(onlineUsers.includes(notMe[0]._id)){
      return true
   }else{
      return false;
   }
}

//Returning the full details of the use that im chatting with
export const getSenderFull = (loggedUser, users) => {
   return users[0]._id === loggedUser._id ? users[1] : users[0]
}

//
export const isSameSender = (messages, m, i, userId) => {
   return (
      i < messages.length - 1 &&
      (messages[i + 1].sender._id !== m.sender._id ||
         messages[i + 1].sender._id === undefined) &&
      messages[i].sender._id !== userId
   );
};

//checking that the message with index is the last message sent, and displaying the users avatar next to it
export const isLastMessage = (messages, i, userId) => {
   return (
      //the message im sending is the last element in my messages array
      i === messages.length - 1 &&
      //checking that im not the sender of the last message
      messages[messages.length - 1].sender._id !== userId &&
      messages[messages.length - 1].sender._id
   );
};

//checking which messages are sent by me, and which is sent by my chat user, and locating my sent messages at the right, and my users messages at the left
export const isSameSenderMargin = (messages, m, i, userId) => {
   //this is applies for my users messages
   if (
      i < messages.length - 1 &&
      //my message "m" exists is messages array
      messages[i + 1].sender._id === m.sender._id &&
      //checking that im not the sender of the messages "m"
      messages[i].sender._id !== userId
   )
      return 33;
      //this case applies for my messages
   else if (
      (i < messages.length - 1 &&
         messages[i + 1].sender._id !== m.sender._id &&
         messages[i].sender._id !== userId) ||
      (i === messages.length - 1 && messages[i].sender._id !== userId)
   )
      return 0;
   else return "auto";
};

//checking that the message "m" has the same sender as the current previous message in messages array
export const isSameUser = (messages, m, i) => {
   return i > 0 && messages[i - 1].sender._id === m.sender._id;
};