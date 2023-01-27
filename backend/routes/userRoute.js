const express=require('express');
const router=express.Router();
const {login,signup,allUsers}=require('../controllers/userController');
const {protect}=require('../middlewares/authMiddleware');

router.route('/login').post(login).get(protect,allUsers);
router.route('/signup').post(signup);
module.exports=router; 