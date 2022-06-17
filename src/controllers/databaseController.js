const Database = require("../db.js");

// Init mysql
const db = new Database();

const database = {
	createDatabase: (name) => {
		return new Promise((resolve, reject) => {
			db
				.connect()
				.then(() => {
					return db.request(`INSERT INTO db(name) VALUES ("${name}")`);
				})
				.then(() => {
					resolve();
				})
				.catch((err) => reject(err.sqlMessage));
		});
	},
	dropDatabase: (name) => {
		return new Promise((resolve, reject) => {
			db
				.connect()
				.then(() => {
					return db.request(`DELETE FROM db WHERE name="${name}"`);
				})
				.then((result) => {
					console.log(result);
					if (result.affectedRows <= 0)
						reject(`Unable to drop unexisting database [${name}]`);
					else resolve();
				})
				.catch((err) => reject(err.sqlMessage));
		});
	},
	listDatabase: () => {
		return new Promise((resolve, reject) => {
			db
				.connect()
				.then(() => {
					return db.request(`SELECT * FROM db ORDER BY name`);
				})
				.then((result) => {
					if (result) resolve(result.map(({ name }) => name));
					else reject("Rejected !");
				})
				.catch((err) => reject(err.sqlMessage));
		});
	},
};

module.exports = {
	createDatabase: database.createDatabase,
	dropDatabase: database.dropDatabase,
	listDatabase: database.listDatabase,
};
