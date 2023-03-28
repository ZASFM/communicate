require('dotenv').config();
const express = require('express');
const connectDB = require('../backend/DB/connectDB');
const mongoose = require('mongoose');
const userRouter = require('./routes/userRoute');
const chatRouter = require('./routes/chatRouter');
const messageRouter = require('./routes/messageRoute');
const calendarRouter=require('./routes/CalendarRoute');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 8000;

app.use(express.json());
app.use(cors());
mongoose.set('strictQuery', true);
//Authentication routes handler
app.use('/api/v1/user', userRouter);
//Chat routes handler
app.use('/api/v1/chat', chatRouter);
//Message route handler
app.use('/api/v1/message', messageRouter);
//Calendar and events router
app.use('/api/v1/calendar',calendarRouter);
//Error handler
app.use((err, req, res, next) => {
   console.log(err);
   const statusCode = err.statusCode || 500;
   const msg = err.msg || 'Something went wrong';
   res.status(statusCode).json({ success: false, msg });
})

const start = async () => {
   try {
      await connectDB(process.env.MONGO_URI);
   }
   catch (err) {
      console.log(err);
      process.exit();
   }
}

start();

const server = app.listen(PORT, () => {
   console.log(`App listening on port ${PORT}`);
})

const io = require('socket.io')(server, {
   pingTimeout: 600000,
   cors: {
      origin: 'http://localhost:3000'
   }
})

io.on("connection", (socket) => {
   //console.log("Connected to socket.io");

   //On connecting to the server broadcast make me online for others:
   socket.on('online',(id)=>{
      socket.broadcast.emit('online',id);
      //console.log('ONLINE '+id);
   })

   //Socket successfully connected
   socket.on("setup", () => {
      socket.emit("connected");
   });

   //creating a personal room for the chat:
   socket.on("join chat", (room) => {
      socket.join(room);
   });

   //on typing in the frontend, send typing to the FE, so a typing... message shows when you start typing:
   socket.on("typing", (room) => socket.in(room).emit("typing"));
   //On stop typing, send 'stop_typing' to the FE, so the typing... message disappears
   socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));

   //sending messages + handling notifications:
   socket.on("new message", (newMessageReceived) => {
      var chat = newMessageReceived.data.chat;

      if (!chat.users) return;

      chat.users.forEach((user) => {
         //Don´t update my own messages array, but the others:
         if (user._id === newMessageReceived.data.sender._id) return;

         //Send the message back to add it to the messages array:
         socket.in(newMessageReceived.room).emit("message received", {newMessageReceived:newMessageReceived.data,chat});
      });
   });
});