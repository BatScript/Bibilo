const mongoose = require('mongoose');

const userDataSchema = new mongoose.Schema({
    email: String,
    username: String,
    cartItems: {
        type: Map,
        of: String
    }
})

const userData = mongoose.model('userData', userDataSchema);

module.exports = userData;