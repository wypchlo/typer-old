const express = require('express');
const router = express.Router();
const Groups = require('../schemas/groupsSchema');

router.get('/', async(req, res) => { 
    try {
        const groups = await Groups.find();
        res.status(200).json(groups);
    }
    catch (error) {
        console.error(`Error fetching groups: ${error}`);
        res.status(500).json({ error: 'Failed to fetch groups' });
    }
});

router.post('/add', async(req, res) => {
    try {
        const { name, description } = req.body;
        if(!name) return res.status(400).json({ error: 'Group name is required' });

        const newGroup = new Groups({
            name, 
            description
        });

        await newGroup.save();

        res.status(201).json(newGroup);
    }
    catch(error) {
        console.error(`Error adding group: ${error}`);
        res.status(500).json({ error: 'Failed to add group' });
    }
});

router.put('/:id', async(req, res) => {
    try{
        const id = req.params.id;
        const data = req.body;
        if(!id) return res.status(400).json({ error: 'Group ID is required' });

        const UpdatedGroup = Groups.findByIdAndUpdate(
            id, 
            { $set: data },
            { new: true, runValidators: true }
        );

        if(!UpdatedGroup) return res.status(404).json({ error: 'Group not found' });
    }
    catch (error) {
        console.error(`Error updating group: ${error}`);
        res.status(500).json({ error: 'Failed updating group' });
    }
});

router.delete('/:id', async(req, res) => {
    try {
        // Multiple ids provided

        const ids = req.body.ids;
        if(ids) {
            const result = await Groups.deleteMany({ _id: { $in: ids } });
            if(result.deletedCount === 0 ) return res.status(404).json({ error: 'No groups found with the specified IDs' });

            return res.status(200).json({ message: 'Groups deleted successfully' })
        }

        // One id provided

        const id = req.params.id;
        if(!id) return res.status(400).json({ error: 'Group ID is required' });

        const result = await Groups.deleteOne({ _id: id });
        if(result.deletedCount === 0) return res.status(404).json({ error: 'Group not found' });

        res.status(200).json({ message: 'Group deleted successfully' });
    }
    catch(error) {
        console.error(`Error deleting group: ${error}`);
        res.status(500).json({ error: 'Failed to delete group' });
    }
});

module.exports = router;