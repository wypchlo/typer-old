const mongoose = require('mongoose');
const { Schema } = mongoose;

const wordsSchema = new Schema({
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
    groupId: {
        type: String,
        default: '',
        required: [true, 'group is required']
    }
})

module.exports = mongoose.model('Words', wordsSchema);