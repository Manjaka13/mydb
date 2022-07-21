const Mongoose = require("mongoose");
const appSchema = require("./appSchema");
const tableSchema = require("./tableSchema");

/*
    Export models and model methods here
*/

const models = {
    // The app model
    App: Mongoose.model("App", appSchema),

    // The table model
    Table: Mongoose.model("Table", tableSchema),

    // Returns a mounted model or create it
    get: (id, fields) => {
        let schema = {};
        if (!Mongoose.modelNames().includes(id) && fields) {
            Object.keys(fields).forEach((field) => {
                const type = fields[field].toLowerCase();
                field = field.toLowerCase();
                if (type === "string")
                    schema[field] = {
                        type: String,
                    };
                else if (type === "number")
                    schema[field] = {
                        type: Number,
                    };
            });
            return Mongoose.model(id, new Mongoose.Schema(schema));
        }
        else
            return Mongoose.model(id);
    }
};

module.exports = models;