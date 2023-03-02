const express=require("express");
const app=express();

app.get("/",(req,res)=>{
    res.send("Hi It is Server Side.")
})

app.listen(3000,()=>{
    console.log("Server is runnig");
})