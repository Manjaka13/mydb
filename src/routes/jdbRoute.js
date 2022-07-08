const router = require("express").Router();
const Jdb = require("../controllers/jdbController");
const { isLoggedIn } = require("../middlewares/authMiddleware");

/*
	Authentication routes
*/

router.post("/create", isLoggedIn, Jdb.create);
router.delete("/drop", isLoggedIn, Jdb.drop);

module.exports = { path: "/", router };
