const mongoose = require("mongoose");

//Creating book schema
const BookSchema = mongoose.Schema({
    ISBN : String,
    title : String,
    pubdate : String, 
    language : String,
    numpage : Number,
    author : [Number],
    publication : Number,
    category : [String],
});

//Create Book Model
const BookModel = mongoose.model("books" ,BookSchema);

module.exports = BookModel;