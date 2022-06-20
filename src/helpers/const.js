const { v4 } = require("uuid");

/*
	Export constant variables from here
*/

const port = process.env.PORT || 3001;
const version = process.env.VERSION || "1.0.0";
const dbHost = process.env.DBHOST || "localhost";
const dbUser = process.env.DBUSER || "root";
const dbPassword = process.env.DBPASSWORD || "";
const dbName = process.env.DBNAME || "jdb";
const authSecret = process.env.AUTHSECRET || v4();

module.exports = {
	port,
	version,
	dbHost,
	dbUser,
	dbPassword,
	dbName,
	authSecret,
};
