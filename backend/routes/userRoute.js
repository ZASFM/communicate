const express = require('express');
const router = express.Router();
const { login, signup, allUsers, addNotification, removeNotification, getNotifications } = require('../controllers/userController');
const { protect } = require('../middlewares/authMiddleware');

//Login and get all the users depending on a query search:
router.route('/login').post(login).get(protect, allUsers);
//Signup
router.route('/signup').post(signup);
//Add and delete notification
router.route('/notifications').post(addNotification).put(removeNotification);
//Get all my notifications
router.route('/notifications/:id').get(getNotifications);
module.exports = router; 