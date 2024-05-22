const express = require('express');
const router = express.Router();
const Pairs = require('../schemas/pairsSchema');
const deletePairs = require('../modules/deletePairs');

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
        const { word, translation, wordLanguageId, translationLanguageId, setId } = req.body;

        const newPair = new Pairs({
            word, 
            translation,
            wordLanguageId,
            translationLanguageId,
            setId
        });

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
    const response = await deletePairs(req.params.id ? req.params.id : req.body.ids);
    res.status(response.status).json(response);
});

router.get('/set/:id', async(req, res) => {
    try {
        const id = req.params.id;
        if(!id) return res.status(400).json({ error: 'Set ID is required' });

        const pairsOfSet = await Pairs.find({ setId: id }).sort({ createdDate: -1 });
        return res.status(200).json(pairsOfSet)
    }
    catch(error) {
        console.error(`Error fetching pairs of set: ${error}`);
        return res.status(500).json({ error: 'Failed to fetch pairs of set' }) 
    }
});

module.exports = router;