const database = require("../interfaces/mysql");
const { answer } = require("../helpers/utils");

/*
	Controller for direct database operations
*/

const databaseController = {
	// Run a request on a table
	request(req, res) {
		const { request } = req.body;
		if (typeof request === "string" && request.length > 0)
			database
				.request(request)
				.then((result) => {
					res.json(answer("Request result", result, 1));
				})
				.catch((err) => res.json(answer(err, null, 0)));
		else res.json(answer("Please provide request string", null, 0));
	},
	// Get list of existing tables in the database
	getTables(req, res) {
		database
			.getTables()
			.then((result) => {
				res.json(answer("Tables list in JDB", result, 1));
			})
			.catch((err) => res.json(answer(err, null, 0)));
	},
	// Creates new table
	createTable(req, res) {
		const { fields } = req.body;
		const { name } = req.params;
		database
			.createTable(name, fields)
			.then((result) => {
				res.json(answer(result, null, 1));
			})
			.catch((err) => res.json(answer(err, null, 0)));
	},
	// Drops table
	dropTable(req, res) {
		const { name } = req.params;
		database
			.dropTable(name)
			.then((result) => {
				res.json(answer(result, null, 1));
			})
			.catch((err) => res.json(answer(err, null, 0)));
	},
	// Inserts data into table
	insertInto(req, res) {
		const { data } = req.body;
		const { name } = req.params;
		database
			.insertInto(name, data)
			.then((result) => {
				res.json(answer(`Data inserted in table [${name}]`, { id: result }, 1));
			})
			.catch((err) => res.json(answer(err, null, 0)));
	},
	// Delete index in table
	deleteFrom(req, res) {
		const { name, id } = req.params;
		database
			.deleteFrom(name, id)
			.then((result) => {
				res.json(answer(result, null, 1));
			})
			.catch((err) => res.json(answer(err, null, 0)));
	},
	// Displays table data
	getContent(req, res) {
		const { name } = req.params;
		database
			.getContent(name)
			.then((result) => {
				res.json(answer("Table content", result, 1));
			})
			.catch((err) => res.json(answer(err, null, 0)));
	},
	// Displays table data
	updateContent(req, res) {
		const { data } = req.body;
		const { name, id } = req.params;
		database
			.updateContent(name, id, data)
			.then((result) => {
				res.json(answer(result, null, 1));
			})
			.catch((err) => res.json(answer(err, null, 0)));
	},
};

module.exports = databaseController;
