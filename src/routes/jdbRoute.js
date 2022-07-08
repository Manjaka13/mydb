const router = require("express").Router();
const Jdb = require("../controllers/jdbController");
const { isLoggedIn, isAdmin } = require("../middlewares/authMiddleware");

/*
	Authentication routes
*/

router.post("/create", isLoggedIn, isAdmin, Jdb.create);
router.delete("/drop", isLoggedIn, isAdmin, Jdb.drop);
router.post("/create/table/:name", isLoggedIn, isAdmin, Jdb.createTable);
router.delete("/drop/table/:name", isLoggedIn, isAdmin, Jdb.dropTable);
router.post("/insert/table/:name", isLoggedIn, isAdmin, Jdb.insert);

module.exports = { path: "/", router };
