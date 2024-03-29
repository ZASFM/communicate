const asyncHandler = require('express-async-handler');
const Chat = require('../modles/chatModal');
const createError = require('../middlewares/createError');
const User = require('../modles/userModal');


// @desc    Create a chat if is does not exists, and if it exists return he already existing chat (no group chats)
// @route   POST /api/v1/user/chat
// @access  Requires token
const accessChat = asyncHandler(async (req, res, next) => {
   const { userId } = req.body;
   try {
      if (!userId) {
         return next(createError(400, 'No user'));
      }
      var isChat = await Chat.find({
         isGroupChat: false,
         // I was obligatory the chat to have both my user id, and the id of the other user I have a chat with
         $and: [
            { users: { $elemMatch: { $eq: req.user._id } } },
            { users: { $elemMatch: { $eq: userId } } },
         ]
      }).populate('users', '-password').populate('latestMessage');

      isChat = await User.populate(isChat, {
         path: "latestMessage.sender",
         select: 'name pic email'
      })

      //If chat exists return chat, else create it
      if (isChat.length > 0) {
         res.send(isChat[0]);
      } else {
         var chatData = {
            chatName: "sender",
            isGroupChat: false,
            users: [req.user._id, userId]
         }
         try {
            const createdChat = new Chat(chatData);
            await createdChat.save();
            const fullChat = await Chat.findOne({ _id: createdChat._id }).populate(
               'users',
               '-password'
            )
            res.status(200).send(fullChat);
         }
         catch (err) {
            next(createError(400, 'Could not create chat'));
         }
      }
   }
   catch (err) {
      next(createError(400, 'Could not access chat'))
   }
})

// @desc   Fetch all my chats
// @route   GET /api/v1/user/chat
// @access  Requires token
const fetchChat = asyncHandler(async (req, res, next) => {
   try {
      //I want all those chats to have my id in the users array
      Chat.find({ users: { $elemMatch: { $eq: req.user._id } } })
         .populate('users', '-password')
         .populate('groupAdmin', '-password')
         .populate('latestMessage')
         .sort({ updatedAt: -1 })
         .then(async (results) => {
            results = await User.populate(results, {
               path: "latestMessage.sender",
               select: 'name pic email'
            })
            res.status(200).send(results);
         })
   }
   catch (err) {
      next(createError(400, 'Could not get chats'))
   }
})

// @desc    Create a group chat
// @route   POST /api/v1/chat/group
// @access  Requires token
const createGroupChat = asyncHandler(async (req, res, next) => {
   if (!req.body.users || !req.body.name) {
      return res.status(400).json({ success: false, msg: 'All fields must be filled' });
   }

   var users = JSON.parse(req.body.users);
   if (users.length < 2) {
      return res.status(400).json({ success: false, msg: 'Must have al least 2 users' });
   }
   //adding myself a a user
   users.push(req.user);

   try {
      const groupChat = new Chat({
         chatName: req.body.name,
         users: users,
         isGroupChat: true,
         groupAdmin: req.user
      })
      await groupChat.save();

      //populating the fileds of the chat:
      const fullGroupChat = await Chat.findOne({ _id: groupChat._id })
         .populate('users', '-password')
         .populate('groupAdmin', '-password')

      res.status(200).send(fullGroupChat);
   }
   catch (err) {
      next(createError(400, 'Could not create group chat'));
   }
})

// @desc    Rename the title of the group chat
// @route   PUT /api/v1/user/rename
// @access  Requires token + only admin
const renameGroup = asyncHandler(async (req, res, next) => {
   const { chatId, chatName } = req.body;
   try {
      const chat = await Chat.findByIdAndUpdate(chatId, { chatName }, { new: true })
         .populate('users', '-password')
         .populate('groupAdmin', '-password');
      res.status(200).send(chat);
   }
   catch (err) {
      next(createError(400, 'Could not rename chat'));
   }
})

// @desc    Remove a member form a group chat
// @route   PUT /api/v1/user/groupremove
// @access  Requires token + only admin
const removeFromGroup = asyncHandler(async (req, res, next) => {
   const { chatId, userId } = req.body;
   try {
      const removed = await Chat.findByIdAndUpdate(chatId, {
         $pull: { users: userId }
      }, { new: true })
         .populate('users', '-password')
         .populate('groupAdmin', '-password');
      res.status(200).send(removed);
   }
   catch (err) {
      next(createError(400, 'Could not add member'))
   }
})

// @desc    Add a member to a group chat
// @route   PUT /api/v1/user/groupadd
// @access  Requires token + only admin
const addToGroup = asyncHandler(async (req, res, next) => {
   const { chatId, userId } = req.body;
   try {
      const added = await Chat.findByIdAndUpdate(chatId, {
         $push: { users: userId }
      }, { new: true })
         .populate('users', '-password')
         .populate('groupAdmin', '-password');
      res.status(200).send(added);
   }
   catch (err) {
      next(createError(400, 'Could not add member'))
   }
})

module.exports = {
   accessChat,
   fetchChat,
   createGroupChat,
   removeFromGroup,
   renameGroup,
   addToGroup
}