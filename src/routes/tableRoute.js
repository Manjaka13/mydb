const router = require("express").Router();
const { answer } = require("../utils");
const { createTable, dropTable } = require("../controllers/tableController");

router.post("/:database/:table", (req, res) => {
	const { database, table } = req.params;
	const { fields } = req.body;
	createTable(database, table, fields)
		.then(() =>
			res.json(
				answer(`Table [${table}] created in database [${database}] !`, null, 1)
			)
		)
		.catch((err) => res.json(answer(err, null, 0)));
});

router.delete("/:database/:table", (req, res) => {
	const { database, table } = req.params;
	dropTable(database, table)
		.then((result) => res.json(answer(`Table [${table}] dropped !`, null, 1)))
		.catch((err) => res.json(answer(err, null, 0)));
});

module.exports = { path: "/database", router };
