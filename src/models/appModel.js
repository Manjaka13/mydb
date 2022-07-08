const Mongoose = require("mongoose");

/*
    User model
*/

const appModel = new Mongoose.Schema({
    app: {
        type: String,
        required: true
    },
}, {
    timestamps: true
});

module.exports = Mongoose.model("App", appModel);