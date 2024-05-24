const mongoose = require('mongoose');
const { Schema } = mongoose;

const languagesSchema = new Schema({
    language: {
        type: String,
        default: '',
        required: [true, 'Language is required']
    }
})

module.exports = mongoose.model('Languages', languagesSchema);