const { answer, getJDBVersion } = require("../utils");

const aboutController = {
	getVersion: (req, res) => res.json(answer("JDB version", getJDBVersion(), 1)),
};

module.exports = {
	getVersion: aboutController.getVersion,
};
