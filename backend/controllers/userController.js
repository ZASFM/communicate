const User = require('../modles/userModal');
const createError = require('../middlewares/createError');
const asyncHandler = require('express-async-handler');
const createToken = require('../middlewares/createToken');
const transporter=require('../middlewares/nodeMail');
const Chat=require('../modles/chatModal');


// @desc    Login with an account
// @route   POST /api/v1/user/login
// @access  Public
const login = asyncHandler(async (req, res, next) => {
   const { email, password } = req.body;
   try {
      if (!email || !password) {
         return next(createError(400, 'Both email and password are required'));
      }
      const user = await User.findOne({ email });
      if (!user) {
         return next(createError(400, 'Not such a user was found'));
      }
      const confirmPassword = user.matchPassword(password);
      if (!confirmPassword) {
         return next(createError(404, 'Password is incorrect'));
      }
      res.status(200).json({ success: true, user, token: createToken(user._id) });
   }
   catch (err) {
      next(createError(404, 'Could not login'));
   }
})

// @desc    Create and account
// @route   POST /api/v1/user/signup
// @access  Public
const signup = asyncHandler(async (req, res, next) => {
   const { name, email, password, pic } = req.body;
   try {
      if (!name || !email || !password) {
         return next(createError(404, 'Must provide name, email and password'));
      }

      const userExists = await User.findOne({ email });
      if (userExists) {
         return next(createError(400, 'User already exists'));
      }

      const user = new User({
         name,
         email,
         password,
         pic
      })
      await user.save();

      try{
         //Sending email upon registration
         await transporter.sendMail({
            from: '"Registration confirmation message" <shafi.bahrami.2015@gmail.com>', 
            to: user.email, 
            subject: "Registration successful✔", 
            html: `<h1>Email confirmation</h1><div>Dear ${user.name}, we welcome you to our website</div>`, 
         })
      }catch(err){
         console.log('Email verification unsuccessful');
      }

      res
         .status(200)
         .json({ success: true, user: { ...user._doc }, token: createToken(user._id) });
   }
   catch (err) {
      console.log(err);
      next(createError(404, 'Could not create user'));
   }
})

// @desc    Get all the users, apart from me, depending on a query search
// @route   GET /api/v1/user/login?query
// @access  Requires token
const allUsers = asyncHandler(async (req, res, next) => {
   const keyword = req.query.search ? {
      //I want to search for the users, that whether the email or the name have the search im querying for
      $or: [
         { name: { $regex: req.query.search, $options: 'i' } },
         { email: { $regex: req.query.search, $options: 'i' } }
      ]
   } : {}
   //Upon the list I don´t want to have as chat candidate myself
   const users = await User.find(keyword).find({ _id: { $ne: req.user._id } });
   res.status(200).send(users);
})

// @desc    add notification to notifications array
// @route   POST /api/v1/user/notifications
// @access  Requires token
const addNotification=asyncHandler(async(req,res,next)=>{
   const {userId,messageId}=req.body;
   try{
      let notification=await User.findByIdAndUpdate(userId,
         {$push:{notifications:messageId}},
         {new:true}
      )
      .populate('notifications')

      notification=await User.populate(notification,{
         path:'notifications.sender',
         select:'name email'
      });

      notification=await Chat.populate(notification,{
         path:'notifications.chat',
         select:'chatName users'
      });

      notification=await User.populate(notification,{
         path:'notifications.chat.users',
         select:'name email'
      });

      res.status(200).json(notification);
   }catch(err){
      console.log(err);
      next(createError(400,'Could not add notification'))
   }
})

// @desc    Delete notification from notifications array
// @route   PUT /api/v1/user/notifications
// @access  Requires token
const removeNotification=asyncHandler(async(req,res,next)=>{
   const {userId,messageId}=req.body;
   try{
      await User.findByIdAndUpdate(userId,{$pull:{notifications:messageId}});
      res.status(200).json({success:true})
   }catch(err){
      next(createError(400,'Could not delete notification'))
   }
})

// @desc    Get user´s notifications
// @route   GET /api/v1/user/notifications/:id
// @access  Requires token
const getNotifications=asyncHandler(async(req,res,next)=>{
   try{
      let notifications=await User.findById(req.params.id)
         .populate('notifications')
         
      notifications=await User.populate(notifications,{
         path:'notifications.sender',
         select:'name email'
      });

      notifications=await Chat.populate(notifications,{
         path:"notifications.chat",
      });

      notifications=await User.populate(notifications,{
         path:"notifications.chat.users",
         select:'-password'
      }); 

      await notifications.populate('notifications.chat.latestMessage');
      res.status(200).json(notifications);
   }catch(err){
      console.log(err);
      next(createError(400,'Could not fetch notifications'))
   }
})

module.exports = {
   login,
   signup,
   allUsers,
   addNotification,
   removeNotification,
   getNotifications
}