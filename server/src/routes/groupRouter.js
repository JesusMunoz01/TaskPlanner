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
    let groups = [];
    if(userDB.groups.joined.length > 0){
        groups = userDB.groups.joined.map(async (group) => {
            let data = await GroupModel.findOne({_id: group})
            return {groupName: data.groupName, groupDescription: data.groupDescription, collections: data.collectios};
        })
    }
    res.json({invites: userDB.groups.invites, joined: await Promise.all(groups)})
})

groupRouter.post("/groups/createGroup", verification, async (req, res) =>{
    const user = req.body.userID;
    const userDB = await UserModel.findOne({_id: user});
    if(userDB){
        const newGroup = new GroupModel({
            groupName: req.body.title,
            groupDescription: req.body.desc,
            groupAdmin: [`${user}`],
            groupMembers: [],
            collections: [],
        });

        try{
            const creation = await newGroup.save();
            userDB.groups.joined.push(creation._id.toString())
            await userDB.save()
            res.json({message: "Group successfully created"})
        }
        catch(error){
            res.send({status: error, message:"A username and password is required"})
        }
    }
    else
        res.send("Couldnt perform action")
})

module.exports = groupRouter