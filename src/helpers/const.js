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
const prohibitedFieldNames = ["__v", "_id", "createdAt", "updatedAt"];
const prohibitedCollectionNames = [
	"Model", "Models",
	"App", "Apps",
	"Collection", "Collections"
];

module.exports = {
	port,
	databaseUrl,
	databaseName,
	prohibitedFieldNames,
	prohibitedCollectionNames,
	requestHeaders,
	hauthUrl
};
