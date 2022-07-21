const router = require("express").Router();
const Mydb = require("../controllers/mydb");
const { isLoggedIn, isAdmin } = require("../middlewares/authMiddleware");

/*
	Authentication routes
*/

// Create
router.post("/create/app", isLoggedIn, isAdmin, Mydb.createApp);
router.post("/create/table/:tableName", isLoggedIn, isAdmin, Mydb.createTable);
router.post("/insert/table/:tableName", isLoggedIn, isAdmin, Mydb.insertTable);

// Read
router.get("/get/app", isLoggedIn, isAdmin, Mydb.getAppList);
router.get("/get/table", isLoggedIn, isAdmin, Mydb.getTableList);
router.get("/get/table/:tableName", isLoggedIn, isAdmin, Mydb.getTableContent);

// Update
router.put("/update/table/:tableName/:id", isLoggedIn, isAdmin, Mydb.updateTable);

// Delete
router.delete("/remove/table/:tableName", isLoggedIn, isAdmin, Mydb.removeTable);
router.delete("/remove/table/:tableName/:id", isLoggedIn, isAdmin, Mydb.removeTableItem);

module.exports = { path: "/", router };
