const router = require("express").Router();
const { getVersion } = require("../controllers/aboutController");

/*
    Gets server informations
*/

router.get("/", getVersion);

module.exports = { path: "/version", router };
