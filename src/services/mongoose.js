const Mongoose = require("mongoose");
const App = require("../models/appModel");
const Table = require("../models/tableModel");
const { databaseUrl, databaseName } = require("../helpers/const");
const { mongooseFormat } = require("../helpers/utils");

/*
	Database manipulation through Mongoose
*/

const mongoose = {
	// Connects to MongoDB
	connect: () =>
		Mongoose.connect(`${databaseUrl}/${databaseName}`, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
		}),

	// Creates app
	createApp: (app) => App.findOne({ name: app })
		.then((existingApp) => {
			if (existingApp)
				throw `Application ${app} already exists`;
			else
				return new App({ app }).save();
		})
		.then(mongooseFormat),

	// Creates new table
	createTable: (app, table, fields) => App.findOne({ name: app })
		.then((existingApp) => {
			if (!existingApp)
				throw `Application ${app} does not exist yet`;
			else
				return Table.findOne({ name: table, app });
		})
		.then((existingTable) => {
			if (existingTable)
				throw `This table already exists`;
			else
				return new Table({ app, name: table, fields }).save();
		}),

	// Gets table fields
	getTable: (app, table) => Table.findOne({ app, name: table })
		.then((data) => {
			if (data)
				return data;
			else
				throw `Table ${table} was not found`;
		})
		.then(mongooseFormat),

	// Creates a schema from provided fields
	createModel: (id, fields) => {
		let schema = {};
		const keys = Object.keys(fields);

		if (!Mongoose.modelNames().includes(id)) {
			keys.forEach((field) => {
				const type = fields[field].toLowerCase();
				field = field.toLowerCase();
				if (type === "string")
					schema[field] = {
						type: String,
					};
				else if (type === "number")
					schema[field] = {
						type: Number,
					};
			});
			return Mongoose.model(JSON.parse(JSON.stringify(id)), new Mongoose.Schema(schema));
		}
		else
			return Mongoose.model(JSON.parse(JSON.stringify(id)));
	},

	// Inserts data into table
	insertData: (table, data) => {
		const model = mongoose.createModel(table.id, table.fields);
		return new model(data).save().then(mongooseFormat);
	},

	// Gets table data
	getData: (table) => {
		const model = mongoose.createModel(table.id, table.fields);
		return model.find()
			.then((data) => data.map(mongooseFormat));
	},

	// Gets table list
	getTableList: (app) => Table.find({ app })
		.then((data) => data.map(mongooseFormat)),

	// Updates data
	updateTable: (table, id, data) => {
		const model = mongoose.createModel(table.id, table.fields);
		return model.findById(id).updateOne(data);
	},
};

module.exports = mongoose;
