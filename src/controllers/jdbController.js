const {
	request,
	getTables,
	createTable,
	dropTable,
	insertInto,
	getContent,
	deleteFrom,
	updateContent,
} = require("../interfaces/mysql");
const { answer } = require("../helpers/utils");

/*
    General JDB manipulations
*/

const jdb = {
	// Creates necessary tables
	setupMainTables() {
		return new Promise((resolve, reject) => {
			getTables()
				.then((result) => {
					if (!result.includes("_db"))
						createTable("_db", { name: "string" })
							.then(() => createTable("_table", { name: "string", db: "string" }))
							.then(() => resolve())
							.catch((err) => reject(err));
					else resolve();
				})
				.catch((err) => reject(err));
		});
	},
	// Checks if a table contains a certain value
	tableContains(table, str) {
		return getContent(table).then((list) =>
			list.map((item) => item.id).includes(str)
		);
	},
	// Checks if the app exists
	appExists(app) {
		return jdb.tableContains("_db", app);
	},
	// Checks if the table exists
	tableExists(table) {
		return jdb.tableContains("_table", table);
	},
	// Checks if the table exists by its id
	tableExistsId(tableId) {
		return request(`SELECT id from _table WHERE id = "${tableId}"`).then(
			(result) => result.length > 0
		);
	},

	createApp(req, res) {
		const { appName } = req.params;
		jdb
			.setupMainTables()
			.then((appExists) => {
				if (appExists) res.json(answer(`App [${appName}] already exists`, null, 0));
				else
					insertInto("_db", { name: appName })
						.then((result) =>
							res.json(answer(`App [${appName}] created`, { id: result }, 1))
						)
						.catch((err) => res.json(answer(err, null, 0)));
			})
			.catch((err) => res.json(answer(err, null, 0)));
	},

	dropApp(req, res) {
		const { app } = req.params;
		request(`SELECT * FROM _table WHERE db = "${app}"`)
			.then((list) => {
				let promises = [];
				list.forEach((item) => {
					promises.push(
						dropTable(item.id.split("-").join(""))
							.then(() => deleteFrom("_table", item.id))
							.catch((err) => res.json(answer(err, null, 0)))
					);
				});
				Promise.all(promises)
					.then(() => res.json(answer(`App [${app}] deleted`, null, 1)))
					.catch((err) => res.json(answer(err, null, 0)));
			})
			.catch((err) => res.json(answer(err, null, 0)));

		// deleteFrom("_db", app)
		// 	.then(() => request(`SELECT * FROM _table WHERE db = "${app}"`))
		// 	.then((list) => {
		// 		console.log(list);
		// 		res.json("helo");
		// 	})
		// 	.catch((err) => res.json(answer(err, null, 0)));
	},

	createAppTable(req, res) {
		const { app, table } = req.params;
		const { fields } = req.body;
		let tableId = null;
		jdb
			.appExists(app)
			.then((appExists) => {
				if (!appExists) res.json(answer(`App [${app}] does not exist`, null, 0));
				else {
					jdb.tableContains("_table", table).then((tableExists) => {
						if (tableExists)
							res.json(
								answer(`Table [${table}] already exists on app [${app}]`, null, 0)
							);
						else {
							insertInto("_table", { name: table, db: app })
								.then((id) => {
									tableId = id;
									id = id.split("-").join("");
									return createTable(id, fields);
								})
								.then(() => {
									res.json(
										answer(`Table [${table}] created on app [${app}]`, { id: tableId }, 1)
									);
								})
								.catch((err) => {
									deleteFrom("_table", tableId).then(() =>
										res.json(answer(err, null, 0))
									);
								});
						}
					});
				}
			})
			.catch((err) => res.json(answer(err, null, 0)));
	},

	dropAppTable(req, res) {
		const { app, tableId } = req.params;
		jdb
			.appExists(app)
			.then((appExists) => {
				if (!appExists) res.json(answer(`App [${app}] does not exist`, null, 0));
				else {
					jdb
						.tableExistsId(tableId)
						.then((tableExists) => {
							if (!tableExists)
								res.json(answer(`Table index [${tableId}] does not exists`, null, 0));
							else {
								dropTable(tableId.split("-").join(""))
									.then(() => deleteFrom("_table", tableId))
									.then(() =>
										res.json(answer(`Table index [${tableId}] dropped`, null, 0))
									)
									.catch((err) => res.json(answer(err, null, 0)));
							}
						})
						.catch((err) => res.json(answer(err, null, 0)));
				}
			})
			.catch((err) => res.json(answer(err, null, 0)));
	},

	pushAppTable(req, res) {
		const { app, tableId } = req.params;
		const { fields } = req.body;
		jdb
			.appExists(app)
			.then((appExists) => {
				if (!appExists) res.json(answer(`App [${app}] does not exist`, null, 0));
				else {
					jdb
						.tableExistsId(tableId)
						.then((tableExists) => {
							if (tableExists) {
								insertInto(tableId.split("-").join(""), fields)
									.then((id) =>
										res.json(answer(`Data pushed into index [${tableId}]`, id, 0))
									)
									.catch((err) => res.json(answer(err, null, 0)));
							} else
								res.json(answer(`Table index [${tableId}] does not exists`, null, 0));
						})
						.catch((err) => res.json(answer(err, null, 0)));
				}
			})
			.catch((err) => res.json(answer(err, null, 0)));
	},

	updateAppTable(req, res) {
		const { app, tableId, id } = req.params;
		const { fields } = req.body;
		jdb
			.appExists(app)
			.then((appExists) => {
				if (!appExists) res.json(answer(`App [${app}] does not exist`, null, 0));
				else {
					jdb
						.tableExistsId(tableId)
						.then((tableExists) => {
							if (tableExists) {
								updateContent(tableId.split("-").join(""), id, fields)
									.then(() =>
										res.json(
											answer(
												`Data updated in index [${id}] of table [${tableId}]`,
												null,
												1
											)
										)
									)
									.catch((err) => res.json(answer(err, null, 0)));
							} else
								res.json(answer(`Table index [${tableId}] does not exists`, null, 0));
						})
						.catch((err) => res.json(answer(err, null, 0)));
				}
			})
			.catch((err) => res.json(answer(err, null, 0)));
	},
};

module.exports = jdb;
