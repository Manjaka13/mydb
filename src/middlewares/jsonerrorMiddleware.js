const { answer } = require("../utils");

// Handle JSON errors properly
const jsonerrorMiddleware = (err, req, res, next) => {
	if (err instanceof SyntaxError && err.status === 400 && "body" in err)
		res.json(answer(err.message, err, 0));
	else next();
};

module.exports = jsonerrorMiddleware;
