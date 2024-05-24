const express = require('express');
const router = express.Router();
const Langs = require('../schemas/languagesSchema');

router.get('/', async(req, res) => { 
    try {
        const langs = await Langs.find();
        res.status(200).json(langs);
    }
    catch(error) {
        console.error(`Error fetching languages: ${error}`);
        res.status(500).json({ error: 'Failed to fetch languages' });
    }
});

router.post('/add', async(req, res) => {
    try {
        const { language } = req.body;
        const newLang = new Langs({ language });

        await newLang.save();
        res.status(201).json(newLang);
    }
    catch(error) {
        if(error.name === 'ValidationError') {
            const validationErrors = {};
            for (const field in error.errors)
                validationErrors[field] = error.errors[field].message;

            return res.status(400).json({ errors: validationErrors });
        }
        
        console.error(`Error adding language: ${error}`);
        res.status(500).json({ error: 'Failed to add language' });
    }
});

router.put('/:id', async(req, res) => {
    try{
        const id = req.params.id;
        const data = req.body;

        if(!id) return res.status(400).json({ error: 'Language ID is required' });

        const UpdatedLang = Langs.findByIdAndUpdate(
            id, 
            { $set: data },
            { new: true, runValidators: true }
        );

        if(!UpdatedLang) return res.status(404).json({ error: 'Language not found' });

        res.status(200).json(UpdatedLang);
    }
    catch(error) {
        console.error(`Error updating language: ${error}`);
        res.status(500).json({ error: 'Failed updating language' });
    }
});

router.delete('/:id', async(req, res) => {
    try {
        // Multiple ids provided

        const ids = req.body.ids;
        if(ids) {
            const result = await Langs.deleteMany({ _id: { $in: ids } });
            if(result.deletedCount === 0 ) return res.status(404).json({ error: 'No languages found with the specified IDs' });

            return res.status(200).json({ message: 'Languages deleted successfully' })
        }

        // One id provided

        const id = req.params.id;
        if(!id) return res.status(400).json({ error: 'Language ID is required' });

        const result = await Langs.deleteOne({ _id: id });
        if(result.deletedCount === 0) return res.status(404).json({ error: 'Language not found' });

        res.status(200).json({ message: 'Language deleted successfully' });
    }
    catch(error) {
        console.error(`Error deleting language: ${error}`);
        res.status(500).json({ error: 'Failed to delete language' });
    }
});

module.exports = router;