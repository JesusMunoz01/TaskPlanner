require('dotenv').config({ path: '../.env' })
const express = require('express')
const GroupModel = require('../models/groups.js');
const verification = require('./authenticate.js');
const UserModel = require('../models/users.js');

const groupRouter = express.Router()

groupRouter.get("/groups/fetchGroups", verification, async (req, res) =>{

})

groupRouter.post("/groups/createGroup", verification, async (req, res) =>{
    const user = req.body.userID;
    const userDB = UserModel.findOne(user);
    console.log(userDB)
    if(userDB.groups.joined){

    }
})

module.exports = groupRouter