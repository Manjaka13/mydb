const fs = require("./filesystem");
const path = require("path");
const { isDatabase, answer } = require("./utils");

/*
    Manages all databases operations
*/

const db = {
	list: [],
	data: {},
	// List available databases in storage
	listDatabases: () => {
		return fs.readdir("database").then((list) => {
			db.list = list
				.filter((filename) => isDatabase(filename))
				.map((filename) => db.getName(filename));
		});
	},

	// Gets database filename from a name
	getFilename: (name) => {
		if (typeof name === "string") return `${name}.db.json`;
	},

	// Gets database name from a filename
	getName: (filename) => {
		if (typeof filename === "string") return filename.replace(".db.json", "");
	},

	// Loads a database into memory
	load: (name) => {
		return new Promise((resolve, reject) => {
			let found = false;
			for (let i = 0; i < db.list.length; i++)
				if (db.list[i] === name) {
					found = true;
					break;
				}
			if (!found) reject(answer(`Database [${name}] does not exist.`, null, 0));
			else if (db.data[name])
				return reject(answer(`Database [${name}] is already online.`));
			else {
				fs
					.read(path.join("database", db.getFilename(name)))
					.then((databaseContent) => {
						db.data[name] = JSON.parse(databaseContent);
						resolve(answer(`Database [${name}] is now online.`, null, 1));
					})
					.catch((err) => reject(err));
			}
		});
	},

	// Saves database in file
	save: (name) => {
		return new Promise((resolve, reject) => {
			if (!db.data[name]) reject(answer("Trying to save unmounted database."));
			else {
				fs
					.write(
						path.join("database", db.getFilename(name)),
						JSON.stringify(db.data[name])
					)
					.then(() => resolve(answer(`Database [${name}] saved !`, null, 1)))
					.catch((err) => reject(err));
			}
		});
	},

	// Unloads database from memory
	unload: (name) => {
		return new Promise((resolve, reject) => {
			if (typeof name != "string" || !db.data[name])
				reject(answer("Trying to unload unmounted database."));
			else {
				db
					.save(name)
					.then(() => resolve(answer("Successfully unmounted database.", null, 1)))
					.catch((err) => reject(err));
			}
		});
	},

	table: {
		// Gets table content
		get: (database, tableName) => {
			if (db?.data[database]) {
				if (typeof tableName === "string")
					return answer(
						`Table [${tableName}] content.`,
						db.data[database][tableName],
						1
					);
				else {
					let tableList = [];
					for (let k in db.data[database]) {
						tableList.push({
							name: k,
							type: Array.isArray(db.data[database][k]) ? "array" : "standard",
						});
					}
					return answer(`Database [${database}] tables.`, tableList, 1);
				}
			} else return answer(`Unable to retrieve table [${tableName}] content`);
		},
		// Pushes new data into an array inside a table
		push: (database, tableName, data) => {
			if (db?.data[database] && typeof tableName === "string" && data) {
				if (db.data[database][tableName]) {
					if (Array.isArray(db.data[database][tableName])) {
						db.data[database][tableName].push(data);
						return answer(
							`Pushed data into array table [${tableName}].`,
							db.data[database][tableName],
							1
						);
					} else
						return answer(
							`Can not do a push command on a non-array table [${tableName}].`
						);
				} else {
					db.data[database][tableName] = [];
					db.data[database][tableName].push(data);
					return answer(
						`Pushed data into array table [${tableName}].`,
						db.data[database][tableName],
						1
					);
				}
			} else return answer(`Unable to push data to array table [${tableName}].`);
		},
		// Overwrites table content with current data
		write: (database, tableName, data) => {
			if (db?.data[database] && typeof tableName === "string" && data) {
				db.data[database][tableName] = data;
				return answer(
					`Written data in table [${tableName}].`,
					db.data[database][tableName],
					1
				);
			} else return answer(`Unable to write data in table [${tableName}].`);
		},
		// Removes a table
		remove: (database, tableName) => {
			if (db?.data[database] && typeof tableName === "string" && tableName) {
				db.data[database][tableName] = undefined;
				return answer(`Removed table [${tableName}].`, null, 1);
			} else return answer(`Unable to remove table.`);
		},
	},

	// Drops a database
	drop: (database) => {
		return new Promise((resolve, reject) => {
			if (db?.data[database]) {
				fs
					.remove(path.join("database", db.getFilename(database)))
					.then(() => {
						db.data[database] = undefined;
						resolve(answer(`Database [${database}] dropped !`));
					})
					.catch((err) => reject(err));
			} else
				reject(answer(`Unable to drop database [${database}], it is unmounted.`));
		});
	},

	// Creates a new database
	create: (database) => {
		return new Promise((resolve, reject) => {
			if (db.data[database])
				reject(answer(`Database [${database}] already exists.`));
			else {
				fs
					.write(path.join("database", db.getFilename(database)), "{}")
					.then(() => {
						db.list.push(database);
						resolve(answer(`Database [${database}] created !`, null, 1));
					})
					.catch((err) => reject(err));
			}
		});
	},

	// Checks database status
	status: (database) => {
		return db.data[database]
			? answer(`Database [${database}] is online.`, null, 1)
			: answer(`Database [${database}] is offline.`);
	},
};

module.exports = db;
