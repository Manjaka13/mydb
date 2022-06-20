const { answer, getJDBVersion } = require("../helpers/utils");

/*
	Controller for server details
*/

const aboutController = {
	// Returns server version
	getVersion: (req, res) => res.json(answer("JDB version", getJDBVersion(), 1)),
};

module.exports = aboutController;
