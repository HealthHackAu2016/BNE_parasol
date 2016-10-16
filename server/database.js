const MongoClient = require('mongodb').MongoClient;
const Promise = require('es6-promise').Promise;

module.exports = (app, config) => {
	return new Promise((resolve, reject) => {
		if (!config.db) return reject('No database configuration found');
		MongoClient.connect(config.db, (err, db) => {
			if (err) return resolve(err);
			app.db = db;
			return resolve(app);
		});
	});
};