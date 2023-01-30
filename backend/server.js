require('dotenv').config();
const express=require('express');
const connectDB=require('../backend/DB/connectDB');
const mongoose=require('mongoose');
const userRouter=require('./routes/userRoute');
const chatRouter=require('./routes/chatRouter');
const cors=require('cors');

const app=express();
const PORT=process.env.PORT||8000;

app.use(express.json());
app.use(cors());
mongoose.set('strictQuery',true);
app.use('/api/v1/user',userRouter);
app.use('/api/v1/chat',chatRouter);
app.use((err,req,res,next)=>{
   console.log(err);
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
      process.exit();
   }
}


start();