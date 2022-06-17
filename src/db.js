const mysql = require("mysql");

/*
	Class that handles database connections
*/
class Database {
	connect() {
		return new Promise((resolve, reject) => {
			this.db = mysql.createConnection({
				host: "localhost",
				user: "root",
				password: "",
				database: "jdb",
			});
			this.db.connect((err) => {
				if (err) reject(err);
				else resolve();
			});
		});
	}
	request(req) {
		return new Promise((resolve, reject) => {
			this.db.query(req, (err, result) => {
				if (err) reject(err);
				else resolve(result);
			});
		});
	}
}

module.exports = Database;
