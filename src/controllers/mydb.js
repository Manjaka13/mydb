const { success, failure, processTableName, checkFields } = require("../helpers/utils");
const Database = require("../services/mongoose");
const Mydb = require("../services/mydb");

/*
	Controller for JDB
*/

const mydbController = {
	// Creates new app
	createApp: (req, res) => {
		const app = res.locals.user.app;
		Mydb.createApp(app)
			.then(() => res.json(success(`Application ${app} created`)))
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
				Mydb.createTable(app, processTableName(tableName), JSON.stringify(fields))
					.then(() => res.json(success(`Table ${processTableName(tableName)} created`)))
					.catch((err) => res.json(failure(err)));
			}
		} catch (err) {
			res.json(failure(err));
		}
	},

	// Returns app list
	getAppList: (req, res) => {
		Mydb.getAppList()
			.then((result) => res.json(success("App list", result)))
			.catch((err) => res.json(failure(err)));
	},

	// Returs table list
	getTableList: (req, res) => {
		const app = res.locals.user.app;
		Mydb.getTableList(app)
			.then((result) => res.json(success(`Table list for app ${app}`, result)))
			.catch((err) => res.json(failure(err)));
	},

	// Returns table content
	getTableContent: (req, res) => {
		const app = res.locals.user.app;
		const { tableName } = req.params;

		Mydb.getTableContent(app, tableName)
			.then((result) => res.json(success(`Table ${tableName}`, result)))
			.catch((err) => res.json(failure(err)));
	},

	// Inserts data into table
	insertTable: (req, res) => {
		const app = res.locals.user.app;
		const { tableName } = req.params;
		const data = req.body;
		try {
			if (!data)
				throw "No data was provided";
			else if (!tableName)
				throw "Please provide table name";
			else {
				Mydb.insertTable(app, tableName, data)
					.then((result) => res.json(success("Data inserted", result)))
					.catch((err) => res.json(failure(err)));
			}
		} catch (err) {
			res.json(failure(err));
		}
	},

	updateTable: (req, res) => {
		const app = res.locals.user.app;
		const { tableName, id } = req.params;
		const data = req.body;
		try {
			if (!data)
				throw "No data was provided";
			else if (!tableName)
				throw "Please provide table name";
			else {
				Mydb.updateTable(app, tableName, id, data)
					.then(() => res.json(success("Data updated")))
					.catch((err) => res.json(failure(err)));
			}
		} catch (err) {
			res.json(failure(err));
		}
	},

	// Removes an table
	removeTable: (req, res) => {
		const app = res.locals.user.app;
		const { tableName } = req.params;
		try {
			if (!tableName)
				throw "Please provide table name";
			else {
				Mydb.removeTable(app, tableName)
					.then(() => res.json(success("Table removed")))
					.catch((err) => res.json(failure(err)));
			}
		} catch (err) {
			res.json(failure(err));
		}
	},

	// Removes an item in a table
	removeTableItem: (req, res) => {
		const app = res.locals.user.app;
		const { tableName, id } = req.params;
		try {
			if (!tableName)
				throw "Please provide table name";
			else {
				Mydb.removeTableItem(app, tableName, id)
					.then(() => res.json(success("Data removed")))
					.catch((err) => res.json(failure(err)));
			}
		} catch (err) {
			res.json(failure(err));
		}
	}
};

module.exports = mydbController;
