const mongoose = require("mongoose");
// Creates a unique short identifier when we import the library
const shortId = require('shortid');

const Schema = mongoose.Schema;

const myUrlSchema = new Schema({
    longUrl: {
        type: String,
        required: true
    },
    shortUrl: {
        type: String,
        required: true,
        default: shortId.generate
    },
    views: {
        type: Number,
        required: true, 
        default: 0
    },
    date: {
        type: String,
        default: "N/A",
        required: true
    }
})

// takes the name of the model & the Schema (name) as arguments
// This name can be whatever name we give it
module.exports = mongoose.model("myNewUrl", myUrlSchema)