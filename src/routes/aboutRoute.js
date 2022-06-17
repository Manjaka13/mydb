const router = require("express").Router();
const { getVersion } = require("../controllers/aboutController");

router.get("/", getVersion);

module.exports = { path: "/", router };
