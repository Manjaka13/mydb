const router = require("express").Router();
const {
	createAccount,
	deleteAccount,
	deleteAccountId,
	login,
	logout,
} = require("../controllers/authController");
const authMiddleware = require("../middlewares/authMiddleware");

/*
    Gets server informations
*/

router.post("/create", authMiddleware, createAccount);
router.delete("/delete", authMiddleware, deleteAccount);
router.delete("/delete/:id", authMiddleware, deleteAccountId);
router.post("/login", login);
router.post("/logout", logout);

module.exports = { path: "/account", router };
