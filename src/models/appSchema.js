const Mongoose = require("mongoose");

/*
    App schema
*/

const appSchema = new Mongoose.Schema({
    name: {
        type: String,
        required: true
    },
}, {
    timestamps: true
});

module.exports = appSchema;