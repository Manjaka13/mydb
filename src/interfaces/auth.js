const { v4 } = require("uuid");
const jwt = require("jsonwebtoken");
const { isValidEmail } = require("../helpers/utils");
const { authSecret } = require("../helpers/const");
const {
	getTables,
	createTable,
	getContent,
	insertInto,
	deleteFrom,
	request,
} = require("./mysql");

/*
    Authentication inteface
*/

const auth = {
	// Creates account table
	setupMainTable() {
		return getTables().then((result) => {
			if (!result.includes("_account"))
				return createTable("_account", { email: "string", password: "string" });
		});
	},
	// Checks if an account already exists
	accountExists(email) {
		return getContent("_account").then((result) =>
			result.map((item) => item.email).includes(email)
		);
	},

	// Creates new account
	createAccount(email, password) {
		return new Promise((resolve, reject) => {
			if (!isValidEmail(email)) reject("Invalid e-mail");
			else if (typeof password != "string" || password.length < v4().length)
				reject("Invalid password");
			else
				isValidEmail(email) &&
					typeof password === "string" &&
					password.length >= v4().length;
			auth
				.setupMainTable()
				.then(() => auth.accountExists(email))
				.then((exists) => {
					if (!exists) {
						insertInto("_account", {
							email,
							password,
						})
							.then((id) => resolve(id))
							.catch((err) => reject(err));
					} else resolve();
				})
				.catch((err) => reject(err));
		});
	},

	deleteAccount(email) {
		return request(`DELETE FROM _account WHERE email = "${email}"`);
	},

	deleteAccountId(id) {
		return deleteFrom("_account", id);
	},

	isValidCredentials(email, password) {
		return getContent("_account").then((result) => {
			const account = result.filter((account) => account.email === email);
			return account && account.length === 1 && account[0].password === password;
		});
	},

	login(email, password) {
		return new Promise((resolve, reject) => {
			auth
				.isValidCredentials(email, password)
				.then((valid) => {
					if (!valid) resolve(false);
					else resolve(true);
				})
				.catch((err) => reject(err));
		});
	},
};

module.exports = auth;
