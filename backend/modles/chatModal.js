const mongoose=require('mongoose');

const chatModal=mongoose.Schema({
   chatName:{
      type:String,
      trim:true
   },
   isGroupChat:{
      type:Boolean,
      default:false,
   },
   users:[
      {
         type:mongoose.Schema.Types.ObjectId,
         //Here I wll upload the users id, and this refers to the user modal
         ref:"User"
      }
   ],
   latestMessage:{
      type:mongoose.Schema.Types.ObjectId,
      ref:"Message"
   },
   groupAdmin:{
      type:mongoose.Schema.Types.ObjectId,
      ref:"User"
   }
},{
   timestamps:true
})

const Chat=mongoose.model('Chat',chatModal);
module.exports=Chat;