const express = require('express');
const router = express.Router();
const { login, signup, allUsers, addNotification, removeNotification, getNotifications } = require('../controllers/userController');
const { protect } = require('../middlewares/authMiddleware');

router.route('/login').post(login).get(protect, allUsers);
router.route('/signup').post(signup);
router.route('/notifications').post(addNotification).put(removeNotification);
router.route('/notifications/:id').get(getNotifications);
module.exports = router; 