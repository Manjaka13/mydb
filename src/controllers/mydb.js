const mongoose = require("mongoose");
const { success, failure, processTableName, checkFields, checkData } = require("../helpers/utils");
const Database = require("../services/mongoose");

/*
	Controller for JDB
*/

const mydbController = {
	// Creates new app
	createApp: (req, res) => {
		const app = res.locals.user.app;

		Database.createApp(app)
			.then(() => res.json(success("Application created")))
			.catch((err) => res.json(failure(err)));
	},

	// Creates table in the app
	createTable: (req, res) => {
		const app = res.locals.user.app;
		const { tableName } = req.params;
		const fields = req.body;

		try {
			if (!checkFields(fields))
				throw "Incorrect table fields or type";
			else if (!tableName)
				throw "Table name not provided";
			else {
				const name = processTableName(tableName);
				Database.createTable(app, name, JSON.stringify(fields))
					.then(() => res.json(success(`Table ${name} created`)))
					.catch((err) => res.json(failure(err)));
			}
		} catch (err) {
			res.json(failure(err));
		}
	},

	// Inserts data into table
	insertData: (req, res) => {
		const app = res.locals.user.app;
		const { tableName } = req.params;
		const data = req.body;
		let table = {};
		let id = null;

		try {
			if (!data)
				throw "No data was provided";
			else if (!tableName)
				throw "Please provide table name";
			else {
				Database.getTable(app, tableName)
					.then((d) => {
						table = { ...d, fields: JSON.parse(d.fields) };
						return checkData(data, table.fields);
					})
					.then((ok) => {
						if (!ok)
							throw "Provided data does not match the table schema";
						else
							return Database.insertData(table, data);
					})
					.then((d) => res.json(success("Data inserted", d)))
					.catch((err) => res.json(failure(err)));
			}
		} catch (err) {
			res.json(failure(err));
		}
	},

	// Gets all data in table
	getData: (req, res) => {
		const app = res.locals.user.app;
		const { tableName } = req.params;

		Database.getTable(app, tableName)
			.then((table) => {
				table.fields = JSON.parse(table.fields);
				return Database.getData(table);
			})
			.then((data) => res.json(success(`Table ${tableName}`, data)))
			.catch((err) => res.json(failure(err)));
	},

	// Returs table list
	getTableList: (req, res) => {
		const app = res.locals.user.app;

		Database.getTableList(app)
			.then((data) => res.json(success(`Table list for app ${app}`, data)))
			.catch((err) => res.json(failure(err)));
	},

	// Updates data in a table
	updateData: (req, res) => {
		const app = res.locals.user.app;
		const { tableName, id } = req.params;
		const data = req.body;
		let table = {};

		try {
			if (!data)
				throw "No data was provided";
			else if (!tableName)
				throw "Please provide table name";
			else {
				Database.getTable(app, tableName)
					.then((d) => {
						table = { ...d, fields: JSON.parse(d.fields) };
						return checkData(data, table.fields);
					})
					.then((ok) => {
						if (!ok)
							throw "Provided data does not match the table schema";
						else
							return Database.updateTable(table, id, data);
					})
					.then(() => res.json(success("Data updated")))
					.catch((err) => res.json(failure(err)));
			}
		} catch (err) {
			res.json(failure(err));
		}
	}
};

module.exports = mydbController;
