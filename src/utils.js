/*
    Various usefull functions
*/

// Returns server result as JSON
const answer = (caption, payload, status) => {
	let message = {
		status:
			typeof status === "number" && (status === 1 || status === 0) ? status : 0,
	};
	if (typeof caption === "string") message.caption = caption;
	if (payload) message.payload = payload;
	return message;
};

// Checks if a filename is a database
const isDatabase = (filename) =>
	filename.match(new RegExp(/^[a-z]+.db.json$/)) ? true : false;

module.exports = { answer, isDatabase };
