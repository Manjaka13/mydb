const Mongoose = require("mongoose");

/*
    User model
*/

const collectionModel = new Mongoose.Schema({
    app: {
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

module.exports = Mongoose.model("App", collectionModel);