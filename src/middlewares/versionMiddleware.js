const { answer, getJDBVersion, getVersionNumber } = require("../utils");

// Middleware for checking client's version
const versionMiddleware = (req, res, next) => {
	const { version } = req.body;
	if (!version)
		res.json(
			answer("Please provide your version of JDB interface (x.x.x)", null, 0)
		);
	else {
		const JDBVersion = getJDBVersion();
		if (getVersionNumber(version) != getVersionNumber(JDBVersion))
			res.json(
				answer("Your version is not matching JDB server version", JDBVersion, 0)
			);
		else next();
	}
};

module.exports = versionMiddleware;
