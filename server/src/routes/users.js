require('dotenv').config({ path: '../.env' })
const express = require('express')
const bcrypt = require('bcrypt')
const UserModel = require('../models/users');
var jwt = require('jsonwebtoken');

const userRouter = express.Router()

userRouter.post("/addUser", async (req, res) =>{

    const newUsername = req.body.newUsername;
    const newPassword = req.body.newPassword;
    const userCheck = await UserModel.findOne({username: newUsername})
    console.log(userCheck)

    if(userCheck === newUsername){
        return res.json({message: "Username is taken"})
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10)

    const newUser = new UserModel({
        username: newUsername,
        password: hashedPassword
    });

    try{
        await newUser.save();
        res.json({message: "Account successfully created"})
    }
    catch(error){
        res.send({status: error, error:"A username and password is required"})
    }
})

userRouter.post("/userLogin", async (req, res) =>{
    const username = req.body.username;
    const password = req.body.password;
    const userCheck = await UserModel.findOne({username: username})

    if(!userCheck){
        return res.json({message: "User does not exist"})
    }

    console.log(userCheck.password)
    const validatePassword = await bcrypt.compare(password, userCheck.password)
    console.log(validatePassword)

    if(validatePassword === false){
        return res.json({message: "Incorrect Username or Password"})
    }else{
        const token = jwt.sign({id: userCheck._id}, process.env.SECRET)
        res.json({token, userId: userCheck._id})
    }
})

module.exports = userRouter