const mongoose=require("mongoose");
const jwt=require("jsonwebtoken")
require('dotenv').config();

const RegisterSchema=new mongoose.Schema({
    username:{
        type:String,
        required:true,
        trim:true,
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
    pic:{
        type:String
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
const FriendListSchema=new mongoose.Schema({
    userId:{
        type:String,
        unique:true
    },
    Friends:{
        type:Array
    }
})

const NotificationRecieveSchema=new mongoose.Schema({
    userId:{
        type:String,
        unique:true
    },
    Notifications:{
        type:Array
    }
})


const NotificationSentSchema=new mongoose.Schema({
    userId:{
        type:String,
        unique:true
    },
    Notifications:{
        type:Array
    }
})

const ChatSchema=new mongoose.Schema({
    userId:{
        type:String,
        unique:true
    },
    friendId:{
        type:String,
        unique:true
    },
    chats:{
        type:Array
    }
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
const FriendList=mongoose.model("FriendList",FriendListSchema);
const NotificationRecieve=mongoose.model("NotificationRecieve",NotificationRecieveSchema);
const NotificationSent=mongoose.model("NotificationSent",NotificationSentSchema);
const Chats=mongoose.model("Chats",ChatSchema);

module.exports={
    Register,FriendList,NotificationRecieve,NotificationSent,Chats
};