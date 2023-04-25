const express=require('express');
const app=express();
const registerRouter=require('./src/router.js')
const port=process.env.PORT||5000;
const path=require("path")
const {Server} =require("socket.io")
require("./src/router.js")
app.use(registerRouter)
const cors=require("cors");
app.use(cors());

app.use(express.static(path.join(__dirname, 'client', 'build')));
app.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client', 'build', 'index.html'));
})

const server=app.listen(port,(res,req)=>{
    console.log("I am running on port "+port)
})

const io=require("socket.io")(server,{
  cors:{
    origin:"http://localhost:3000"
  }
})

const connections = new Set();

const roomName = "room";
io.on('connection', function (socket) {
 socket.join("room")
 const f=()=>{
  const numberOfSocketsInRoom = io.sockets.adapter.rooms.get(roomName)?.size;
  console.log(`There are ${numberOfSocketsInRoom} sockets in room ${roomName}.`);
 }
f();

 const socketsInRoom = io.sockets.adapter.rooms.get(roomName);

if (socketsInRoom) {
  // Loop through each socket ID in the room
  socketsInRoom.forEach((socketId) => {
    // Use the socket ID to get the socket object
    const socket = io.sockets.sockets.get(socketId);
    console.log("Socket ID:", socketId);
  });
}

  socket.on('message', function (message) {
    console.log('Received message from a client:', message);

    // Broadcast the message to all clients
    io.to('room').emit('broadcast', message);
  });

  socket.on('disconnect', function () {
    connections.delete(socket);
    socket.leave("room");
    console.log("leave")
    f();
  });
});










