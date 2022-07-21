const { restrictedFields, fieldTypes } = require("./const");
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
const mongooseFormat = (data) => data ? ({ ...data._doc, id: data.id, _id: undefined, __v: undefined, createdAt: undefined, updatedAt: undefined }) : null;

// Processes table name
const processTableName = (name) => {
	name = name.toLowerCase().trim().split("");
	name[0] = name[0].toUpperCase();
	return name.join("");
};

// Checks fields keys name
const checkFields = (fields) => {
	if (fields) {
		const keys = Object.keys(fields);
		if (keys.length > 0) {
			for (let i = 0; i < keys.length; i++)
				if (restrictedFields.includes(keys[i]) || !Object.keys(fieldTypes).includes(fields[keys[i]].toLowerCase()))
					return false;
			return true;
		}
	}
	return false;
};

// Checks if provided data matches the table schema
const checkData = (data, fields) => {
	if (data) {
		const fieldsKeys = Object.keys(fields);
		const keys = Object.keys(data);
		if (keys.length > 0) {
			for (let i = 0; i < keys.length; i++)
				if (!fieldsKeys.includes(keys[i]) || typeof data[keys[i]] != fields[keys[i]])
					return false;
			return true;
		}
	}
	return false;
}

module.exports = {
	answer,
	success,
	failure,
	isValidEmail,
	mongooseFormat,
	processTableName,
	checkFields,
	checkData
};
