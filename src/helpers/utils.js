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

// Get JDB server version
const getJDBVersion = () => {
	const version = process.env.VERSION || "1.0.0";
	const versionArray = version.split(".");
	return {
		major: parseInt(versionArray[0]),
		minor: parseInt(versionArray[1]),
		patch: parseInt(versionArray[2]),
	};
};

// Get version in classifiable number
const getVersionNumber = (version) => {
	let number = 0;
	if (typeof version === "number") number = version * 1000;
	else if (typeof version === "string") {
		version
			.split(".")
			.map((i) => (!isNaN(parseInt(version)) ? parseInt(i) : 0))
			.forEach((i, key) => {
				if (key === 0) number += i * 1000;
				else if (key === 1) number += i * 100;
				else number += i;
			});
		return number;
	} else if (version) {
		if (version.major) {
			number += version.major * 1000;
			if (version.minor) {
				number += version.minor * 100;
				if (version.patch) {
					number += version.patch;
				}
			}
		}
	}
	return number;
};

// Checks if email is valid
const isValidEmail = (email) => {
	return (
		typeof email === "string" &&
		email
			.toLowerCase()
			.match(
				/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
			)
	);
};

module.exports = { answer, getJDBVersion, getVersionNumber, isValidEmail };
