const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

console.clear();

// db connection

console.log('Connecting to the database...');

mongoose.connect('mongodb://localhost:27017/typer')
    .catch((error) => console.log(`Error while connecting to the database: ${error}`));

// basic app setup

console.log('Setting up app...')

const app = express();

app.use(cors());
app.use(bodyParser.json())
app.use(express.static('public'));

// routes

console.log('Initializing routes...');

app.use('/api/groups', require('./routes/groupRoutes'));
app.use('/api/pairs', require('./routes/pairRoutes'));
app.use('/api/languages', require('./routes/languageRoutes'));

// listen on port

const port = 3000;

app.listen(port, () => {
    console.log('Server is running on http://localhost:'+'3000')
});