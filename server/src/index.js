require('dotenv').config({ path: '../.env' })
const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
const TaskModel = require('./models/tasks')

const app = express()
const db = mongoose.connect(process.env.MONGO_DB)

app.use(express.json());
app.use(cors());

app.post("/addTask", async (req, res) =>{
    const newTask = new TaskModel({
        title: 'Finish backend',
        description: 'Finished backend setup by end of day'
    });
    const createdTask = await newTask.save();
    res.json(createdTask)
})

app.get("/", (req, res) => {
    res.send("Connected");
})

app.listen(process.env.APP_PORT, () => console.log(`Server listening on port ${process.env.APP_PORT}`));