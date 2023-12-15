const mongoose = require('mongoose')

const Schema = mongoose.Schema;
const ObjectId = mongoose.ObjectId;

const TaskSchema = new Schema({
    title: { type: String, required: true},
    description: { type: String, required: true},
    status: { type: String, required: true }
})

const TaskModel = mongoose.model("Task", TaskSchema);

module.exports = TaskModel;