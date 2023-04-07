let mongoose = require('mongoose');
let bookModel = mongoose.Schema({
    name: String,
    author: String,
    published: String,
    description: String,
    price: Number,
    comments: {
        type: [String],
        default: []
    }
},

{
    collection:"books"
});

module.exports = mongoose.model('book',bookModel);