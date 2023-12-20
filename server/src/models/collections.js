const mongoose = require('mongoose')

const Schema = mongoose.Schema;
const ObjectId = mongoose.ObjectId;

const CollectionsSchema = new Schema({
    collectionTitle: {type: String, required: true},
    collectionDescription: {type: String, required: true},
    tasks: [{
        title: { type: String, required: true},
        description: { type: String, required: true},
        status: { type: String, required: true }
    }]
})

const CollectionsModel = mongoose.model("Collection", CollectionsSchema);

module.exports = CollectionsModel;