const { success, failure } = require("../helpers/utils");
const Jdb = require("../interfaces/jdbInterface");

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
	}
};

module.exports = jdbController;
