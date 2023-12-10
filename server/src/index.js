require('dotenv').config({ path: '../.env' })
const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
const TaskModel = require('./models/tasks')
const UserModel = require('./models/users')

const app = express()
const db = mongoose.connect(process.env.MONGO_DB)

app.use(express.json());
app.use(cors());

app.get("/fetchTasks", async (req, res) =>{
    const tasks = await TaskModel.find();
    console.log(tasks)
    res.json(tasks);
})

app.post("/addUser", async (req, res) =>{
    const newUser = new UserModel({
        username: req.body.username,
        password: req.body.password
    });
    const createdUser = await newUser.save();
    res.json(createdUser)
})

app.post("/userLogin", async (req, res) =>{
    const newTask = new TaskModel({
        title: req.body.title,
        description: req.body.desc
    });
    const createdTask = await newTask.save();
    res.json(createdTask)
})

app.post("/addTask", async (req, res) =>{
    const newTask = new TaskModel({
        title: req.body.title,
        description: req.body.desc
    });
    const createdTask = await newTask.save();
    res.json(createdTask)
})

app.delete('/tasks/:taskID', async (req, res) => {
    const taskID = req.params.taskID;
    const delTask = await TaskModel.findByIdAndDelete(taskID)
    res.json(delTask)
})

app.listen(process.env.APP_PORT, () => console.log(`Server listening on port ${process.env.APP_PORT}`));