require('dotenv').config();
const express=require('express');
const connectDB=require('../backend/DB/connectDB');
const mongoose=require('mongoose');

const app=express();
const PORT=process.env.PORT||8000;

app.use(express.json());
mongoose.set('strictQuery',true);
app.use((err,req,res,next)=>{
   const statusCode=err.statusCode||500;
   const msg=err.msg||'Something went wrong';
   res.status(statusCode).json({success:false,msg});
})

const start=async()=>{
   try{
      await connectDB(process.env.MONGO_URI);
      app.listen(PORT,()=>{
         console.log(`App listening on port ${PORT}`);
      })
   }
   catch(err){
      console.log(err);
   }
}


start();