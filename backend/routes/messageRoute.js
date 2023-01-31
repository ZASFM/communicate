const express = require('express');
const { protect } = require('../middlewares/authMiddleware');
const router = express.Router();
const { sendMessage, allMessages } = require('../controllers/messageController');

router.route('/').post(protect, sendMessage);
router.route('/:chatId').get(protect, allMessages);

module.exports = router;