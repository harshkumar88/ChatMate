const express = require('express');
const router = express();
const bcrypt = require("bcryptjs")
const bp = require("body-parser");
const path=require("path")
const validator = require('validator');
const jwt = require("jsonwebtoken");
router.use(bp.json());
router.use(bp.urlencoded({ extended: true }));
require("./database.js");
const { Register, FriendList, NotificationRecieve,NotificationSent } = require("./Collections.js")
const cookieParser = require('cookie-parser');
const cors=require("cors");
router.use(cookieParser());
router.use(cors());

router.post("/",(req,res)=>{
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
        const FList=await FriendList.findOne({userId:email});
        const MyList=await NotificationSent.findOne({userId:email});
        const MyNoti=await NotificationRecieve.findOne({userId:email});
        let list=[-1];
        if(MyList)
          list=MyList.Notifications;
     
        let FriendArr=[-1];
        if(FList)
          FriendArr=FList.Friends;

        let NotiArr=[];
        if(MyNoti){
            NotiArr=MyNoti.Notifications
        }

        const allUsers=users.filter((ele)=>{
            return ele.email!=email && list.indexOf(ele.email)=="-1" && FriendArr.indexOf(ele.email)=="-1" && NotiArr.indexOf(ele.email)=="-1"
           
        })
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
       
      return res.status(201).json({msg:"Notification Sent"})

    }     
    catch(e){
        return res.send("error");
    }
})
router.post("/getAllNotifications",async(req,res)=>{

    try{
        const {email}=req.body;
        const MyList=await NotificationRecieve.findOne({userId:email});
        // console.log(MyList.Notifications)
        if(MyList)
           return res.status(201).json({users:MyList.Notifications})

        return res.status(201).json({users:[]})
    }     
    catch(e){
        return res.send("error");
    }
   
})
router.post("/Accepted",async(req,res)=>{

    try{
        const {userId,FriendId}=req.body;
        //Recive Notifications
        
        const Notifi=await NotificationRecieve.findOne({userId:userId});
       
        //  let arr=[];
         console.log(Notifi)
        const arr=Notifi.Notifications.filter((ele)=>{
            return ele!==FriendId
        })
        console.log(arr)
        const Notifi2=await NotificationSent.findOne({userId:FriendId});
        const arr2=Notifi2.Notifications.filter((ele)=>{
            return ele!==userId
        })
        // console.log(arr2)

        let UserFriend=[];
        let FriendFriend=[];
        const FriendsOfUser=await FriendList.findOne({userId:userId});
        if(FriendsOfUser){
           UserFriend=FriendsOfUser.Friends
           const User2=await FriendList.findOneAndDelete({userId:userId});
        }

        UserFriend.push(FriendId)
          
        const FriendsOfFriend=await FriendList.findOne({userId:FriendId});
        if(FriendsOfFriend){
          FriendFriend=FriendsOfFriend.Friends;
          const User1=await FriendList.findOneAndDelete({userId:FriendId});
        }
          FriendFriend.push(userId)
          
          const deleteUser1=await NotificationSent.findOneAndDelete({userId:FriendId});
          const deleteUser2=await NotificationRecieve.findOneAndDelete({userId:userId});

          const newNotificationSent=new NotificationSent({
            userId:FriendId,
            Notifications:arr2
       })
       const notificationsSave1=await newNotificationSent.save();


       const newNotificationRecieve=new NotificationRecieve({
        userId:userId,
        Notifications:arr
   })
   const notificationsSave2=await newNotificationRecieve.save();


   const newFriend=new FriendList({
    userId:userId,
    Friends:UserFriend
})
const newFriendSave1=await newFriend.save();


const newFriend1=new FriendList({
    userId:FriendId,
    Friends:FriendFriend
})
const newFriendSave2=await newFriend1.save();
       
    return res.status(201).json({msg:"Accepted"})

    }     
    catch(e){
        return res.send("error");
    }
   
})
router.post("/Rejected",async(req,res)=>{

    try{
        const {userId,FriendId}=req.body;
        //Recive Notifications
        
        const Notifi=await NotificationRecieve.findOne({userId:userId});
      
        const arr=Notifi.Notifications.filter((ele)=>{
            return ele!==FriendId
        })

        const Notifi2=await NotificationSent.findOne({userId:FriendId});
        const arr2=Notifi2.Notifications.filter((ele)=>{
            return ele!==userId
        })


        const deleteUser1=await NotificationSent.findOneAndDelete({userId:FriendId});
        const deleteUser2=await NotificationRecieve.findOneAndDelete({userId:userId});
        
        const newNotificationSent=new NotificationSent({
          userId:FriendId,
          Notifications:arr2
     })
     const notificationsSave1=await newNotificationSent.save();


     const newNotificationRecieve=new NotificationRecieve({
      userId:userId,
      Notifications:arr
 })
 const notificationsSave2=await newNotificationRecieve.save();

       
      return res.status(201).json({msg:"Rejected"})

    }     
    catch(e){
        return res.send("error");
    }
   
})


router.post("/CheckUser",async(req,res)=>{
    try{
        const users=await Register.find({});
        let userArr=[];
        for(let i of users){
            userArr.push(i.username);
        }

        return res.status(200).json({users:userArr});
    }
    catch(e){
        return res.status(400).send(e);
    }
})

router.post("/getFriends",async(req,res)=>{

    try{
        const {userId}=req.body;
      
        const FList=await FriendList.findOne({userId:userId});
        // console.log(FList)
       let Farr=[];
        if(FList){
            Farr=FList.Friends;
        }
        
      
        if(Farr.length>0){
            const users=await Register.find({});
            const userInfo=users.filter((user)=>{
                return Farr.indexOf(user.email)!="-1";
            })
            return res.status(201).json({Friends:userInfo})
        }

        return res.status(201).json({Friends:[]})
    }     
    catch(e){
        return res.send("error");
    }
   
})

module.exports = router;
