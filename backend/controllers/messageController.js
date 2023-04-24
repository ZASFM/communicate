const Message = require('../modles/messageModal');
const asyncHandler = require('express-async-handler');
const createError = require('../middlewares/createError');
const User = require('../modles/userModal');
const Chat = require('../modles/chatModal');
const {Buffer}=require('buffer');


// @desc    create a message document and update the chat it was sent to, as it´s latestMessage
// @route   POST /api/v1/message
// @access  Requires token
const sendMessage = asyncHandler(async (req, res, next) => {
   const {chatId,content,isMedia,buffer:b}=req.body;
   try {
     if(!chatId||!content){
      next(createError(401,'Missing parameters'));
     }

     var newMessage={
      sender:req.user._id,
      content,
      chat:chatId,
      isMedia,
      buffer:b?b:null
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
      console.log(err);
   }
})

// @desc    Get all the messages of a certain chat
// @route   GET /api/v1/user/message/:id
// @access  Requires token
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