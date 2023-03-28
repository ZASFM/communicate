const mongoose=require('mongoose');

const CalendarSchema=mongoose.Schema({
   title:{
      type:String,
      required:true
   },
   chat_id:{
      type:mongoose.Schema.Types.ObjectId,
      ref:'Chat'
   },
   users:[
      {
         type:mongoose.Schema.Types.ObjectId,
         ref:'User'
      }
   ],
   start:{
      type:Date,
      required:true
   },
   end:{
      type:Date,
      required:true
   }
},{
   timestamps:true
})

const Calendar=mongoose.model('Calendar',CalendarSchema);
module.exports=Calendar;