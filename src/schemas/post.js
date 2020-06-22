const mongoose = require("mongoose");
const addressSchema = require("./address");

const postSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 50,
    },
    description: {
        type: String,
        required: true,
        minlength: 10,
        maxlength: 250,
    },
    pictureUrl: {
        type: String,
    },
    address: addressSchema, //TODO: address service 
    activeStatus: {
        type: Boolean,
        default: true,
    },
    dateSolidarity: {
        type: Date,
        required: true,
    },
    dateCreated: {
        type: Date,
        default: Date.now(),
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    }
});

module.exports = mongoose.model("Post", postSchema);