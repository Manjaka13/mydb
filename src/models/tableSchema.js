const Mongoose = require("mongoose");

/*
    Table schema
*/

const tableSchema = new Mongoose.Schema({
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

module.exports = tableSchema;