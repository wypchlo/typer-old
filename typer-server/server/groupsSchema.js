const mongoose = require('mongoose');
const { Schema } = mongoose;

const groupsSchema = new Schema({
    name: {
        type: String,
        default: '',
        required: [true, 'group name is required']
    },
    description: {
        type: String,
        default: ''
    }
});

module.exports = mongoose.model('Groups', groupsSchema);