require('dotenv').config({ path: '' })
const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
const userRouter = require('./routes/usersRouter.js')
const taskRouter = require('./routes/tasksRouter.js')
const collectionRouter = require('./routes/collectionsRouter.js')
var jwt = require('jsonwebtoken');

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
}; module.exports = verifyToken;

const app = express()
const db = mongoose.connect(process.env.MONGO_DB)

app.use(express.json());
app.use(cors());
app.use(userRouter, taskRouter, collectionRouter);

app.listen(process.env.APP_PORT, () => console.log(`Server listening on port ${process.env.APP_PORT}`));