const mongoose = require("mongoose");

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
    address: { //TODO: address service 
        country: {
            type: String,
            required: true,
        },
        province: {
            type: String,
            required: true,
        },
        district: {
            type: String,
            required: true,
        },
    },
    provinceAddress: {
        type: String,
        required: true,
    },
    fullAddress: {
        type: String,
        required: true,
    },
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