const router = require("express").Router();
const { answer } = require("../utils");
const {
	createDatabase,
	dropDatabase,
	listDatabase,
} = require("../controllers/databaseController");

router.get("/", (req, res) => {
	listDatabase()
		.then((result) => res.json(answer(`Database names on JDB`, result, 1)))
		.catch((err) => res.json(answer(err, null, 0)));
});

router.post("/:name", (req, res) => {
	const { name } = req.params;
	if (typeof name === "string")
		createDatabase(name)
			.then(() => res.json(answer(`Database [${name}] created !`, null, 1)))
			.catch((err) => res.json(answer(err, null, 0)));
	else res.json(answer("Database name not provided", null, 0));
});

router.delete("/:name", (req, res) => {
	const { name } = req.params;
	if (typeof name === "string")
		dropDatabase(name)
			.then(() => res.json(answer(`Database [${name}] dropped !`, null, 1)))
			.catch((err) => res.json(answer(err, null, 0)));
	else res.json(answer("Database name not provided", null, 0));
});

module.exports = { path: "/database", router };
