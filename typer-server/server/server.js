const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const mongoose = require('mongoose');
const Groups = require('./groupsSchema');

const main = async() => {
    try {
        mongoose.connect('mongodb://localhost:27017/typer', { useNewUrlParser: true, useUnifiedTopology: true });
    }
    catch{
        console.log('couldn\'t connect to the database');
        return;
    }

    const server = express();
    const port = 3000;

    server.use(cors());
    server.use(bodyParser.json())
    server.use(express.static('public'));

    // routes

    server.get('/api/groups', async(req, res) => { 
        const groups = await Groups.find();

        res.json(groups);
    });

    server.post('/api/groups/add', async(req, res) => {
        try {
            const groupName = req.body.groupName;
            const newGroup = new Groups({
                name: groupName
            });
            await newGroup.save();
        }
        catch(error) {
            console.log(error);
        }
        
        res.status(200);
    });

    server.post('/api/groups/delete', async(req, res) => {
        try {
            const groupId = req.body.groupId;
            await Groups.deleteOne({ "_id": groupId });
        }
        catch(error) {
            console.log(error);
        }
    });

    server.listen(port, () => {
        console.log('server is running on http://localhost:'+'3000')
    })
};

main();