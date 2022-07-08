const database = require("../interfaces/mongooseInterface");

/*
    Interface manipulation for JDB
*/

const jdbInterface = {
    // Creates new app
    createApp: (app) => database.createApp(app),

    // Drops app
    dropApp: (app) => database.dropApp(app),

    // Creates a new collection
    createTable: (app, name, fields) => database.createTable(app, name, fields),

    // Drops collection
    dropTable: (app, name) => database.dropTable(app, name)
};

module.exports = jdbInterface;
