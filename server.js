const express=require('express');
const app=express();
const registerRouter=require('./src/router.js')
const port=process.env.PORT||5000;
require("./src/router.js")
app.use(registerRouter)
  
app.listen(port,(res,req)=>{
    console.log("I am running on port "+port)
})