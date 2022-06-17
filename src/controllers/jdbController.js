const {
	getTables,
	createTable,
	insertInto,
	getContent,
} = require("../interfaces/mysql");
const { answer } = require("../helpers/utils");

/*
    General JDB manipulations
*/

const jdb = {
	checkMainTable(req, res) {
		return getTables().then((result) => {
			if (!result.includes("_db"))
				return createTable("_db", { name: "string" }).then(() =>
					createTable("_table", { name: "string", db: "string" })
				);
		});
	},

	createApp(req, res) {
		const { app } = req.params;
		jdb
			.checkMainTable()
			.then(() => {
				return getContent("_db");
			})
			.then((list) => {
				if (list.map((item) => item.name).includes(app))
					res.json(answer(`App [${app}] already exists`, null, 0));
				else
					insertInto("_db", { name: app })
						.then(() => {
							res.json(answer(`App [${app}] created`, null, 1));
						})
						.catch((err) => res.json(answer(err, null, 0)));
			})
			.catch((err) => res.json(answer(err, null, 0)));
	},

	appExists(app) {
		return new Promise((resolve, reject) => {
			getContent("_db")
				.then((list) => {
					if (list.map((item) => item.name).includes(app)) resolve(true);
					else resolve(false);
				})
				.catch((err) => reject(err));
		});
	},

	createAppTable(req, res) {
		const { app, table } = req.params;
		jdb
			.checkMainTable()
			.then(() => jdb.appExists(app))
			.then((exists) => {
				if (!exists) res.json(answer(`App [${app}] does not exist`, null, 0));
				else {
					getContent("_table").then((list) => {
						if (list.map((item) => item.name).includes(table))
							res.json(
								answer(`Table [${table}] already exists on app [${app}]`, null, 0)
							);
						else
							insertInto("_table", { name: table, db: app })
								.then((id) => {
									console.log(id);
									res.json(answer(`Table [${table}] created on app [${app}]`, null, 1));
								})
								.catch((err) => res.json(answer(err, null, 0)));
					});
				}
			})
			.catch((err) => res.json(answer(err, null, 0)));
	},
};

module.exports = jdb;
