const router = require("express").Router();
const {
	createApp,
	createAppTable,
	dropAppTable,
} = require("../controllers/jdbController");

/*
    JDB public API
*/

router.post("/create/:app", createApp);
router.post("/create/:app/:table", createAppTable);
router.delete("/drop/:app/:tableId", dropAppTable);

module.exports = { path: "/", router };
