const express=require('express');
const app=express();
const registerRouter=require('./src/router.js')
const port=process.env.PORT||5000;
const path=require("path")
require("./src/router.js")
app.use(registerRouter)


app.use(express.static(path.join(__dirname, 'client', 'build')));
app.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client', 'build', 'index.html'));
})

app.listen(port,(res,req)=>{
    console.log("I am running on port "+port)
})