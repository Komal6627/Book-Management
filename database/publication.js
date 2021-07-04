const mongoose = require("mongoose");

//Publication Schema
const PublicationSchema = mongoose.Schema({
    id : Number,
    name : String,
    book : [String],
});

//Publication Model
const PublicationModel = mongoose.model(PublicationSchema);

module.exports =PublicationModel;