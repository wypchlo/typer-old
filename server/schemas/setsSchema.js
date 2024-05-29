const mongoose = require('mongoose');
const { Schema } = mongoose;

const setsSchema = new Schema({
    name: {
        type: String,
        default: '',
        required: [true, 'Name is required']
    },
    description: {
        type: String,
        default: ''
    },
    createdDate: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Sets', setsSchema);