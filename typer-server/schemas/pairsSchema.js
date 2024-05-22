const mongoose = require('mongoose');
const { Schema } = mongoose;

const pairsSchema = new Schema({
    word: {
        type: String,
        default: '',
        required: [true, 'word translation is required']
    },
    translation: {
        type: String,
        default: '',
        required: [true, 'word translation is required']
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
    groupId: {
        type: String,
        default: '',
        required: [true, 'group is required']
    }
})

module.exports = mongoose.model('Pairs', pairsSchema);