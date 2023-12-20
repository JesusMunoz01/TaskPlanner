require('dotenv').config({ path: '../.env' })
const UserModel = require('../models/users');
const TaskModel = require('../models/tasks.js')
const verifyToken = require('../server.js')

const taskRouter = express.Router()

taskRouter.get("/fetchTasks", async (req, res) =>{
    const tasks = await TaskModel.find();
    res.json(tasks);
})

taskRouter.get("/fetchTasks/:userID", async (req, res) =>{
    const userCheck = req.params.userID
    const tasks = await UserModel.findOne({_id: userCheck });
    res.json(tasks.tasks);
})

taskRouter.post("/addTask", verifyToken , async (req, res) =>{
    const user = req.body.userID;
    const userCheck = await UserModel.findOne({_id: user })
    if(userCheck.tasks === null)
    userCheck.tasks = [];
    const newTask = new TaskModel({
        title: req.body.title ,
        description: req.body.desc ,
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

taskRouter.post("/updateTask", verifyToken , async (req, res) =>{
    const user = req.body.userID;
    const taskUpdate = `${req.body.taskID}`
    //const userCheck = await UserModel.findOne({_id: user})
    //const updateTask = userCheck.tasks
    //const index = updateTask.findIndex((task => task._id.valueOf() === taskUpdate))
    try{
        const test = await UserModel.findOneAndUpdate({"_id": user, "tasks._id": taskUpdate}, {$set: { "tasks.$.status": `${req.body.taskStatus}`}})
        res.json(test.tasks)
    }catch(error){
        res.json({error: error, message: "Couldnt update Status"})
    }
})

taskRouter.post("/updateTaskInfo", verifyToken , async (req, res) =>{
    const user = req.body.userID;
    const taskUpdate = `${req.body.taskID}`
    try{
        const test = await UserModel.findOneAndUpdate({"_id": user, "tasks._id": taskUpdate}, 
        {$set: { "tasks.$.title": `${req.body.newTitle}`, "tasks.$.description": `${req.body.newDesc}`}})
        res.json(test.tasks)
    }catch(error){
        res.json({error: error, message: "Couldnt update information"})
    }
})

taskRouter.delete('/tasks/:taskID', verifyToken, async (req, res) => {
    const taskID = req.params.taskID;
    const delTask = await TaskModel.findByIdAndDelete(taskID)
    res.json(delTask)
})

module.exports = taskRouter;