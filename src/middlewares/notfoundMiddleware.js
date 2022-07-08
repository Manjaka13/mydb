const { failure } = require("../helpers/utils");

// Handle 404 errors
const notfoundMiddleware = (req, res) => res.json(failure("Invalid route", null, 0));

module.exports = notfoundMiddleware;
