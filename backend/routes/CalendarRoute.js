const express=require('express');
const router=express.Router();
const {postEvent,getEvents,updateEvent}=require('../controllers/calendarController');
const {protect}=require('../middlewares/authMiddleware');

router.route('/').post(protect,postEvent);
router.route('/get/:id').get(protect,getEvents);
router.route('/update/:id').put(protect,updateEvent);

module.exports=router;