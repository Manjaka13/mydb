const database = require("../interfaces/mongooseInterface");

/*
    Interface manipulation for JDB
*/

const jdbInterface = {
    // Creates new app
    createApp: (app) => database.createApp(app),

    // Drops app
    dropApp: (app) => database.dropApp(app)
};

module.exports = jdbInterface;
