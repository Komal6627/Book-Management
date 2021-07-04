const mongoose = require("mongoose");

//Author Schema
const AuthorSchema = mongoose.Schema({
    id : Number,
    name : String,
    book : [String],
});

//Author Model
const AuthorModel = mongoose.model(AuthorSchema);

module.exports = AuthorModel;