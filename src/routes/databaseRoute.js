const router = require("express").Router();
const {
	request,
	getTables,
	createTable,
	dropTable,
	insertInto,
	deleteFrom,
	getContent,
	updateContent,
} = require("../controllers/databaseController");
const authMiddleware = require("../middlewares/authMiddleware");

/*
	Database direct CRUD operations
*/

router.post("/request", authMiddleware, request);
router.post("/table/create/:name", authMiddleware, createTable);
router.delete("/table/drop/:name", authMiddleware, dropTable);
router.post("/table/insert/:name", authMiddleware, insertInto);
router.get("/table/get", authMiddleware, getTables);
router.get("/table/get/:name", authMiddleware, getContent);
router.put("/table/update/:name/:id", authMiddleware, updateContent);
router.delete("/table/delete/:name/:id", authMiddleware, deleteFrom);

module.exports = { path: "/database", router };
