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
const res = require("express/lib/response");

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
	// Deletes account by its email
	deleteAccount(email) {
		return request(`DELETE FROM _account WHERE email = "${email}"`);
	},
	// Deletes account by its id
	deleteAccountId(id) {
		return deleteFrom("_account", id);
	},
	// Checks if provided credentials are correct
	validateCredentials(email, password) {
		return getContent("_account").then((result) => {
			const account = result.filter((account) => account.email === email);
			return account && account.length === 1 && account[0].password === password
				? account[0].id
				: null;
		});
	},
	// Logs user in using email/password
	login(email, password) {
		return new Promise((resolve, reject) => {
			auth
				.validateCredentials(email, password)
				.then((id) => {
					let token = null;
					if (id) {
						const payload = {
							id,
							email,
						};
						token = jwt.sign(payload, authSecret, { expiresIn: "1h" });
					}
					resolve(token);
				})
				.catch((err) => reject(err));
		});
	},
	// Verifies token
	verify(token) {
		return new Promise((resolve, reject) => {
			if (!token) reject("Please provide a token");
			else {
				jwt.verify(token, authSecret, (err, decoded) => {
					if (err) reject("Invalid token, please login");
					else resolve(decoded);
				});
			}
		});
	},
	// Logs user out
	logout(res) {
		res.clearCookie("token");
		if (res?.locals?.user) delete res.locals.user;
	},
};

module.exports = auth;
