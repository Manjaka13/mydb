const { answer } = require("../helpers/utils");
const { verify } = require("../interfaces/auth");

// Handle JSON errors properly
const authMiddleware = (req, res, next) => {
	const token = req.cookies.token;
	verify(token)
		.then((result) => {
			if (typeof result === "string") res.json(answer(result, null, 0));
			else {
				res.locals.user = result;
				console.log(result);
				next();
			}
		})
		.catch((err) => res.json(answer(err, null, 0)));
};

module.exports = authMiddleware;
