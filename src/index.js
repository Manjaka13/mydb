require("dotenv").config();
const Express = require("express");
//const fs = require("./filesystem");
//const path = require("path");
const cors = require("cors");
const aboutRoute = require("./routes/aboutRoute");
const databaseRoute = require("./routes/databaseRoute");
const tableRoute = require("./routes/tableRoute");
const versionMiddleware = require("./middlewares/versionMiddleware");
const jsonerrorMiddleware = require("./middlewares/jsonerrorMiddleware");
const notfoundMiddleware = require("./middlewares/notfoundMiddleware");

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
app.use(jsonerrorMiddleware);
app.use(versionMiddleware);
// Mount routes
app.use(aboutRoute.path, aboutRoute.router);
app.use(databaseRoute.path, databaseRoute.router);
app.use(tableRoute.path, tableRoute.router);
app.use(notfoundMiddleware);

// Awaiting for API calls
app.listen(port, () => {
	console.log(`JDB server running on port ${port}`);
});
