const fs = require("fs");
const { answer } = require("./utils");

/*
    Promise-based fs module
*/

// Error list
const error = {
	write: answer("Unable to write file."),
	read: answer("Read file failed."),
	rename: answer("File rename error."),
	remove: answer("Couldn't remote file."),
	mkdir: answer("Mkdir failed."),
	rmdir: answer("Could not remove directory."),
	readdir: answer("Error reading directory."),
};

// Main filesystem object
const filesystem = {
	write: (path, data) =>
		new Promise((resolve, reject) => {
			if (typeof path === "string" && typeof data === "string") {
				fs.writeFile(path, data, (err) => {
					if (err) reject(answer(err.message));
					else resolve();
				});
			} else reject(error.write);
		}),
	read: (path) =>
		new Promise((resolve, reject) => {
			if (typeof path === "string") {
				fs.readFile(path, "utf8", (err, file) => {
					if (err) reject(answer(err.message));
					else resolve(file);
				});
			} else reject(error.read);
		}),
	rename: (filename, newFilename) =>
		new Promise((resolve, reject) => {
			if (typeof filename === "string" && typeof newFilename === "string") {
				fs.rename(filename, newFilename, (err) => {
					if (err) reject(answer(err.message));
					else resolve();
				});
			} else reject(error.rename);
		}),
	remove: (path) =>
		new Promise((resolve, reject) => {
			if (typeof path === "string") {
				fs.unlink(path, (err) => {
					if (err) reject(answer(err.message));
					else resolve();
				});
			} else reject(error.remove);
		}),
	mkdir: (path) =>
		new Promise((resolve, reject) => {
			if (typeof path === "string") {
				fs.mkdir(path, (err) => {
					if (err) reject(answer(err.message));
					else resolve();
				});
			} else reject(error.mkdir);
		}),
	rmdir: (path) =>
		new Promise((resolve, reject) => {
			if (typeof path === "string") {
				fs.rmdir(path, (err) => {
					if (err) reject(answer(err.message));
					else resolve();
				});
			} else reject(error.rmdir);
		}),
	readdir: (path) =>
		new Promise((resolve, reject) => {
			if (typeof path === "string") {
				fs.readdir(path, (err, files) => {
					if (err) reject(answer(err.message));
					else resolve(files);
				});
			} else reject(error.readdir);
		}),
};

module.exports = filesystem;
