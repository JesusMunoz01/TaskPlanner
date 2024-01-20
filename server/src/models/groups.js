const mongoose = require('mongoose')

const Schema = mongoose.Schema;
const ObjectId = mongoose.ObjectId;

const GroupSchema = new Schema({
    groupName: {type: String, required: true},
    groupDescription: {type: String, required: true},
    groupAdmin: [{type: String, required: true}],
    groupMembers: [{type: String, required: true}],
    collections: {
        collectionTitle: {type: String, required: true},
        collectionDescription: {type: String, required: true},
        collectionStatus:{type: String, required: true},
        tasks: [{
            title: { type: String, required: true},
            description: { type: String, required: true},
            status: { type: String, required: true }
        }]
    }
})

const GroupModel = mongoose.model("Group", GroupSchema);

module.exports = GroupModel;