require('dotenv').config({ path: '../.env' })
const express = require('express')
const GroupModel = require('../models/groups.js');
const verification = require('./authenticate.js');
const UserModel = require('../models/users.js');
const CollectionsModel = require('../models/collections.js');

const groupRouter = express.Router()

// Get Routes --------------------------------------------------

groupRouter.get("/groups/fetchGroups/:userID", verification, async (req, res) =>{
    let ObjectId = require('mongodb').ObjectId; 
    const user = req.params.userID;
    let userObj = new ObjectId(user.toString())
    const userDB = await UserModel.findOne({_id: userObj});
    let groups = [];
    if(userDB.groups.joined.length > 0){
        try{
            groups = userDB.groups.joined.map(async (group) => {
                let data = await GroupModel.findOne({_id: group})
                // Remove group if it no longer exists
                if(data === null){
                    userDB.groups.joined = userDB.groups.joined.filter((uGroup) => uGroup !== group)
                    await userDB.save()
                    return
                }

                let userPerm = "Member"
                if(data.groupAdmin.find((item) => item === user))
                    userPerm = "Admin"
                return {groupName: data.groupName, groupDescription: data.groupDescription, 
                    collections: data.collections, _id: data._id, permissions: userPerm};
            })
        }catch(error){
            res.json({error: error, message: "Couldnt fetch groups"})
        }
    }
    const allGroups = await Promise.all(groups)
    const filteredNull = allGroups.filter((group) => group !== undefined)
    res.json({invites: userDB.groups.invites, joined: filteredNull})
})

// Create Routes --------------------------------------------------

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
                collections: creation.collections, _id: creation._id, permissions: "Admin"})
        }
        catch(error){
            res.send({status: error, message:"A username and password is required"})
        }
    }
    else
        res.send("Couldnt perform action")
})

groupRouter.post("/groups/:groupID/createCollection", verification, async (req, res) =>{
    const groupID = req.params.groupID;
    const user = req.body.userID;
    const groupDB = await GroupModel.findOne({_id: groupID});
    if((groupDB && groupDB.groupMembers.find(member => member === user)) || (groupDB && groupDB.groupAdmin.find(admin => admin === user))){
        const newCollection = new CollectionsModel({
            collectionTitle: req.body.title ,
            collectionDescription: req.body.desc ,
            collectionStatus: "Incomplete",
            tasks: []
        });
        try{
            groupDB.collections.push(newCollection)
            groupDB.save()
            res.send(groupDB.collections)
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

// Update Routes --------------------------------------------------

groupRouter.post("/groups/:groupID/updateCollection", verification, async (req, res) =>{
    const groupID = req.params.groupID;
    const collectionUpdate = req.body.collectionID;
    try{
        const update = await GroupModel.findOneAndUpdate({"_id": groupID, "collections._id": collectionUpdate}, 
        {$set: { "collections.$.collectionTitle": `${req.body.newColTitle}`, "collections.$.collectionDescription": `${req.body.newColDesc}`}})
        res.json(update.collections)
    }catch(error){
        res.json({error: error, message: "Couldnt update information"})
    }
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
                    collections: groupDB.collections, _id: groupDB._id, permissions: "Member", invites: updatedInvites})
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

// Delete Routes --------------------------------------------------

groupRouter.delete('/groups/:groupID/deleteGroup/:userID', verification, async (req, res) => {
    const group = req.params.groupID;
    const user = req.params.userID;
    const userDB = await UserModel.findOne({_id: user});
    const groupDB = await GroupModel.findOne({_id: group});
    if(groupDB && groupDB.groupAdmin.find(admin => admin === user)){
        try{
            await GroupModel.deleteOne({_id: group})
            const updatedGroups = userDB.groups.joined.filter((group) => group !== groupID)
            await groupDB.save()
            res.json(updatedGroups)
        }catch(error){
            res.json({error: error, message: "Couldnt delete group"})
        }
    }
    else
        res.send("Not enough permissions")
})

groupRouter.delete('/groups/:groupID/leaveGroup/:userID', verification, async (req, res) => {
    const group = req.params.groupID;
    const user = req.params.userID;
    const userDB = await UserModel.findOne({_id: user});
    const groupDB = await GroupModel.findOne({_id: group});
    if(groupDB && groupDB.groupMembers.find(member => member === user) && !groupDB.groupAdmin.find(admin => admin === user)){
        try{
            const delMember = await GroupModel.findOneAndUpdate({"_id": group, "groupMembers": user}, 
                {$pull: {groupMembers: user}})
            const filteredMembers = delMember.groupMembers.filter((member) => member !== user)
            await UserModel.findOneAndUpdate({_id: user, "groups.joined": group},
                {$pull: {"groups.joined": group}})
            res.json(filteredMembers)
        }catch(error){
            res.json({error: error, message: "Couldnt delete group"})
        }
    }
    else
        res.send("Not enough permissions")
})

groupRouter.delete('/groups/:groupID/deleteCollection/:collectionID', verification, async (req, res) => {
    const group = req.params.groupID;
    const collectionID = req.params.collectionID;
    try{
        const delCollection = await GroupModel.findOneAndUpdate({"_id": group, "collections._id": collectionID}, 
        {$pull: {collections: {_id: collectionID}}})
        const filteredCollection = delCollection.collections.filter((collection) => collection._id != collectionID)
        res.json(filteredCollection)
    }catch(error){
        res.json({error: error, message: "Couldnt delete collection"})
    }
})

module.exports = groupRouter