require('dotenv').config({ path: '../.env' })
const express = require('express')
const GroupModel = require('../models/groups.js');
const verification = require('./authenticate.js');
const UserModel = require('../models/users.js');

const groupRouter = express.Router()

groupRouter.get("/groups/fetchGroups/:userID", verification, async (req, res) =>{
    let ObjectId = require('mongodb').ObjectId; 
    const user = req.params.userID;
    let userObj = new ObjectId(user.toString())
    const userDB = await UserModel.findOne({_id: userObj});
    res.json(userDB.groups)
})

// groupRouter.post("/groups/createGroup", verification, async (req, res) =>{
//     const user = req.body.userID;
//     const userDB = UserModel.findOne(user);
//     console.log(userDB)
//     if(userDB.groups.joined){

//     }
// })

module.exports = groupRouter