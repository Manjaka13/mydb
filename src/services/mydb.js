const Database = require("./mongoose");
const model = require("../models/");
const { checkData } = require("../helpers/utils");

/*
    Service for Mydb
*/

const mydbService = {
    createApp: (app) => Database.find(model.App, { name: app })
        .then((exist) => {
            if (exist)
                throw `Application ${app} already exists`;
            else
                return new model.App({ name: app }).save();
        }),

    createTable: (app, tableName, fields) => Database.find(model.App, { name: app })
        .then((exist) => {
            if (!exist)
                throw `Application ${app} does not exist yet`;
            else
                return Database.find(model.Table, { name: tableName, app });
        })
        .then((exist) => {
            if (exist)
                throw `This table already exists`;
            else
                return new model.Table({ app, name: tableName, fields }).save();
        }),

    getAppList: () => Database.findAll(model.App),

    getTableList: (app) => Database.findAll(model.Table, { app }),

    getTableContent: (app, tableName) => Database.getTable(app, tableName)
        .then((table) => Database.findAll(model.get(table.id, JSON.parse(table.fields)))),

    insertTable: (app, tableName, data) => {
        let fields, id;
        return Database.find(model.Table, { app, name: tableName })
            .then((result) => {
                fields = JSON.parse(result.fields);
                id = result.id;
                return checkData(data, fields);
            })
            .then((dataOk) => {
                if (!dataOk)
                    throw "Provided data does not match the table schema";
                else {
                    let tb = model.get(id, fields);
                    return new tb(data).save();
                }
            });
    },

    updateTable: (app, tableName, itemId, data) => {
        let fields, id;
        return Database.find(model.Table, { app, name: tableName })
            .then((result) => {
                if (!result)
                    throw `Table ${tableName} does not exist`;
                else {
                    fields = JSON.parse(result.fields);
                    id = result.id;
                    return checkData(data, fields);
                }
            })
            .then((dataOk) => {
                if (!dataOk)
                    throw "Provided data does not match the table schema";
                else {
                    let tb = model.get(id, fields);
                    return tb.findById(itemId);
                }
            })
            .then((item) => {
                if (!item || JSON.parse(JSON.stringify(item.id)) != itemId)
                    throw `Item id ${itemId} not found`;
                else
                    return item.updateOne(data);
            });
    },

    removeTable: (app, tableName) => {
        let id;
        return Database.find(model.Table, { app, name: tableName })
            .then((result) => {
                if (!result)
                    throw `Table ${tableName} does not exist`;
                else {
                    id = result.id;
                    return result.deleteOne();
                }
            })
            .then(() => Database.removeTable(id));
    },

    removeTableItem: (app, tableName, itemId) => Database.find(model.Table, { app, name: tableName })
        .then((result) => {
            if (!result)
                throw `Table ${tableName} does not exist`;
            else {
                let tb = model.get(result.id, JSON.parse(result.fields));
                return tb.findById(itemId);
            }
        })
        .then((item) => {
            if (!item || JSON.parse(JSON.stringify(item.id)) != itemId)
                throw `Item id ${itemId} not found`;
            else
                return item.deleteOne();
        }),
};

module.exports = mydbService;