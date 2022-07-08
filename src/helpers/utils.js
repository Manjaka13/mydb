/*
	Various usefull functions
*/

// Returns server result as JSON
const answer = (caption, payload, status) => ({
	status:
		typeof status === "number" && (status === 1 || status === 0) ? status : 0,
	payload: payload ? payload : undefined,
	caption: typeof caption === "string" ? caption : undefined,
});

// Returns catched error
const failure = (err) => answer(err?._message ? err._message : typeof err === "string" ? err : "An error occured");

// Returns good answer
const success = (caption, payload) => answer(caption, payload, 1);

// Checks if email is valid
const isValidEmail = (email) => (
	typeof email === "string" &&
	email
		.toLowerCase()
		.match(
			/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
		)
);

// Format mongoose data
const mongooseFormat = (data) => data ? ({ ...data._doc, id: data.id, _id: undefined }) : null;

// Processes table name
const processTableName = (name) => {
	name = name.toLowerCase().split("");
	name[0] = name[0].toUpperCase();
	return name.join("");
};

module.exports = {
	answer,
	success,
	failure,
	isValidEmail,
	mongooseFormat,
	processTableName
};
