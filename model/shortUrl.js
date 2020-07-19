const mongoose = require("mongoose");
// Creates a unique short identifier when we import the library
const shortId = require('shortid');

const Schema = mongoose.Schema;

const shortUrlSchema = new Schema({
    full: {
        type: String,
        required: true
    },
    short: {
        type: String,
        required: true,
        default: shortId.generate
    },
    clicks: {
        type: Number,
        required: true, 
        default: 0
    },
    date: {
        type: String
    }
})

// takes the name of the model & the Schema (name) as arguments
// This name can be whatever name we give it
module.exports = mongoose.model("ShortUrl", shortUrlSchema)