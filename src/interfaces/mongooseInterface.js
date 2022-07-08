const Mongoose = require("mongoose");
const App = require("../models/appModel");
const Collection = require("../models/collectionModel");
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
    createModel: (id, fields) => {
        let schema = {};
        const keys = Object.keys(fields);
        keys.forEach((field) => {
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
        return Mongoose.model(JSON.parse(JSON.stringify(id)), new Mongoose.Schema(schema));
    },

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
        }),

    // Creates table
    createTable: (app, name, fields) => App.findOne({ app })
        .then((existingApp) => {
            if (!existingApp)
                throw `Application ${app} does not exist`;
            else
                return Collection.findOne({ name });
        })
        .then((existingTable) => {
            if (existingTable)
                throw `Table ${name} already exists`;
            else
                return new Collection({
                    app,
                    name,
                    fields: JSON.stringify(fields),
                }).save()
        }),

    // Creates table
    dropTable: (app, name) => Collection.find({ name })
        .then((existingTable) => {
            return existingTable ? existingTable.filter((table) => table.name === name && table.app === app) : null;
        })
        .then((table) => {
            if (!table || table.length === 0)
                throw `Table ${name} does not exist`;
            else
                return table[0].deleteOne();
        }),

    // Inserts data
    insert: (app, name, data) => Collection.find({ name })
        .then((existingTable) => {
            return existingTable ? existingTable.filter((table) => table.name === name && table.app === app) : null;
        })
        .then((table) => {
            if (!table || table.length === 0)
                throw `Table ${name} does not exist`;
            else
                return { ...table[0]._doc };
        })
        .then((table) => {
            table.fields = JSON.parse(table.fields);
            const dataKeys = Object.keys(data);
            const fieldKeys = Object.keys(table.fields);
            let fieldsOk = 0;
            for (let i = 0; i < fieldKeys.length; i++)
                if (dataKeys.includes(fieldKeys[i]))
                    fieldsOk++;
            if (fieldsOk != fieldKeys.length)
                throw "Data does not match provided colletion schema";
            else {
                const model = mongoose.createModel(table._id, table.fields);
                return new model(data).save();
            }
        }),



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