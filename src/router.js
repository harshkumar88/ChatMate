const express = require('express');
const router = express();
const bcrypt = require("bcryptjs")
const bp = require("body-parser");
const validator = require('validator');
const jwt = require("jsonwebtoken");
router.use(bp.json());
router.use(bp.urlencoded({ extended: true }));
require("./database.js");
const { Register, FriendList } = require("./Collections.js")
const cookieParser = require('cookie-parser');
const cors=require("cors");
router.use(cookieParser());
router.use(cors());

router.post("/",(req,res)=>{
    // console.log("cookies"+req.cookies.jwt)
    return res.json({cookies:req.cookies.jwt})
})

router.post("/getID",(req,res)=>{

    return res.json({cookies:req.cookies.jwt})
})

router.post("/registerData", async (req, res) => {
    const { username, email, password, confirmpass } = req.body;
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
                username, email, hashedpassword
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
        
        const FList=await FriendList.find({userId:email});
        const FriendArr=FList.Friends;
        const allUsers=users.filter((ele)=>{
            if(FriendArr!=undefined)
                  return ele.email!=email && FriendArr.indexof(ele.email)==-1;

            return ele.email!=email
        })
        // console.log(allUsers)
        return res.status(201).json({users:allUsers})
    }     
    catch(e){
        return res.send("error");
    }
   
})
module.exports = router;
