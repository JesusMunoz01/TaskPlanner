require('dotenv').config({ path: '../.env' })
const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
const TaskModel = require('./models/tasks')
const UserModel = require('./models/users.js')
const userRouter = require('./routes/users.js')
var jwt = require('jsonwebtoken');

const app = express()
const db = mongoose.connect(process.env.MONGO_DB)

app.use(express.json());
app.use(cors());
app.use(userRouter);

const verifyToken = (req, res, next) => {
    const token = req.headers.auth;
    if(token){
        jwt.verify(token, process.env.SECRET, (error) => {
            if(error) return res.sendStatus(403)
            next();
        })
    } else {
        res.sendStatus(401);
    }
};

app.get("/fetchTasks", async (req, res) =>{
    const tasks = await TaskModel.find();
    res.json(tasks);
})

app.get("/fetchTasks/:userID", async (req, res) =>{
    const userCheck = req.params.userID
    const tasks = await UserModel.findOne({_id: { $eq: userCheck }});
    res.json(tasks.tasks);
})

app.post("/addTask", verifyToken , async (req, res) =>{
    const user = req.body.userID;
    const userCheck = await UserModel.findOne({_id: { $eq: user }})
    if(userCheck.tasks === null)
    userCheck.tasks = [];
    const newTask = new TaskModel({
        title: { $eq: req.body.title },
        description:{ $eq: req.body.desc },
        status: req.body.status
    });
    try{
        userCheck.tasks.push(newTask);
        await userCheck.save();
        res.json(newTask)
    }catch(error){
        res.json({error: error, message: "Title and description is required"})
    }
    
})

app.post("/updateTask", verifyToken , async (req, res) =>{
    const user = req.body.userID;
    const taskUpdate = `${req.body.taskID}`
    //const userCheck = await UserModel.findOne({_id: user})
    //const updateTask = userCheck.tasks
    //const index = updateTask.findIndex((task => task._id.valueOf() === taskUpdate))
    try{
        const test = await UserModel.findOneAndUpdate({"_id": user, "tasks._id": taskUpdate}, {$set: { "tasks.$.status": `${req.body.taskStatus}`}})
        res.json(test.tasks)
    }catch(error){
        res.json({error: error, message: "Title and description is required"})
    }
})

app.delete('/tasks/:taskID', verifyToken, async (req, res) => {
    const taskID = req.params.taskID;
    const delTask = await TaskModel.findByIdAndDelete(taskID)
    res.json(delTask)
})


app.listen(process.env.APP_PORT, () => console.log(`Server listening on port ${process.env.APP_PORT}`));