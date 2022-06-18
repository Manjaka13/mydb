const router = require("express").Router();
const {
	createApp,
	dropApp,
	createAppTable,
	dropAppTable,
	pushAppTable,
	updateAppTable,
} = require("../controllers/jdbController");

/*
    JDB public API
*/

router.post("/create/:appName", createApp);
router.delete("/drop/:app", dropApp);
router.post("/create/:app/:table", createAppTable);
router.delete("/drop/:app/:tableId", dropAppTable);
router.post("/push/:app/:tableId", pushAppTable);
router.put("/update/:app/:tableId/:id", updateAppTable);

module.exports = { path: "/", router };
