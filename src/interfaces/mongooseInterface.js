const Mongoose = require("mongoose");
const App = require("../models/appModel");
const {
    databaseUrl,
    databaseName,
    prohibitedFieldNames,
    prohibitedCollectionNames
} = require("../helpers/const");
const { mongooseFormat } = require("../helpers/utils");

/*
    Database manipulation through Mongoose
*/

const mongoose = {
    // Connects to MongoDB
    connect: () => Mongoose.connect(`${databaseUrl}/${databaseName}`, { useNewUrlParser: true, useUnifiedTopology: true }),

    // Creates a schema from provided fields
    createModel: (collectionName, fields) => new Promise((resolve, reject) => {
        if (!collectionName)
            reject("Please provide collection name");
        else if (fields || Object.keys(fields).length === 0) {
            let schema = {};
            const keys = Object.keys(fields);
            keys.forEach((field) => {
                const type = fields[field].toLowerCase();
                if (prohibitedFieldNames.includes(field.toLowerCase()))
                    reject("You can not use prohibited field names");
                else if (type === "string")
                    schema[field] = {
                        type: String,
                    };
                else if (type === "number")
                    schema[field] = {
                        type: Number,
                    };
                else
                    reject("Unknown field type");
            });
            if (Object.keys(schema).length != keys.length)
                reject("Schema creation failed");
            else {
                collectionName = collectionName.toLowerCase().split("");
                collectionName[0] = collectionName[0].toUpperCase();
                collectionName = collectionName.join("");
                if (prohibitedCollectionNames.includes(collectionName))
                    reject("This collection name is prohibited");
                else
                    resolve(Mongoose.model(collectionName, new Mongoose.Schema(schema)));
            }
        }
        else
            reject("Please provide valid fields and type");
    }),

    // Creates app
    createApp: (app) => App.findOne({ app })
        .then((existingApp) => {
            if (existingApp)
                throw `Application ${app} already exists`;
            else
                return new App({ app }).save();
        })
        .then(mongooseFormat),

    // Drops an app
    dropApp: (app) => App.findOne({ app })
        .then((existingApp) => {
            if (!existingApp)
                throw `Application ${app} does not exist`;
            else
                return existingApp.deleteOne({ app });
        })
    /*
    // Finds the user that meets the specified fields
    findUser: (researchFields, app) => User.findOne({ ...researchFields, app })
        .then(mongooseFormat),

    // Find user by name
    findUserById: (id) => User.findById(id)
        .then(mongooseFormat),

    // Returns all users for the provided app name
    findUserList: (app) => User.find({ app })
        .then((list) => list.map(mongooseFormat)),

    // Creates new user
    createUser: (user, isMaster, hashedPassword, hashedEmail) => new User({
        ...user,
        email: user?.email?.toLowerCase(),
        app: user?.app?.toLowerCase(),
        password: hashedPassword,
        level: isMaster ? 0 : 2,
        status: 0,
        confirmationId: hashedEmail
    }).save()
        .then(mongooseFormat),

    // Updates user data
    updateUser: (id, data) => User.findById(id).updateOne(data),

    // Deletes user
    deleteUser: (id, app) => User.findById(id)
        .then((user) => {
            if (user && user.app === app)
                return user.deleteOne();
            else
                throw "Unable to find this user";
        }),

    // Check confirmation process
    isConfirmationCorrect: (id, app, password, confirmationId) => User.findById(id)
        .then((user) => {
            if (user.confirmationId != confirmationId)
                throw "Unknown confirmation link";
            else if (user.app != app)
                throw "Unable to confirm unexisting account";
            else
                return compare(password, user.password);
        })
        .then((same) => {
            if (!same)
                throw "Password does not match account's password";
        }),*/
};

module.exports = mongoose;