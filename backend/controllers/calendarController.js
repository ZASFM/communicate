const asyncHandler=require('express-async-handler');
const Calendar=require('../modles/calendarModal');
const createError=require('../middlewares/createError');

const postEvent=asyncHandler(async(req,res,next)=>{
   const {title,start,end,chat_id,users}=req.body;
   try{
      let newEvent=new Calendar({
         title,
         chat_id,
         users,
         start,
         end
      });
      await newEvent.save();
      newEvent=await newEvent.populate('chat_id');
      res.status(200).json(newEvent);
   }catch(err){
      next(createError(400,'Could not post event'))
   }
})

const getEvents=asyncHandler(async(req,res,next)=>{
   try{
      let events=await Calendar.find({chat_id:req.params.id}).populate('chat_id');
      res.status(200).json(events);
   }catch(err){
      next(createError(400,'Could not fetch events'));
   }
})

const updateEvent=asyncHandler(async(req,res,next)=>{
   const {start,end}=req.body;
   try{ 
      let event=await Calendar.findByIdAndUpdate(
         req.params.id,{$set:{start,end}},{new:true}
      ).populate('chat_id');
      res.status(200).json(event);
   }catch(err){
      next(createError(400,'Could not update event'));
   }
})

module.exports={
   postEvent,
   getEvents,
   updateEvent
}