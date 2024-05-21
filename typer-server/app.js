const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

// db connection

mongoose.connect('mongodb://localhost:27017/typer', { useNewUrlParser: true, useUnifiedTopology: true })
    .catch(console.log("couldn't connect to the database"));

// basic app setup

const app = express();

app.use(cors());
app.use(bodyParser.json())
app.use(express.static('public'));

// routes

app.use('/api/groups', require('./routes/groupRoutes'));
app.use('/api/pairs', require('./routes/pairRoutes'));

// listen on port

const port = 3000;

app.listen(port, () => {
    console.log('server is running on http://localhost:'+'3000')
});