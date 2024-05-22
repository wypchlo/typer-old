const mongoose = require('mongoose');
const { Schema } = mongoose;

const pairsSchema = new Schema({
    word: {
        type: String,
        default: '',
        required: [true, 'Word is required']
    },
    translation: {
        type: String,
        default: '',
        required: [true, 'Translation is required']
    },
    wordLanguageId: {
        type: String,
        default: ''
    },
    translationLanguageId: {
        type: String,
        default: ''
    },
    createdDate: {
        type: Date,
        default: Date.now
    },
    setId: {
        type: String,
        default: '',
        required: [true, 'Set ID is required']
    }
})

module.exports = mongoose.model('Pairs', pairsSchema);