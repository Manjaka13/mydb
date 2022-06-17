const { answer } = require("../utils");

// Handle 404 errors properly
const notfoundMiddleware = (req, res) => {
	res.json(answer("Invalid route", null, 0));
};

module.exports = notfoundMiddleware;
