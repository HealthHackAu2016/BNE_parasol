const Promise = require('es6-promise').Promise;

module.exports = (app, config) => {
	if (!app || !app.db) throw new Error('Cannot load services, no DB');

	const collection = app.db.collection('mappings');
	collection.ensureIndex({ name: 1 }, { unique: true });

	const find = (query) => {
		return new Promise((resolve, reject) => {
			collection.find(query || {}).sort({ name: 1 }).toArray((err, docs) => {
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

	const update = (mapping) => {
		if (!mapping || !mapping.name) return Promise.reject('Invalid mapping name');
		return new Promise((resolve, reject) => {
			collection.update({ name: mapping.name }, { $set: mapping }, { upsert: true }, (err, result) => {
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

	return {
		find, get, update, remove
	}
}