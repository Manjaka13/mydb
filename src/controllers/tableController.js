const Database = require("../db.js");
const { listDatabase } = require("./databaseController");

// Init mysql
const db = new Database();

/*
CREATE TABLE client(
	id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
	ip TEXT NOT NULL,
	visits INT NOT NULL,
	banned BOOL DEFAULT false
) ENGINE=INNODB CHARACTER SET utf8 COLLATE utf8_general_ci;
*/

const types = {
	list: ["string", "number", "bool"],
	// MySQL code of each types
	string: "TEXT NOT NULL",
	number: "INT NOT NULL DEFAULT 0",
};

const table = {
	createTable: (database, name, fields) => {
		return new Promise((resolve, reject) => {
			if (database === "db" || name === "db") reject("[db] is a reserved keyword");
			else
				listDatabase()
					.then((list) => {
						if (list.includes(database)) {
							if (typeof name === "string" && name.length > 0) {
								let error = null;
								let req = `CREATE TABLE ${name}(\n\tid INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,\n\t_database CHAR(64) NOT NULL DEFAULT "${database}", `;
								const props = Object.keys(fields).map((field) => field.toLowerCase());
								for (let i = 0; i < props.length; i++) {
									fields[props[i]] = fields[props[i]].toLowerCase();
									if (props[i] === "id") {
										error = "The field [id] is a reserved name";
										break;
									}
									if (props[i] === "_database") {
										error = "The field [_database] is a reserved name";
										break;
									}
									if (!types.list.includes(fields[props[i]])) {
										error = `Unknown field type [${fields[props[i]]}]`;
										break;
									}
									req += `\n\t${props[i]} ${types[fields[props[i]]]}`;
									if (i < props.length - 1) req += ", ";
								}
								if (!error) {
									req += "\n) ENGINE=INNODB CHARACTER SET utf8 COLLATE utf8_general_ci;";
									//console.log(req);
									db
										.connect()
										.then(() => {
											return db.request(req);
										})
										.then(() => resolve())
										.catch((err) => reject(err.sqlMessage));
								} else reject(error);
							} else reject("Table name is invalid");
						} else reject(`Database [${database}] does not exist`);
					})
					.catch((err) => reject(err));
		});
	},
	dropTable: (database, name) => {
		return new Promise((resolve, reject) => {
			if (database === "db" || name === "db") reject("[db] is a reserved keyword");
			else {
				listDatabase()
					.then((list) => {
						if (list.includes(database)) {
							db
								.connect()
								.then(() => {
									return db.request(`SELECT _database FROM ${name} WHERE 1`);
								})
								.then((result) => {
									if (result[0]["_database"] === database) {
										db
											.request(`DROP TABLE ${name}`)
											.then(() => resolve())
											.catch((err) => reject(err.sqlMessage));
									} else
										reject(`Can not drop table [${name}] in database [${database}]`);
								})
								.catch((err) => {
									console.log(err);
									reject(err);
								});
						} else reject(`Database [${database}] does not exist`);
					})
					.catch((err) => reject(err));
			}
		});
	},
};

module.exports = {
	createTable: table.createTable,
	dropTable: table.dropTable,
};
