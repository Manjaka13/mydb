const { success, failure, processTableName } = require("../helpers/utils");
const Jdb = require("../interfaces/jdbInterface");
const { prohibitedFieldNames, prohibitedCollectionNames } = require("../helpers/const");

/*
	Controller for JDB
*/

const jdbController = {
	// Creates new app
	create: (req, res) => {
		const app = res.locals.user.app;
		Jdb.createApp(app)
			.then(() => res.json(success("Application created")))
			.catch(err => res.json(failure(err)));
	},

	// Drops an app
	drop: (req, res) => {
		const app = res.locals.user.app;
		Jdb.dropApp(app)
			.then(() => res.json(success("Application dropped")))
			.catch(err => res.json(failure(err)));
	},

	// Creates new app
	createTable: (req, res) => {
		const app = res.locals.user.app;
		let { name } = req.params;
		const fields = req.body;
		const types = ["string", "number"];
		name = processTableName(name);
		if (prohibitedCollectionNames.includes(name))
			res.json(failure("This collection name is prohibited"));
		else if (!fields || Object.keys(fields).length === 0)
			res.json(failure("Please provide collection fields and type"));
		else {
			let goodFields = 0;
			const keys = Object.keys(fields);
			for (let i = 0; i < keys.length; i++, goodFields++) {
				if (prohibitedFieldNames.includes(keys[i])) {
					res.json(failure("Some field name are prohibited"))
					break;
				}
				else if (!types.includes(fields[keys[i]].toLowerCase())) {
					res.json(failure("There are unknown field types"));
					break;
				}
			}
			if (goodFields === keys.length)
				Jdb.createTable(app, name, fields)
					.then(() => res.json(success("Table created")))
					.catch(err => res.json(failure(err)));
		}
	},

	// Drops table
	dropTable: (req, res) => {
		const app = res.locals.user.app;
		let { name } = req.params;
		name = processTableName(name);
		Jdb.dropTable(app, name)
			.then(() => res.json(success("Table dropped")))
			.catch(err => res.json(failure(err)));
	},
};

module.exports = jdbController;
