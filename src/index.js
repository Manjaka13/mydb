require("dotenv").config();
const Express = require("express");
const cors = require("cors");
const { port } = require("./helpers/const");
const database = require("./services/mongoose");
const mydb = require("./routes/mydb");
const jsonerrorMiddleware = require("./middlewares/jsonerrorMiddleware");
const notfoundMiddleware = require("./middlewares/notfoundMiddleware");
const { authMiddleware } = require("./middlewares/authMiddleware");

/*
    Server entry point
*/

// Setup server
const app = Express();

// Middlewares
app.use(cors());
app.use(Express.urlencoded({ extended: true }));
app.use(Express.json());
app.use(jsonerrorMiddleware);
app.use(authMiddleware);

// Mount routes
app.use(mydb.path, mydb.router);
app.use(notfoundMiddleware);

// Connects to database
database
	.connect()
	.then(() => {
		// Awaiting for incoming request
		app.listen(port, () => {
			console.log(`Mydb running on port ${port}`);
		});
	})
	.catch((err) => console.error(err));
