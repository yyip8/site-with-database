let mongoose = require('mongoose');
let bookModel = mongoose.Schema({
    name: String,
    author: String,
    published: String,
    description: String,
    rating: Number,
    price: Number,
    comments: String
},

{
    collection:"books"
});

module.exports = mongoose.model('book',bookModel);
