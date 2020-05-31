const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 2,
        maxlength: 50,
    },
    lastname: {
        type: String,
        required: true,
        minlength: 2,
        maxlength: 50,
    },
    email: {
        type: String,
        required: true,
        lowercase: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
        minlength: 6,
        maxlength: 15,
    },
    gender: {
        type: Number,
        default: 0,
    },
    birthdate: {
        type: Date,
    },
    activeStatus: {
        type: Boolean,
        default: true,
    },
    verifiedStatus: {
        type: Boolean,
        default: false,
    },
    dateCreated: {
        type: Date,
        default: Date.now(),
    } // TODO: pictureUrl & fullname (virtual)
});

module.exports = mongoose.model("User", userSchema);