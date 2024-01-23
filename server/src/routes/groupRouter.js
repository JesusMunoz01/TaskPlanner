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
            let userPerm = "Member"
            if(data.groupAdmin.find((item) => item === user))
                userPerm = "Admin"
            return {groupName: data.groupName, groupDescription: data.groupDescription, 
                collections: data.collections, id: data._id, permissions: userPerm};
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
            res.json({groupName: creation.groupName, groupDescription: creation.groupDescription, 
                collections: creation.collections, id: creation._id, permissions: "Admin"})
        }
        catch(error){
            res.send({status: error, message:"A username and password is required"})
        }
    }
    else
        res.send("Couldnt perform action")
})

groupRouter.post("/groups/:groupID/invite", verification, async (req, res) =>{
    const groupID = req.params.groupID;
    const user = req.body.userID;
    const invitee = req.body.invUsername;
    const groupDB = await GroupModel.findOne({_id: groupID});
    if(groupDB && groupDB.groupAdmin.find(admin => admin === user)){
        try{
            const inviteeDB = await UserModel.findOne({username: invitee})
            if(inviteeDB._id == user)
                throw "Unable to invite yourself"
            if(inviteeDB === null)
                throw "User not found"
            if(inviteeDB.groups.invites.find(invite => invite === groupID))
                throw "Already invited this user"

            inviteeDB.groups.invites.push(groupID)
            await inviteeDB.save()
            res.send({status: `Succesfully invited ${invitee}`})
        }
        catch(error){
            res.send({status: error, message:"Unable to perform action"})
        }
    }
    else
        res.send("Not enough permissions")
})

groupRouter.post("/groups/:groupID/invite/action", verification, async (req, res) =>{
    const groupID = req.params.groupID;
    const user = req.body.userID;
    const action = req.body.action;
    const groupDB = await GroupModel.findOne({_id: groupID});
    if(groupDB){
        try{
            const inviteeDB = await UserModel.findOne({_id: user})
            if(inviteeDB.groups.joined.find(group => group === groupID))
                throw "Already joined group"
            if(action === "accept"){
                groupDB.groupMembers.push(user);
                await groupDB.save();
                inviteeDB.groups.joined.push(groupID);
                const updatedInvites = inviteeDB.groups.invites.filter((invite) => invite !== groupID);
                inviteeDB.groups.invites = updatedInvites;
                await inviteeDB.save();
                res.send({groupName: groupDB.groupName, groupDescription: groupDB.groupDescription, 
                    collections: groupDB.collections, id: groupDB._id, permissions: "Member", invites: updatedInvites})
            }
            else{
                const updatedInvites = inviteeDB.groups.invites.filter((invite) => invite !== groupID)
                inviteeDB.groups.invites = updatedInvites;
                await inviteeDB.save();
                res.send({message: "Successfully denied invite", invites: updatedInvites})
            }
        }
        catch(error){
            res.send({status: error, message:"Unable to perform action"})
        }
    }
    else
        res.send({message: "Group no longer exists"})
})

module.exports = groupRouter