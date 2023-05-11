const express = require('express');
const router = express();
const bcrypt = require("bcryptjs")
const bp = require("body-parser");
const path = require("path")
const validator = require('validator');
const jwt = require("jsonwebtoken");
router.use(bp.json());
router.use(bp.urlencoded({ extended: true }));
require("./database.js");
const { Register, FriendList, NotificationRecieve, NotificationSent, Chats } = require("./Collections.js")
const cookieParser = require('cookie-parser');
const cors = require("cors");
router.use(cookieParser());
router.use(cors());

router.post("/", (req, res) => {
  
    return res.json({ cookies: req.cookies.jwt })
})

router.post("/getID", (req, res) => {
    return res.json({ cookies: req.cookies.jwt })
})
router.post('/logout',(req, res) => {
    res.clearCookie('jwt');
    return res.status(201).json({msg:"hello"});
  });
  

router.post("/registerData", async (req, res) => {
    const { username, email, password, confirmpass, pic } = req.body;
    if (username !== "" && email !== "" && password !== "" && confirmpass !== "") {

        try {
            const hashedpassword = bcrypt.hashSync(password, 10)
            if (!validator.isEmail(email)) {
                return res.status(422).json({ error: "emailrejected" });
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
                username, email, hashedpassword, pic
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
    const { email, password } = req.body;


    if (email !== "" && password !== "") {
        try {


            const userdata = await Register.find({})
            const finduser = userdata.find((user) => {
                return user.email === email
            })


            if (finduser === undefined) {
                return res.status(422).json({ error: 'UserNotFound' })
            }

            else {
                const isMatch = await bcrypt.compare(password, finduser.hashedpassword)
                if (isMatch) {
                    let token = await finduser.generateAuthToken();
                    const uniqueId = finduser.username;
                    res.cookie("jwt", { token, uniqueId }, {
                        expires: new Date(Date.now() + 60000000000),
                        secure:true,
                        sameSite:"strict",
                        path:"/"
                    });
                    

                    return res.status(201).json({ message: "Success", userId: uniqueId });
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

router.post("/verifyEmail", async (req, res) => {
    try {
        const { email } = req.body;
        const userdata = await Register.find({});

        const findUser = userdata.find((ele) => {
            return ele.email === email;
        })

        if (!findUser) {
            return res.json({ message: 'UserNotFound' })
        }
        else {
            return res.status(201).json({ message: "User Found" })
        }


    }
    catch (e) {
        console.log("error")
    }
})
router.post("/changepassword", async (req, res) => {

    const { password, confirmpassword, email } = req.body
    if (password !== "" && confirmpassword !== "") {

        try {
            const hashedpassword = bcrypt.hashSync(password, 10)

            if (!validator.isStrongPassword(password)) {
                return res.status(422).json({ error: "passwordrejected" });
            }
            const userdata = await Register.findOne({ email: email });
            const data = await userdata.updateOne({
                hashedpassword: hashedpassword
            })


            return res.status(201).json({ message: "Success" })
        }
        catch (e) {
            res.send(e);
        }

    }
})

router.post("/getAllUsers", async (req, res) => {

    try {
        const { uniqueId } = req.body;

        const users = await Register.find({});
        const FList = await FriendList.findOne({ userId: uniqueId });
        const MyList = await NotificationSent.findOne({ userId: uniqueId });
        const MyNoti = await NotificationRecieve.findOne({ userId: uniqueId });
        let list = [-1];
        if (MyList)
            list = MyList.Notifications;

        let FriendArr = [-1];
        if (FList)
            FriendArr = FList.Friends;

        let NotiArr = [];
        if (MyNoti) {
            NotiArr = MyNoti.Notifications
        }

        const allUsers = users.filter((ele) => {
            return ele.username != uniqueId && list.indexOf(ele.username) == "-1" && FriendArr.indexOf(ele.username) == "-1" && NotiArr.indexOf(ele.username) == "-1"

        })
        return res.status(201).json({ users: allUsers })
    }
    catch (e) {
        return res.send("error");
    }

})

router.post("/SendNotification", async (req, res) => {

    try {
        const { userId, FriendId } = req.body;
        //Recive Notifications
        const Notifi = await NotificationRecieve.findOne({ userId: FriendId });

        let arr = [];

        if (Notifi) {
            arr = Notifi.Notifications;
            const deleteUser = await NotificationRecieve.findOneAndDelete({ userId: FriendId });
        }
        if (arr.indexOf(userId) == -1)
            arr.push(userId);
        const newNotificationRecieve = new NotificationRecieve({
            userId: FriendId,
            Notifications: arr
        })
        const notificationsSave = await newNotificationRecieve.save();

        //Sent Notifications
        const Notifi2 = await NotificationSent.findOne({ userId: userId });

        arr = [];

        if (Notifi2) {
            arr = Notifi2.Notifications;
            const deleteUser = await NotificationSent.findOneAndDelete({ userId: userId });
        }
        if (arr.indexOf(FriendId) == -1)
            arr.push(FriendId);
        const newNotificationSent = new NotificationSent({
            userId: userId,
            Notifications: arr
        })
        const notificationsSave2 = await newNotificationSent.save();

        return res.status(201).json({ msg: "Notification Sent" })

    }
    catch (e) {
        return res.send("error");
    }
})
router.post("/getAllNotifications", async (req, res) => {

    try {
        const { uniqueId } = req.body;
        const MyList = await NotificationRecieve.findOne({ userId: uniqueId });
        if (MyList)
            return res.status(201).json({ users: MyList.Notifications })

        return res.status(201).json({ users: [] })
    }
    catch (e) {
        return res.send("error");
    }

})
router.post("/Accepted", async (req, res) => {

    try {
        const { userId, FriendId } = req.body;
        //Recive Notifications

        const Notifi = await NotificationRecieve.findOne({ userId: userId });

        const arr = Notifi.Notifications.filter((ele) => {
            return ele !== FriendId
        })
        const Notifi2 = await NotificationSent.findOne({ userId: FriendId });
        const arr2 = Notifi2.Notifications.filter((ele) => {
            return ele !== userId
        })
        let UserFriend = [];
        let FriendFriend = [];
        const FriendsOfUser = await FriendList.findOne({ userId: userId });
        if (FriendsOfUser) {
            UserFriend = FriendsOfUser.Friends
            const User2 = await FriendList.findOneAndDelete({ userId: userId });
        }

        UserFriend.push(FriendId)

        const FriendsOfFriend = await FriendList.findOne({ userId: FriendId });
        if (FriendsOfFriend) {
            FriendFriend = FriendsOfFriend.Friends;
            const User1 = await FriendList.findOneAndDelete({ userId: FriendId });
        }
        FriendFriend.push(userId)

        const deleteUser1 = await NotificationSent.findOneAndDelete({ userId: FriendId });
        const deleteUser2 = await NotificationRecieve.findOneAndDelete({ userId: userId });

        const newNotificationSent = new NotificationSent({
            userId: FriendId,
            Notifications: arr2
        })
        const notificationsSave1 = await newNotificationSent.save();


        const newNotificationRecieve = new NotificationRecieve({
            userId: userId,
            Notifications: arr
        })
        const notificationsSave2 = await newNotificationRecieve.save();


        const newFriend = new FriendList({
            userId: userId,
            Friends: UserFriend
        })
        const newFriendSave1 = await newFriend.save();


        const newFriend1 = new FriendList({
            userId: FriendId,
            Friends: FriendFriend
        })
        const newFriendSave2 = await newFriend1.save();

        return res.status(201).json({ msg: "Accepted" })

    }
    catch (e) {
        return res.send("error");
    }

})
router.post("/Rejected", async (req, res) => {

    try {
        const { userId, FriendId } = req.body;
        //Recive Notifications

        const Notifi = await NotificationRecieve.findOne({ userId: userId });

        const arr = Notifi.Notifications.filter((ele) => {
            return ele !== FriendId
        })

        const Notifi2 = await NotificationSent.findOne({ userId: FriendId });
        const arr2 = Notifi2.Notifications.filter((ele) => {
            return ele !== userId
        })


        const deleteUser1 = await NotificationSent.findOneAndDelete({ userId: FriendId });
        const deleteUser2 = await NotificationRecieve.findOneAndDelete({ userId: userId });

        const newNotificationSent = new NotificationSent({
            userId: FriendId,
            Notifications: arr2
        })
        const notificationsSave1 = await newNotificationSent.save();


        const newNotificationRecieve = new NotificationRecieve({
            userId: userId,
            Notifications: arr
        })
        const notificationsSave2 = await newNotificationRecieve.save();


        return res.status(201).json({ msg: "Rejected" })

    }
    catch (e) {
        return res.send("error");
    }

})

router.post("/CheckUser", async (req, res) => {
    try {
        const users = await Register.find({});
        let userArr = [];
        for (let i of users) {
            userArr.push(i.username);
        }

        return res.status(200).json({ users: userArr });
    }
    catch (e) {
        return res.status(400).send(e);
    }
})

router.post("/getFriends", async (req, res) => {

    try {
        const { userId } = req.body;

        const FList = await FriendList.findOne({ userId: userId });
        let Farr = [];
        if (FList) {
            Farr = FList.Friends;
        }


        if (Farr.length > 0) {
            const users = await Register.find({});
            const userInfo = users.filter((user) => {
                return Farr.indexOf(user.username) != "-1";
            })
            return res.status(201).json({ Friends: userInfo })
        }

        return res.status(201).json({ Friends: [] })
    }
    catch (e) {
        return res.send("error");
    }

})


router.post("/saveMsg", async (req, res) => {

    try {
        const { data, Info } = req.body;
        const userId = Info.uid;
        const FriendId = Info.Fid;
        
        // Find the chat document that matches userId and FriendId
           const chatData= await Chats.findOne({ userId: userId, friendId: FriendId });
           if(chatData){
                const chats=chatData.chats;
                if(chats.length>0 && chats[chats.length-1].date!=data.date){
                    chatData.chats.push(data);
                    const saveData=await chatData.save();
                    return res.status(200).json({msg:saveData})
                }
                else{
                    return res.status(200).json({msg:chatData})
                }
           }

           else {

            const newChatDoc = new Chats({ userId: userId, friendId: FriendId, chats: [data]});
            const saveData= await newChatDoc.save();
            return res.status(200).json({msg:saveData})
           }
    }
    catch (e) {
        console.log(e)
        return res.send("error");
    }

})

router.post("/getChat", async (req, res) => {

    try {
        const { sender, reciever } = req.body;

        const getChat = await Chats.findOne({ userId: sender, friendId: reciever });
        if (getChat)
            return res.status(201).json({ msg: getChat.chats });

        return res.status(201).json({ msg: [] });
    }
    catch (e) {
        return res.send("error");
    }

})
router.post("/deleteFriend",async(req,res)=>{
    try {
        const {userId,friend}=req.body
        console.log(userId+friend)
        let getuserFriend = await FriendList.findOne({ userId: userId});
        let userFriend=getuserFriend.Friends;
        let newuserFriend=userFriend.filter((ele)=>{
            return ele!==friend
        })
        // console.log(newuserFriend)
        // console.log(getuserFriend)
        let getFriendFriend=await FriendList.findOne({ userId: friend});
        let friendfriend=getFriendFriend.Friends;
        let newFriendFriend=friendfriend.filter((ele)=>{
            return ele!==userId
        })
        // console.log(newFriendFriend)
       const updatefriendsofuser=await FriendList.updateOne(
            { userId: userId },
            { $set: { Friends: newuserFriend } }
          )
          const updatefriendsooffriend=await FriendList.updateOne(
            { userId:friend},
            {
                $set: { Friends: newFriendFriend } 
            }
          )
        return res.status(401).json({msg:newuserFriend})
    } catch (error) {
        return res.status(401).json({msg:"x"})
    }
})


module.exports = router;
