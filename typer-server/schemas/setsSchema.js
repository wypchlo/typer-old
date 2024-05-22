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
    }
});

module.exports = mongoose.model('Sets', setsSchema);