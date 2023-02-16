require('dotenv').config();
const express = require('express');
const connectDB = require('../backend/DB/connectDB');
const mongoose = require('mongoose');
const userRouter = require('./routes/userRoute');
const chatRouter = require('./routes/chatRouter');
const messageRouter = require('./routes/messageRoute');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 8000;

app.use(express.json());
app.use(cors());
mongoose.set('strictQuery', true);
app.use('/api/v1/user', userRouter);
app.use('/api/v1/chat', chatRouter);
app.use('/api/v1/message', messageRouter);
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

   //creating the personal session for the user:
   socket.on("setup", () => {
      socket.emit("connected");
   });

   //creating a personal room for the chat:
   socket.on("join chat", (room) => {
      socket.join(room);
      //console.log("User Joined Room: " + room);
   });

   //handling "typing..." status on typing
   socket.on("typing", (room) => socket.in(room).emit("typing"));
   socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));

   //sending messages:
   socket.on("new message", (newMessageReceived) => {
      var chat = newMessageReceived.data.chat;

      if (!chat.users) return;

      chat.users.forEach((user) => {
         //Dont show me my own messages, two times:
         if (user._id === newMessageReceived.data.sender._id) return;

         //Send the message back to add it to the messages array:
         socket.in(newMessageReceived.room).emit("message received", newMessageReceived.data);
      });
   });
});