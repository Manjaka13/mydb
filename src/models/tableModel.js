const Mongoose = require("mongoose");

/*
    User model
*/

const tableModel = new Mongoose.Schema({
    app: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    fields: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});

module.exports = Mongoose.model("Table", tableModel);