const express = require('express');
const router = express();
const bcrypt = require("bcryptjs")
const bp = require("body-parser");
const validator = require('validator');
const jwt=require("jsonwebtoken");
router.use(bp.json());
router.use(bp.urlencoded({ extended: true }));
require("./database.js");
const { Register} = require("./Collections.js")

router.post("/registerData", async (req, res) => {
    const { username, email, password, confirmpass } = req.body;
    if (username !== "" && email !== "" && password !== "" && confirmpass !== "") {

        try {
            const hashedpassword=bcrypt.hashSync(password,10)
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
                 let token=await finduser.generateAuthToken();
                 bcrypt.compare(password,finduser.hashedpassword, function(err, result) {
                    
                    if (result) {
                        return res.status(201).json({ message: "Success" });
                    }
                    else{
                        return res.status(422).json({ error: "passwordincorrect" });
                    }
                    });
                }


        } catch (error) {
            return res.send("error")

        }
    
    }

    else {
        return res.status(422).json("");
    }
})
module.exports = router;
