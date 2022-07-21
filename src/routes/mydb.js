const router = require("express").Router();
const Mydb = require("../controllers/mydb");
const { isLoggedIn, isAdmin } = require("../middlewares/authMiddleware");

/*
	Authentication routes
*/

router.post("/create/app", isLoggedIn, isAdmin, Mydb.createApp);
router.post("/create/table/:tableName", isLoggedIn, isAdmin, Mydb.createTable);
router.get("/get/table", isLoggedIn, isAdmin, Mydb.getTableList);
router.post("/insert/table/:tableName", isLoggedIn, isAdmin, Mydb.insertData);
router.get("/get/table/:tableName", isLoggedIn, isAdmin, Mydb.getData);
router.put("/update/table/:tableName/:id", isLoggedIn, isAdmin, Mydb.updateData);

module.exports = { path: "/", router };
