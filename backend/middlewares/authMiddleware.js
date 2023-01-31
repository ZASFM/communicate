const jwt = require('jsonwebtoken');
const User = require('../modles/userModal');
const asyncHandler = require('express-async-handler');
const createError = require('../middlewares/createError');

const protect = asyncHandler(async (req, res, next) => {
   try {
      if (
         req.headers.authorization &&
         req.headers.authorization.startsWith('Bearer ')
      ) {
         const token = req.headers.authorization.split(' ')[1];
         //console.log(token);
         const decoded = jwt.verify(token, process.env.JWT_SECRET);
         req.user = await User.findById(decoded.id).select('-password');
         //console.log('after await at authmodle');
         next();
      } else {
         next(createError(401, 'Not token present'));
      }
   }
   catch (err) {
      console.log(err);
      next(createError(401, 'Unauthenticated'));
   }
})

module.exports = { protect };