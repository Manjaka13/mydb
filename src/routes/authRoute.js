const router = require("express").Router();
const {
	createAccount,
	deleteAccount,
	deleteAccountId,
	login,
	logout,
	verify
} = require("../controllers/authController");
const authMiddleware = require("../middlewares/authMiddleware");

/*
    Authentication routes
*/

router.post("/create", authMiddleware, createAccount);
router.delete("/delete", authMiddleware, deleteAccount);
router.delete("/delete/:id", authMiddleware, deleteAccountId);
router.post("/login", login);
router.post("/logout", logout);
router.post("/verify", verify);

module.exports = { path: "/account", router };
