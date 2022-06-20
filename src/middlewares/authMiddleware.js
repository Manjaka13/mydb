const { answer } = require("../helpers/utils");
const { verify } = require("../interfaces/auth");

// Protects secret routes
const authMiddleware = (req, res, next) => {
	const token = req.cookies.token;
	verify(token)
		.then((result) => {
			if (typeof result === "string") res.json(answer(result, null, 0));
			else {
				res.locals.user = result;
				next();
			}
		})
		.catch((err) => res.json(answer(err, null, 0)));
};

module.exports = authMiddleware;
