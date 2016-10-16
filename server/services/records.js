const Promise = require('es6-promise').Promise;

module.exports = (app, config) => {
	if (!app || !app.db) throw new Error('Cannot load services, no DB');

	const collection = app.db.collection('records');

	const find = (query) => {
		return new Promise((resolve, reject) => {
			collection.find(query || {}).toArray((err, docs) => {
				if (err) return reject(err);
				resolve(docs);
			});
		});
	};

	const get = (query) => {
		return find(query).then((results) => {
			return results && results[0];
		});
	}

	const update = (record) => {
		return new Promise((resolve, reject) => {
			collection.update({ _id: record._id }, { $set: record }, { upsert: true }, (err, result) => {
				if (err || !result || result.n <= 0) return reject(err || 'No result');
				return resolve();
			});
		});
	}

	const remove = (query) => {
		return new Promise((resolve, reject) => {
			collection.remove(query, function(err) {
				if (err) return reject(err);
				return resolve();
			});
		});
	}

	const insertMany = (records) => {
		return new Promise((resolve, reject) => {
			collection.insertMany(records, function(err, result) {
				if (err) return reject(err);
				return resolve(result);
			});
		});
	}

	return {
		find, get, update, remove, insertMany
	}
}