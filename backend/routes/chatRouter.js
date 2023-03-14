const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/authMiddleware');
const { accessChat, fetchChat, createGroupChat, removeFromGroup, renameGroup, addToGroup } = require('../controllers/chatControllers');

//create a chat, or return the existing chat:
router.route('/').post(protect, accessChat);
//Fetch all the chats im involved:
router.route('/').get(protect, fetchChat);
//Create a group chat:
router.route('/group').post(protect, createGroupChat);
//Rename the title of the group chat:
router.route('/rename').put(protect, renameGroup);
//Remove a user from the group (only Admin):
router.route('/groupremove').put(protect, removeFromGroup);
//Add user to a chat (only Admin):
router.route('/groupadd').put(protect, addToGroup);

module.exports = router;