require("dotenv").config();
const Express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const { port } = require("./helpers/const");
const aboutRoute = require("./routes/aboutRoute");
const databaseRoute = require("./routes/databaseRoute");
const jdbRoute = require("./routes/jdbRoute");
const authRoute = require("./routes/authRoute");
const versionMiddleware = require("./middlewares/versionMiddleware");
const jsonerrorMiddleware = require("./middlewares/jsonerrorMiddleware");
const notfoundMiddleware = require("./middlewares/notfoundMiddleware");

/*
    Entry point
*/

// Setup server
const app = Express();

// Middlewares
app.use(cors());
app.use(cookieParser());
app.use(Express.urlencoded({ extended: true }));
app.use(Express.json());
app.use(jsonerrorMiddleware);
app.use(versionMiddleware);
// Mount routes
app.use(aboutRoute.path, aboutRoute.router);
app.use(databaseRoute.path, databaseRoute.router);
app.use(jdbRoute.path, jdbRoute.router);
app.use(authRoute.path, authRoute.router);
app.use(notfoundMiddleware);

// Awaiting for API calls
app.listen(port, () => {
	console.log(`JDB server running on port ${port}`);
});
