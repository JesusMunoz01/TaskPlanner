require('dotenv').config({ path: '../.env' })
const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
const TaskModel = require('./models/tasks')
const userRouter = require('./routes/users.js')

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
    console.log(tasks)
    res.json(tasks);
})

app.post("/addTask", verifyToken , async (req, res) =>{
    const newTask = new TaskModel({
        title: req.body.title,
        description: req.body.desc
    });
    const createdTask = await newTask.save();
    res.json(createdTask)
})

app.delete('/tasks/:taskID', verifyToken, async (req, res) => {
    const taskID = req.params.taskID;
    const delTask = await TaskModel.findByIdAndDelete(taskID)
    res.json(delTask)
})


app.listen(process.env.APP_PORT, () => console.log(`Server listening on port ${process.env.APP_PORT}`));