const { answer } = require("../helpers/utils");
const { clientUrl } = require("../helpers/const");
const {
	createAccount,
	deleteAccount,
	deleteAccountId,
	login,
	logout,
	verify
} = require("../interfaces/auth");

/*
	Controller for authentication
*/

const authController = {
	// Creates new account
	createAccount(req, res) {
		const { email, password } = req.body;
		return createAccount(email, password)
			.then((id) => {
				if (id) res.json(answer(`Account [${email}] created`, { id }, 1));
				else res.json(answer(`Account [${email}] already exists`, null, 0));
			})
			.catch((err) => res.json(answer(err, null, 0)));
	},
	// Deletes existing account
	deleteAccount(req, res) {
		const { email } = req.body;
		return deleteAccount(email)
			.then(() => res.json(answer(`Account [${email}] deleted`, null, 1)))
			.catch((err) => res.json(answer(err, null, 0)));
	},
	// Deletes existing account using its id
	deleteAccountId(req, res) {
		const { id } = req.params;
		return deleteAccountId(id)
			.then(() => res.json(answer(`Account ID [${id}] deleted`, null, 1)))
			.catch((err) => res.json(answer(err, null, 0)));
	},
	// Login using email/password
	login(req, res) {
		const { email, password } = req.body;
		login(email, password)
			.then((token) => {
				if (token)
					res.setHeader("Access-Control-Allow-Origin", clientUrl)
					.setHeader("Access-Control-Allow-Credentials", true)
						.cookie("token", token, { httpOnly: true })
						.json(answer("Login successfull", { token }, 1));
				else res.json(answer("Invalid email or password", null, 0));
			})
			.catch((err) => res.json(answer(err, null, 0)));
	},
	// Logout
	logout(req, res) {
		logout(res);
		res.json(answer("Login out successfull", null, 1));
	},
	// Verifies token
	verify(req, res) {
		const authHeader = req.headers["Authorization"];
		const token = authHeader && authHeader.split(" ")[1];
		if(!token)
			res.json(answer("No token provided", null, 0));
		else
			verify(token)
				.then((user) => res.json(answer("Authenticated user", user, 1)))
				.catch((err) => res.json(answer(err, null, 0)));
	}
};

module.exports = authController;
