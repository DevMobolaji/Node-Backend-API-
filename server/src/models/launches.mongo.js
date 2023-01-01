const mongoose = require("mongoose");

const lauchesSchema = new mongoose.Schema({
    flightNumber: {
        type: Number,
        required: true
    },
    launchDate: {
        type: Date
    },
    mission: {
        type: String,
        required: true
    },
    rocket: {
        type: String,
        required: true
    },
    target: {
        // type: mongoose.ObjectId,
        // ref: 'Planet'
        type: String,
    },
    upcoming: {
        type: Boolean,
        required: true
    }, 
    success: {
        type: Boolean,
        required: true,
        default: true
    },
    customers: [ String ]
})

module.exports = mongoose.model("Launch", lauchesSchema);

