const mongoose = require('mongoose');
const { Schema } = mongoose;

const languagesSchema = new Schema({
    language: {
        type: String,
        default: '',
        required: [true, 'language is required']
    }
})

module.exports = mongoose.model('Languages', languagesSchema);