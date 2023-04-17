const express = require('express');
const router = express();
const multer = require("multer");
const bcrypt = require("bcryptjs")
const bp = require("body-parser");
const path=require("path")
const validator = require('validator');
const port=process.env.PORT||5000;
const jwt = require("jsonwebtoken");
router.use(bp.json());
router.use(bp.urlencoded({ extended: true }));
require("./database.js");
const { Register, FriendList, NotificationRecieve,NotificationSent } = require("./Collections.js")
const cookieParser = require('cookie-parser');
const cors=require("cors");
router.use(cookieParser());
router.use(cors());
router.use("/image", express.static("image"));

router.post("/",(req,res)=>{
    // console.log("cookies"+req.cookies.jwt)
    return res.json({cookies:req.cookies.jwt})
})

router.post("/getID",(req,res)=>{

    return res.json({cookies:req.cookies.jwt})
})

router.post("/registerData", async (req, res) => {
    const { username, email, password, confirmpass,pic} = req.body;
    if (username !== "" && email !== "" && password !== "" && confirmpass !== "") {

        try {
            const hashedpassword = bcrypt.hashSync(password, 10)
            if (!validator.isEmail(email)) {
                return res.status(422).json({ error: "emailrejected"});
            }
            if (!validator.isStrongPassword(password)) {
                return res.status(422).json({ error: "passwordrejected" });
            }

            const userdata = await Register.find({})
            const finduser = userdata.find((user) => {
                return user.email === email
            })

            if (finduser) {
                return res.status(422).json({ error: "UserExist" });
            }

            const register = new Register({
                username, email, hashedpassword,pic
            })
            await register.save();
            console.log(register)
            return res.status(201).json({ message: 'Sucess' })
        }
        catch (e) {
            res.send(e);
        }
    }
    else {
        return res.status(422).json("");
    }
})

router.post("/LoginData", async (req, res) => {
    const { username, email, password } = req.body;


    if (username !== "" && email !== "" && password !== "") {
        try {


            const userdata = await Register.find({})
            const finduser = userdata.find((user) => {
                return user.email === email
            })

            

            if (finduser === undefined) {
                return res.status(422).json({ error: 'UserNotFound' })
            }

            else {
                const isMatch=await bcrypt.compare(password, finduser.hashedpassword)
                    if (isMatch) {
                        let token = await finduser.generateAuthToken();

                        res.cookie("jwt", {token,email}, {
                            expires: new Date(Date.now() + 50000000000000),
                            httpOnly: true
                        });
        
                        

                        return res.status(201).json({ message: "Success" });
                    }
                    else {
                        return res.status(422).json({ error: "notAuthorize" });
                    }

            }


        } catch (error) {
            return res.send("error")

        }

    }

    else {
        return res.status(422).json("");
    }
})

router.post("/verifyEmail",async(req,res)=>{
    try{
    const {email}=req.body;
    const userdata = await Register.find({});

    const findUser=userdata.find((ele)=>{
        return ele.email===email;
    })

    if (!findUser) {
        return res.json({ message: 'UserNotFound' })
    }
    else{
        return res.status(201).json({message:"User Found"})
    }
    

}
catch(e){
    console.log("error")
}
})
router.post("/changepassword",async(req,res)=>{
    
        const{password,confirmpassword,email}=req.body
        console.log(password+" "+confirmpassword+" "+ email)
        if ( password !== "" && confirmpassword !== "") {

            try {
                const hashedpassword = bcrypt.hashSync(password, 10)
                
                if (!validator.isStrongPassword(password)) {
                    return res.status(422).json({ error: "passwordrejected" });
                }
                const userdata=await Register.findOne({email:email});
                const data=await userdata.updateOne({
                    hashedpassword:hashedpassword
                  })
                // const finduser =await Register.findOne({email:email})
                
                 
                return res.status(201).json({message:"Success"})
            }
            catch (e) {
                res.send(e);
            }
    
    } 
})

router.post("/getAllUsers",async(req,res)=>{

    try{
        const {email}=req.body;
        const users=await Register.find({});
        console.log(users)
        const FList=await FriendList.findOne({userId:email});
        const MyList=await NotificationSent.findOne({userId:email});
        let list=[-1];
        if(MyList)
          list=MyList.Notifications;
     
        let FriendArr=[-1];
        if(FList)
          FriendArr=FList.Friends;


          
        const allUsers=users.filter((ele)=>{
            return ele.email!=email && list.indexOf(ele.email)=="-1" && FriendArr.indexOf(ele.email)=="-1"
           
        })
        // console.log("ji"+allUsers)
        return res.status(201).json({users:allUsers})
    }     
    catch(e){
        return res.send("error");
    }
   
})

router.post("/SendNotification",async(req,res)=>{

    try{
        const {userId,FriendId}=req.body;
        //Recive Notifications
        const Notifi=await NotificationRecieve.findOne({userId:FriendId});
       
         let arr=[];
      
        if(Notifi){
            arr=Notifi.Notifications;
            const deleteUser=await NotificationRecieve.findOneAndDelete({userId:FriendId});
        }
        if(arr.indexOf(userId)==-1)
        arr.push(userId);
        const newNotificationRecieve=new NotificationRecieve({
             userId:FriendId,
             Notifications:arr
        })
        const notificationsSave=await newNotificationRecieve.save();

        //Sent Notifications
        const Notifi2=await NotificationSent.findOne({userId:userId});
       
        arr=[];
     
       if(Notifi2){
           arr=Notifi2.Notifications;
           const deleteUser=await NotificationSent.findOneAndDelete({userId:userId});
       }
       if(arr.indexOf(FriendId)==-1)
       arr.push(FriendId);
       const newNotificationSent=new NotificationSent({
            userId:userId,
            Notifications:arr
       })
       const notificationsSave2=await newNotificationSent.save();
       console.log(notificationsSave);
       console.log(notificationsSave2)
      return res.status(201).json({msg:"Notification Sent"})

    }     
    catch(e){
        return res.send("error");
    }
   
})


module.exports = router;
