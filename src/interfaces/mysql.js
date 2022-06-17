const { createConnection } = require("mysql");
const { dbHost, dbUser, dbPassword, dbName } = require("../helpers/const");

/*
   MySQL database communication interface
*/

const mysql = {
	// Request database
	request(req) {
		return new Promise((resolve, reject) => {
			const connection = createConnection({
				host: dbHost,
				user: dbUser,
				password: dbPassword,
				database: dbName,
			});
			connection.connect((err1) => {
				if (err1) reject(err1.sqlMessage);
				else {
					connection.query(req, (err2, result) => {
						if (err2) reject(err2.sqlMessage);
						else resolve(result);
					});
				}
			});
		});
	},

	// Get list of existing tables in the database
	getTables() {
		return new Promise((resolve, reject) => {
			mysql
				.request("SHOW TABLES")
				.then((result) => {
					resolve(result.map((item) => item["Tables_in_jdb"]));
				})
				.catch((err) => reject(err));
		});
	},

	// Creates new table
	createTable(tableName, fields) {
		return new Promise((resolve, reject) => {
			let error = null;
			let request = `CREATE TABLE ${tableName}(\n\tid INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,\n\t`;
			const props = !fields ? [] : Object.keys(fields);
			const values = !fields ? [] : Object.values(fields);
			const types = {
				string: "TEXT",
				number: "INT DEFAULT 0",
			};
			for (let i = 0; i < props.length; i++) {
				if (Object.keys(types).includes(values[i])) {
					request += `${props[i]} ${types[values[i]]}`;
					if (i < props.length - 1) request += ",\n\t";
					else request += "\n";
				} else {
					error = `Invalid type [${values[i]}]`;
					break;
				}
			}
			if (props.length === 0) reject("Please add at least one field");
			else if (error) reject(error);
			else {
				request += ") ENGINE=INNODB CHARACTER SET utf8 COLLATE utf8_general_ci;";
				mysql
					.request(request)
					.then(() => {
						resolve(`Table [${tableName}] created`);
					})
					.catch((err) => reject(err));
			}
		});
	},

	// Drops table
	dropTable(tableName) {
		return new Promise((resolve, reject) => {
			mysql
				.request(`DROP TABLE ${tableName};`)
				.then(() => {
					resolve(`Table [${tableName}] dropped`);
				})
				.catch((err) => reject(err));
		});
	},

	// Inserts data into table
	insertInto(tableName, data) {
		return new Promise((resolve, reject) => {
			let error = null;
			let request = `INSERT INTO ${tableName}(`;
			const props = !data ? [] : Object.keys(data);
			const values = !data ? [] : Object.values(data);
			for (let i = 0; i < props.length; i++) {
				request += `${props[i]}`;
				if (i < props.length - 1) request += ", ";
				else request += ") VALUES (";
			}
			for (let i = 0; i < values.length; i++) {
				request += `"${values[i]}"`;
				if (i < props.length - 1) request += ", ";
				else request += ");";
			}
			if (props.length === 0) reject("Please provide data to insert");
			else if (error) reject(error);
			else {
				mysql
					.request(request)
					.then((result) => {
						resolve(result.insertId);
					})
					.catch((err) => reject(err));
			}
		});
	},

	// Delete index in table
	deleteFrom(tableName, id) {
		return new Promise((resolve, reject) => {
			mysql
				.request(`DELETE FROM ${tableName} WHERE id=${id};`)
				.then(() => {
					resolve(`Deleted index [${id}] in [${tableName}]`);
				})
				.catch((err) => reject(err));
		});
	},

	// Displays table data
	getContent(tableName) {
		return new Promise((resolve, reject) => {
			mysql
				.request(`SELECT * FROM ${tableName};`)
				.then((result) => {
					resolve(result);
				})
				.catch((err) => reject(err));
		});
	},

	// Displays table data
	updateContent(tableName, id, newData) {
		return new Promise((resolve, reject) => {
			let error = null;
			let request = `UPDATE ${tableName} SET `;
			const props = !newData ? [] : Object.keys(newData);
			const values = !newData ? [] : Object.values(newData);
			for (let i = 0; i < props.length; i++) {
				request += `${props[i]} = "${values[i]}"`;
				if (i < props.length - 1) request += ", ";
				else request += ` WHERE id = ${id};`;
			}
			if (typeof id != "number") reject("Please provide valid id to be updated");
			else if (props.length === 0) reject("Please provide new data to update");
			else if (error) reject(error);
			else {
				// console.log(request);
				mysql
					.request(request)
					.then(() => {
						resolve(`Table ${tableName} data index [${id}] updated`);
					})
					.catch((err) => reject(err));
			}
		});
	},
};

module.exports = mysql;
