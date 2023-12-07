const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')

const app = express()

// const db = mongoose.connect('')

app.use(express.json());
app.use(cors());

app.listen(8080)