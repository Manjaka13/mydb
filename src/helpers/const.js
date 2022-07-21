/*
	Export constants from here
*/

const port = process.env.PORT || 3001;
const databaseUrl = process.env.DATABASE_HOST;
const databaseName = process.env.DATABASE_NAME;
const hauthUrl = process.env.HAUTH_URL;
const requestHeaders = {
	Accept: "application/json",
	"Content-Type": "application/json",
};
const restrictedFields = [
	"_id", "__v", "createdAt", "updatedAt"
];
const fieldTypes = {
	"number": Number,
	"string": String
};

module.exports = {
	port,
	databaseUrl,
	databaseName,
	requestHeaders,
	hauthUrl,
	restrictedFields,
	fieldTypes
};
