const express = require('express');
const { protect } = require('../middlewares/authMiddleware');
const router = express.Router();
const { sendMessage, allMessages } = require('../controllers/messageController');

//Post message:
router.route('/').post(protect, sendMessage);
//Get a certain chat messages:
router.route('/:chatId').get(protect, allMessages);

module.exports = router;