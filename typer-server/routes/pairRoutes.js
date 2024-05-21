const express = require('express');
const router = express.Router();
const Pairs = require('../schemas/pairsSchema');

router.get('/', async(req, res) => { 
    try {
        const pairs = await Pairs.find();
        res.status(200).json(pairs);
    }
    catch(error) {
        console.error(`Error fetching pair: ${error}`);
        res.status(500).json({ error: 'Failed to fetch pairs' });
    }
});

router.post('/add', async(req, res) => {
    try {
        const { word, translation, wordLanguageId, translationLanguageId, groupId } = req.body;

        const newPair = new Pairs({
            word, 
            translation,
            wordLanguageId,
            translationLanguageId,
            groupId
        });
        
        console.log(word, translation, wordLanguageId, translationLanguageId, groupId);

        await newPair.save();

        res.status(201).json(newPair);
    }
    catch(error) {
        if(error.name === 'ValidationError') {
            const validationErrors = {};
            for (const field in error.errors)
                validationErrors[field] = error.errors[field].message;

            return res.status(400).json({ errors: validationErrors });
        }
        
        console.error(`Error adding pair: ${error}`);
        res.status(500).json({ error: 'Failed to add pair' });
    }
});

router.put('/:id', async(req, res) => {
    try{
        const id = req.params.id;
        const data = req.body;
        if(!id) return res.status(400).json({ error: 'Pair ID is required' });

        const UpdatedPair = Pairs.findByIdAndUpdate(
            id, 
            { $set: data },
            { new: true, runValidators: true }
        );

        if(!UpdatedPair) return res.status(404).json({ error: 'Pair not found' });
    }
    catch(error) {
        console.error(`Error updating pair: ${error}`);
        res.status(500).json({ error: 'Failed updating pair' });
    }
});

router.delete('/:id', async(req, res) => {
    try {
        // Multiple ids provided

        const ids = req.body.ids;
        if(ids) {
            const result = await Pairs.deleteMany({ _id: { $in: ids } });
            if(result.deletedCount === 0 ) return res.status(404).json({ error: 'No pairs found with the specified IDs' });

            return res.status(200).json({ message: 'Pairs deleted successfully' })
        }

        // One id provided

        const id = req.params.id;
        if(!id) return res.status(400).json({ error: 'Pair ID is required' });

        const result = await Pairs.deleteOne({ _id: id });
        if(result.deletedCount === 0) return res.status(404).json({ error: 'Pair not found' });

        res.status(200).json({ message: 'Pair deleted successfully' });
    }
    catch(error) {
        console.error(`Error deleting pair: ${error}`);
        res.status(500).json({ error: 'Failed to delete pair' });
    }
});

router.get('/group/:id', async(req, res) => {
    try {
        const id = req.params.id;
        if(!id) return res.status(400).json({ error: 'Group ID is required' });

        const pairsOfGroup = await Pairs.find({ groupId: id });
        return res.status(200).json(pairsOfGroup)
    }
    catch(error) {
        console.error(`Error fetching pairs of group: ${error}`);
        return res.status(500).json({ error: 'Failed to fetch pairs of group' }) 
    }
});

module.exports = router;