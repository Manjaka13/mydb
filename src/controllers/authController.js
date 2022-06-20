const { answer } = require("../helpers/utils");
const {
	createAccount,
	deleteAccount,
	deleteAccountId,
	login,
	logout,
} = require("../interfaces/auth");

const authController = {
	createAccount(req, res) {
		const { email, password } = req.body;
		return createAccount(email, password)
			.then((id) => {
				if (id) res.json(answer(`Account [${email}] created`, { id }, 1));
				else res.json(answer(`Account [${email}] already exists`, null, 0));
			})
			.catch((err) => res.json(answer(err, null, 0)));
	},
	deleteAccount(req, res) {
		const { email } = req.body;
		return deleteAccount(email)
			.then(() => res.json(answer(`Account [${email}] deleted`, null, 1)))
			.catch((err) => res.json(answer(err, null, 0)));
	},
	deleteAccountId(req, res) {
		const { id } = req.params;
		return deleteAccountId(id)
			.then(() => res.json(answer(`Account ID [${id}] deleted`, null, 1)))
			.catch((err) => res.json(answer(err, null, 0)));
	},
	login(req, res) {
		const { email, password } = req.body;
		login(email, password)
			.then((token) => {
				if (token)
					res
						.cookie("token", token, { httpOnly: true })
						.json(answer("Login successfull", { token }, 1));
				else res.json(answer("Invalid email or password", null, 0));
			})
			.catch((err) => res.json(answer(err, null, 0)));
	},
	logout(req, res) {
		logout(res);
		res.json(answer("Login out successfull", null, 1));
	},
};

module.exports = {
	createAccount: authController.createAccount,
	deleteAccount: authController.deleteAccount,
	deleteAccountId: authController.deleteAccountId,
	login: authController.login,
	logout: authController.logout,
};
