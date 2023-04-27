const express=require('express');
const app=express();
const registerRouter=require('./src/router.js')
const port=process.env.PORT||5000;
const path=require("path")
const httpProxy = require('http-proxy');
const {Server} =require("socket.io")
const proxy = httpProxy.createProxyServer();
require("./src/router.js")
app.use(registerRouter)
const cors=require("cors");
app.use(cors());


app.use('/socket.io', (req, res) => {
  // Set the 'Access-Control-Allow-Origin' header to allow requests from the client domain
  res.setHeader('Access-Control-Allow-Origin', 'https://chat-mate-alpha.vercel.app');
  proxy.web(req, res, {
    target: 'https://chatmate-backend.onrender.com',
    changeOrigin: true
  });
});

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', 'https://chat-mate-alpha.vercel.app');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

app.use(express.static(path.join(__dirname, 'client', 'build')));
app.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client', 'build', 'index.html'));
})


app.post('/getPort',(req,res)=>{
    return res.json({port:port});
})
const server=app.listen(port,(res,req)=>{
    console.log("I am running on port "+port)
})

const io=require("socket.io")(server)

io.on("connection",(socket)=>{
  console.log("user connected "+socket.id);
  socket.on("AddRoom",()=>{
    socket.join("Chat");
  })
  socket.on("message",(id)=>{
       console.log("user with id"+socket.id+ "send request to "+id);
       socket.to("Chat").emit("NotificationSent",id)
  })  
  socket.on("disconnect",()=>{
    console.log("user disconnected")
  })
})









