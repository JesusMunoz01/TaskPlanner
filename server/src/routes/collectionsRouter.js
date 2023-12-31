require('dotenv').config({ path: '../.env' });
const express = require('express');
const UserModel = require('../models/users');
const TaskModel = require('../models/tasks.js');
const CollectionsModel = require('../models/collections.js');
const verifyToken = require('../server.js');

const collectionRouter = express.Router();

// Get Routes --------------------------------------------------

collectionRouter.get("/fetchCollection", async (req, res) =>{
    const tasks = await CollectionsModel.find();
    res.json(tasks);
})

collectionRouter.get("/fetchCollection/:userID", async (req, res) =>{
    const userCheck = req.params.userID
    const tasks = await UserModel.findOne({_id: userCheck });
    res.json(tasks.collections);
})

collectionRouter.get("/fetchCollection/tasks/:userID", async (req, res) =>{
    const userCheck = req.params.userID
    const tasks = await UserModel.findOne({_id: userCheck });
    res.json(tasks.collections.tasks);
})

// Post Routes --------------------------------------------------

collectionRouter.post("/addCollection", async (req, res) =>{
    verifyToken;
    const user = req.body.userID;
    const userCheck = await UserModel.findOne({_id: user })
    
    const newCollection = new CollectionsModel({
        collectionTitle: req.body.collectionTitle ,
        collectionDescription: req.body.collectionDescription ,
        collectionStatus: "Incomplete",
        tasks: []
    });
    try{
        userCheck.collections.push(newCollection);
        await userCheck.save();
        res.json(newCollection)
    }catch(error){
        res.json({error: error, message: "Title and description is required"})
    }
    
})

collectionRouter.post("/addCollection/Task", async (req, res) =>{
    verifyToken;
    const user = req.body.userID;
    const userCheck = await UserModel.findOne({_id: user })
    if(userCheck.collections.tasks === null)
    userCheck.collections.tasks = [];
    const newCollectionTask = new TaskModel({
        title: req.body.title ,
        description: req.body.desc ,
        status: req.body.status
    });
    try{
        userCheck.collections.tasks.push(newCollectionTask);
        await userCheck.save();
        res.json(newCollectionTask)
    }catch(error){
        res.json({error: error, message: "Title and description is required"})
    }
    
})

collectionRouter.post("/updateCollection", async (req, res) =>{
    verifyToken;
    const user = req.body.userID;
    const collectionUpdate = `${req.body.collectionID}`
    try{
        const update = await UserModel.findOneAndUpdate({"_id": user, "collections._id": collectionUpdate}, 
        {$set: { "collections.$.collectionTitle": `${req.body.newTitle}`, "collections.$.collectionDescription": `${req.body.newDesc}`}})
        res.json(update.collections)
    }catch(error){
        res.json({error: error, message: "Couldnt update information"})
    }
})

collectionRouter.post("/updateCollection/Task", async (req, res) =>{
    verifyToken;
    const user = req.body.userID;
    const collectionUpdate = `${req.body.collectionID}`
    const collectionTaskUpdate = `${req.body.taskID}`
    try{
        const test = await UserModel.findOneAndUpdate({"_id": user, "collections._id": collectionUpdate, 
        "collections.tasks._id" : collectionTaskUpdate}, {$set: { "collections.tasks.$.status": `${req.body.taskStatus}`}})
        res.json(test.collections.tasks)
    }catch(error){
        res.json({error: error, message: "Couldnt update Status"})
    }
})

collectionRouter.post("/updateCollection/Task/Info", async (req, res) =>{
    verifyToken;
    const user = req.body.userID;
    const collectionUpdate = `${req.body.collectionID}`
    const collectionTaskUpdate = `${req.body.taskID}`
    try{
        const test = await UserModel.findOneAndUpdate({"_id": user, "collections._id": collectionUpdate, 
            "collections.tasks._id" : collectionTaskUpdate}, {$set: { "collections.tasks.$.title": `${req.body.newTitle}`, 
            "collections.tasks.$.description": `${req.body.newDesc}`}})
        res.json(test.collections.tasks)
    }catch(error){
        res.json({error: error, message: "Couldnt update Status"})
    }
})

// Delete Routes --------------------------------------------------

collectionRouter.delete('/deleteCollection/:collectionID', async (req, res) => {
    verifyToken;
    const collectionID = req.params.collectionID;
    try{
        const delCollection = await UserModel.findOneAndDelete({"_id": user, "collections._id": collectionID})
        res.json(delCollection)
    }catch(error){
        res.json({error: error, message: "Couldnt delete collection"})
    }
})

collectionRouter.delete('/deleteCollection/:collectionID/tasks/:taskID', async (req, res) => {
    verifyToken;
    const collectionID = req.params.collectionID;
    const taskID = req.params.taskID;
    try{
        const deltask = await UserModel.findOneAndDelete({"_id": user, "collections._id": collectionID,
            "collections.tasks._id" : taskID})
        res.json(deltask)
    }catch(error){
        res.json({error: error, message: "Couldnt delete collection task"})
    }
})

module.exports = collectionRouter;