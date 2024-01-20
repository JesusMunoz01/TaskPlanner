require('dotenv').config({ path: '../.env' })
const express = require('express')
const GroupModel = require('../models/groups.js');
const verification = require('./authenticate.js');

const groupRouter = express.Router()

groupRouter.get("/fetchGroups", verification, async (req, res) =>{
    
})

module.exports = groupRouter