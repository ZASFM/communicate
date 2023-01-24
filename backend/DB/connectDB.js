const mongoose=require('mongoose');

const connectDB=(uri)=>{
   return mongoose.connect(uri,{
      useNewUrlParser:true
   });
}

module.exports=connectDB;