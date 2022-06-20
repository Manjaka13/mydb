const router = require("express").Router();
const {
	createAccount,
	deleteAccount,
	deleteAccountId,
	login,
} = require("../controllers/authController");

/*
    Gets server informations
*/

router.post("/create", createAccount);
router.delete("/delete", deleteAccount);
router.delete("/delete/:id", deleteAccountId);
router.post("/login", login);

module.exports = { path: "/account", router };
