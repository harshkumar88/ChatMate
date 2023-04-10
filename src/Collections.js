const mongoose=require("mongoose");
const jwt=require("jsonwebtoken")
require('dotenv').config();

const RegisterSchema=new mongoose.Schema({
    username:{
        type:String,
        required:true,
        trim:true,
        lowercase:true
    },email:{
        type:String,
        required:true,
        trim:true,
        unique:true,
        lowercase:true
        
    },
    hashedpassword:{
        type:String,
        required:true,
        trim:true,
        minlength:7,
    },
    tokens:[
        {
            token:{
                type:String,
                required:true,
            }
        }
    ]
})

//generating token 
RegisterSchema.methods.generateAuthToken= async function(){
    try {
    
        let token=jwt.sign({_id:this._id},process.env.TOKENKEY);
        this.tokens=this.tokens.concat({token:token});
        await this.save();
        return token;

    } catch (err) {
        console.log(err)
    }
}

const Register=mongoose.model("Register",RegisterSchema);
module.exports={
    Register
};