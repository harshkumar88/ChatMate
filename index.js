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

io.on("connection",(socket)=>{
  socket.on("Refresh",(id)=>{
    console.log("refresh,",id)
    io.emit("ID",id);
})

})
