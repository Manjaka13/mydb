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

router.post("/request", request);
router.post("/table/create/:name", createTable);
router.delete("/table/drop/:name", dropTable);
router.post("/table/insert/:name", insertInto);
router.get("/table/get", getTables);
router.get("/table/get/:name", getContent);
router.put("/table/update/:name/:id", updateContent);
router.delete("/table/delete/:name/:id", deleteFrom);

module.exports = { path: "/database", router };
