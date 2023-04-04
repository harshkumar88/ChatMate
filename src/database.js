const mongoose=require("mongoose");
require('dotenv').config();
const DB=process.env.SECRETKEY;
mongoose.set('strictQuery', true)
mongoose.connect(DB,{
    useNewUrlParser: true,
}).then(()=>{
    console.log("connection successfull");
}).catch(()=>{
    console.log("error no connection")
});
