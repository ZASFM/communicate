const Message = require('../modles/messageModal');
const asyncHandler = require('express-async-handler');
const createError = require('../middlewares/createError');
const User = require('../modles/userModal');
const Chat = require('../modles/chatModal');

const sendMessage = asyncHandler(async (req, res, next) => {
   const {chatId,content,isMedia}=req.body;
   try {
     if(!chatId||!content){
      next(createError(401,'Missing parameters'));
     }
   
     var newMessage={
      sender:req.user._id,
      content:content,
      chat:chatId,
      isMedia
     }

      var message=new Message(newMessage);
      await message.save();

      message=await message.populate('sender','name pic');
      message=await message.populate('chat');
      message=await User.populate(message,{
         path:'chat.users',
         select:'name pic email'
      })
      await Chat.findByIdAndUpdate(chatId,{latestMessage:message},{new:true});

      res.status(200).json(message);
   } catch (err) {
      next(createError(401,'Could not post message'));
   }
})

const allMessages = asyncHandler(async (req, res, next) => {
   try {
      const messages=await Message.find({chat:req.params.chatId}).populate(
         "sender",
         "name email pic"
      ).populate("chat");
      res.status(200).json(messages);
   } catch (err) {
      next(createError(401,'Could no fetch messaged'));
   }
})

module.exports = {
   sendMessage,
   allMessages
}