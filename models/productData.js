const mongoose = require('mongoose');

const products = new mongoose.Schema({
    image: String,
    name: String,
    author: String,
    rating: Number,
    price: Number
})


const productData = mongoose.model('productData', products);

module.exports =  productData;