const router = require("express").Router();
const { createApp, createAppTable } = require("../controllers/jdbController");

/*
    JDB public API
*/

router.post("/create/:app", createApp);
router.post("/create/:app/:table", createAppTable);

module.exports = { path: "/", router };
