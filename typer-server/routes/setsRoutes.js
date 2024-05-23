const express = require('express');
const router = express.Router();
const Sets = require('../schemas/setsSchema');
const Pairs = require('../schemas/pairsSchema');
const deletePairs = require('../modules/deletePairs');

router.get('/', async(req, res) => { 
    try {
        const sets = await Sets.find();
        res.status(200).json(sets);
    }
    catch(error) {
        console.error(`Error fetching sets: ${error}`);
        res.status(500).json({ error: 'Failed to fetch sets' });
    }
});

router.post('/add', async(req, res) => {
    try {
        const { name, description } = req.body;
        if(!name) return res.status(400).json({ error: 'Set name is required' });

        const newSet = new Sets({
            name, 
            description
        });

        await newSet.save();

        res.status(201).json(newSet);
    }
    catch(error) {
        console.error(`Error adding set: ${error}`);
        res.status(500).json({ error: 'Failed to add set' });
    }
});

router.put('/:id', async(req, res) => {
    try{
        const id = req.params.id;
        const data = req.body;
        if(!id) return res.status(400).json({ error: 'Set ID is required' });

        const UpdatedSet = Sets.findByIdAndUpdate(
            id, 
            { $set: data },
            { new: true, runValidators: true }
        );

        if(!UpdatedSet) return res.status(404).json({ error: 'Set not found' });

        res.status(200).json({ message: 'Set updated successfully' });
    }
    catch(error) {
        console.error(`Error updating set: ${error}`);
        res.status(500).json({ error: 'Failed updating set' });
    }
});

router.delete('/:id', async(req, res) => {
    try {
        // Multiple ids provided

        const ids = req.body.ids;
        if(ids) {
            await deletePairs(ids);

            const result = await Sets.deleteMany({ _id: { $in: ids } });
            if(result.deletedCount === 0 ) return res.status(404).json({ error: 'No sets found with the specified IDs' });

            return res.status(200).json({ message: 'Sets deleted successfully' })
        }

        // One id provided

        const id = req.params.id;
        if(!id) return res.status(400).json({ error: 'Set ID is required' });

        await Pairs.deleteMany({ setId: id })

        const result = await Sets.deleteOne({ _id: id });
        if(result.deletedCount === 0) return res.status(404).json({ error: 'Set not found' });

        res.status(200).json({ message: 'Set deleted successfully' });
    }
    catch(error) {
        console.error(`Error deleting set: ${error}`);
        res.status(500).json({ error: 'Failed to delete set' });
    }
});

router.get('/:id', async(req, res) => {
    try {
        const id = req.params.id;
        if(!id) return res.status(400).json({ error: 'Set ID is required' });
        
        const set = await Sets.findOne({ _id: id });    
        res.status(200).json(set);
    }
    catch(error) {
        console.error(`Error fetching set: ${error}`);
        res.status(500).json({ error: 'Failed to fetch set' });
    }
})

module.exports = router;