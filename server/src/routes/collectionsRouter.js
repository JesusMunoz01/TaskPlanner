require('dotenv').config({ path: '../.env' });
const express = require('express');
const UserModel = require('../models/users');
const TaskModel = require('../models/tasks.js');
const CollectionsModel = require('../models/collections.js');
const verification = require('./authenticate.js');

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

collectionRouter.post("/addCollection", verification, async (req, res) =>{
 
    const user = req.body.userID;
    let userCheck;
    try{
        userCheck = await UserModel.findOne({_id: user })
        const newCollection = new CollectionsModel({
            collectionTitle: req.body.title ,
            collectionDescription: req.body.desc ,
            collectionStatus: "Incomplete",
            tasks: []
        });
        try{
            userCheck.collections.push(newCollection);
            await userCheck.save();
            res.json(userCheck.collections)
        }catch(error){
            res.json({error: error, message: "Title and description is required"})
        }
    }catch(error){
        res.json({error: error, message: "Couldnt Find User"})
    }
    
})

collectionRouter.post("/addCollection/newTask", verification, async (req, res) =>{
    const user = req.body.userID;
    const collectionID = req.body.currentCollectionIndex;
    const userCheck = await UserModel.findOne({_id: user })
    const newCollectionTask = new TaskModel({
        title: req.body.collectionTaskTitle ,
        description: req.body.collectionTaskDesc ,
        status: req.body.status
    });
    try{
        userCheck.collections[collectionID].tasks.push(newCollectionTask);
        await userCheck.save();
        res.json(userCheck.collections[collectionID])
    }catch(error){
        res.json({error: error, message: "Title and description is required"})
    }
    
})

collectionRouter.post("/updateCollection", verification, async (req, res) =>{
    const user = req.body.userID;
    const collectionUpdate = req.body.collectionID;
    try{
        const update = await UserModel.findOneAndUpdate({"_id": user, "collections._id": collectionUpdate}, 
        {$set: { "collections.$.collectionTitle": `${req.body.newColTitle}`, "collections.$.collectionDescription": `${req.body.newColDesc}`}})
        res.json(update.collections)
    }catch(error){
        res.json({error: error, message: "Couldnt update information"})
    }
})

collectionRouter.post("/updateCollection/task/status", verification, async (req, res) =>{
    const user = req.body.userID;
    const collectionID = req.body.collectionID;
    const collectionTaskUpdate = req.body.taskID;
    try{
        const updtTaskStatus = await UserModel.findOneAndUpdate({"_id": user, "collections._id": collectionID, "collections.tasks._id": collectionTaskUpdate}, 
        {$set: {"collections.$[colID].tasks.$[taskID].status": `${req.body.taskStatus}`}}, 
        {"arrayFilters": [{"colID._id": collectionID}, {"taskID._id": collectionTaskUpdate}]})

        const index = updtTaskStatus.collections.findIndex((collection) => collection._id.toString() === collectionID)
        const statusFilter = updtTaskStatus.collections[index].tasks.filter((task) => task.status === "Complete")
        if(statusFilter.length + 1 === updtTaskStatus.collections[index].tasks.length)
            await UserModel.findOneAndUpdate({"_id": user, "collections._id": collectionID, "collections.tasks._id": collectionTaskUpdate}, 
            {$set: {"collections.$[colID].collectionStatus": "Complete"}}, {"arrayFilters": [{"colID._id": collectionID}]})
        else if(updtTaskStatus.collections[index].collectionStatus === "Complete")
            await UserModel.findOneAndUpdate({"_id": user, "collections._id": collectionID, "collections.tasks._id": collectionTaskUpdate}, 
            {$set: {"collections.$[colID].collectionStatus": "Incomplete"}}, {"arrayFilters": [{"colID._id": collectionID}]})

        res.json(updtTaskStatus.collections[index])
    }catch(error){
        res.json({error: error, message: "Couldnt update Status"})
    }
})

collectionRouter.post("/updateCollection/task/data", verification, async (req, res) =>{
    const user = req.body.userID;
    const collectionID = req.body.collectionID;
    const collectionTaskUpdate = req.body.taskID;;
    try{
        const updtTaskData = await UserModel.findOneAndUpdate({"_id": user, "collections._id": collectionID, "collections.tasks._id": collectionTaskUpdate}, 
        {$set: {"collections.$[colID].tasks.$[taskID].title": `${req.body.newTitle}`, 
                "collections.$[colID].tasks.$[taskID].description": `${req.body.newDesc}`}}, 
        {"arrayFilters": [{"colID._id": collectionID}, {"taskID._id": collectionTaskUpdate}]})
        const collectionIndex = updtTaskData.collections.findIndex((collection) => collection._id.toString() === collectionID)
        res.json(updtTaskData.collections[collectionIndex])
    }catch(error){
        res.json({error: error, message: "Couldnt update information"})
    }
})

// Delete Routes --------------------------------------------------

collectionRouter.delete('/deleteCollection/:userID/:collectionID', verification, async (req, res) => {
    const user = req.params.userID;
    const collectionID = req.params.collectionID;
    try{
        const delCollection = await UserModel.findOneAndUpdate({"_id": user, "collections._id": collectionID}, 
        {$pull: {collections: {_id: collectionID}}})
        const filteredCollection = delCollection.collections.filter((collection) => collection._id != collectionID)
        res.json(filteredCollection)
    }catch(error){
        res.json({error: error, message: "Couldnt delete collection"})
    }
})

collectionRouter.delete('/deleteCollection/:userID/:collectionID/tasks/:taskID', verification, async (req, res) => {
    const user = req.params.userID;
    const collectionID = req.params.collectionID;
    const taskID = req.params.taskID;
    try{
        const delCollection = await UserModel.findOneAndUpdate({"_id": user, "collections._id": collectionID}, 
        {$pull: {"collections.$.tasks": {_id: taskID}}})
        res.json(delCollection)
    }catch(error){
        res.json({error: error, message: "Couldnt delete collection"})
    }
})

module.exports = collectionRouter;