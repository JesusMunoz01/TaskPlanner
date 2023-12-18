require('dotenv').config({ path: '../.env' })
const express = require('express')
const bcrypt = require('bcrypt')
const UserModel = require('../models/users');
var jwt = require('jsonwebtoken');

const userRouter = express.Router()

userRouter.post("/addUser", async (req, res) =>{

    const newUsername = req.body.newUsername;
    const newPassword = req.body.newPassword;
    const userCheck = await UserModel.findOne({username: newUsername })

    if(userCheck === newUsername){
        return res.json({message: "Username is taken"})
    }else{
        const hashedPassword = await bcrypt.hash(newPassword, 10)

        const newUser = new UserModel({
            username: newUsername ,
            password: hashedPassword ,
            tasks: null
        });

        try{
            await newUser.save();
            res.json({message: "Account successfully created"})
        }
        catch(error){
            res.send({status: error, message:"A username and password is required"})
        }
    }
})

userRouter.post("/userLogin", async (req, res) =>{
    const username = req.body.username;
    const password = req.body.password;
    const userCheck = await UserModel.findOne({username: username })

    if(!userCheck){
        return res.json({message: "User does not exist"})
    }else{

        const validatePassword = await bcrypt.compare(password, userCheck.password)
    
        if(validatePassword === false){
            return res.json({message: "Incorrect Username or Password"})
        }else{
            const token = jwt.sign({id: userCheck._id}, process.env.SECRET)
            res.json({token, userId: userCheck._id})
        }
    }
})

module.exports = userRouter