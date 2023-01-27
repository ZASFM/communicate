const express=require('express');
const router=express.Router();
const {protect}=require('../middlewares/authMiddleware');
const {accessChat,fetchChat,createGroupChat,removeFromGroup,renameGroup,addToGroup}=require('../controllers/chatControllers');

router.route('/').post(protect,accessChat);
router.route('/').get(protect,fetchChat);
router.route('/group').post(protect,createGroupChat);
router.route('/rename').put(protect,renameGroup);
router.route('/groupremove').put(protect,removeFromGroup);
router.route('/groupadd').put(protect,addToGroup);

module.exports=router;