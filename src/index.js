require("dotenv").config();
const Express = require("express");
const fs = require("./filesystem");
const path = require("path");
const cors = require("cors");
const db = require("./db");
const { answer } = require("./utils");

/*
    Entry point
*/

// Setup server
const app = Express();
const port = process.env.PORT || 3001;

// Middlewares
app.use(cors());
app.use(Express.urlencoded({ extended: true }));
app.use(Express.json());

fs.readdir("folder")
.then((list) => {
	console.log(list);
	fs.write("result.json", JSON.stringify(list)).catch(err => console.error(err));
})
.catch(err => {
	console.error(err);
});

// db
// 	.listDatabases()
// 	.then(() => {
// 		console.log(db.list);
// 		return db.load("hari");
// 	})
// 	.then((res) => {
// 		console.log(res);
// 		db.table.push("hari", "social", {
// 			name: "Twitter",
// 			icon: "fatwitter",
// 		});
// 		return db.unload("hari");
// })
// .then((res) => console.log(res))
// .catch((err) => console.error(err));

// // Test JDB connection
// app.get("/", (req, res) => {
// 	let result = {};
// 	if (!db.initialized) result = answer("JDB offline.", null, 0);
// 	else result = answer("JDB online.", null, 1);
// 	res.json(result);
// });

// // Gets list of database
// app.get("/list", (req, res) => {
// 	let result = {};
// 	if (!db.initialized) result = answer("JDB offline.", null, 0);
// 	else
// 		result = answer(
// 			"Database list.",
// 			db.list.map((element) => db.getName(element)),
// 			1
// 		);
// 	res.json(result);
// });

// app.post("/createdb", (req, res) => {
// 	let { name } = req.body;
// 	let result = {};
// 	if (!db.initialized) result = answer("JDB offline.", null, 0);
// 	else if (typeof name != "string")
// 		result = answer("Missing parameter.", null, 0);
// 	else {
// 		let exists = false;
// 		name = name.toLowerCase();
// 		db.list.forEach((element) => {
// 			console.log(db.getName(element), name);
// 			if (db.getName(element) === name) exists = true;
// 		});
// 		if (exists)
// 			result = answer("A database with the same name already exists.", null, 0);
// 		else {
// 			fs.write(path.join("database", `${name}.db.json`), "{}");
// 			db.list.push(`${name}.db.json`);
// 			result = answer("Database created successfully !", null, 1);
// 		}
// 	}
// 	res.json(result);
// });
