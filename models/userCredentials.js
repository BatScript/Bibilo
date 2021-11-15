
const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');

const userSchema = new mongoose.Schema({
    email: String,
    password: String,
    isAdmin: Boolean
})

userSchema.plugin(passportLocalMongoose);

const userCredentials = mongoose.model('userCredentials', userSchema);

module.exports = userCredentials;