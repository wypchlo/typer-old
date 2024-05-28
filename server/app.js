const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

console.clear();

// db connection

console.log('Connecting to the database...');

mongoose.connect('mongodb://192.168.125.199:27017/typer')
    .catch((error) => console.log(`Error while connecting to the database: ${error}`));

// basic app setup

console.log('Setting up app...')

const app = express();

const corsOptions = {
    origin: ['http://localhost:5173', 'http://192.168.125.199:5173'],
    optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(bodyParser.json())
app.use(express.static('public'));

// routes

console.log('Initializing routes...');

app.use('/api/sets', require('./routes/setsRoutes'));
app.use('/api/pairs', require('./routes/pairsRoutes'));
app.use('/api/languages', require('./routes/languagesRoutes'));

// listen on port

const port = 3000;

app.listen(port, '0.0.0.0', () => {
    console.log('Server is running on http://localhost:'+'3000')
});