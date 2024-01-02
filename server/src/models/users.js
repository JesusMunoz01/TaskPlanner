const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const ObjectId = mongoose.ObjectId;

const UserSchema = new Schema({
    username: { type: String, required: true, unique: true},
    password: { type: String, required: true},
    tasks: [{
            title: { type: String, required: true}, 
            description: { type: String, required: true},
            status: { type: String, required: true }
        }],
    collections: [{
        collectionTitle: {type: String, required: true},
        collectionDescription: {type: String, required: true},
        collectionStatus:{type: String, required: true},
            tasks: [{
                title: { type: String, required: true}, 
                description: { type: String, required: true},
                status: { type: String, required: true }
        }]
    }]
})

const UserModel = mongoose.model("User", UserSchema);

module.exports = UserModel;