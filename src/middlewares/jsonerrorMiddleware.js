const { failure } = require("../helpers/utils");

// Handle JSON errors properly
const jsonerrorMiddleware = (err, req, res, next) => {
	if (err instanceof SyntaxError && err.status === 400 && "body" in err)
		res.json(failure(err.message, err));
	else
		next();
};

module.exports = jsonerrorMiddleware;
