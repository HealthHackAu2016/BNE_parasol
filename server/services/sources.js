const Promise = require('es6-promise').Promise;

module.exports = (app, config) => {
	if (!app || !app.db) throw new Error('Cannot load services, no DB');

	const collection = app.db.collection('sources');
	collection.ensureIndex({ name: 1 }, { unique: true });

	const find = (query, project) => {
		return new Promise((resolve, reject) => {
			collection.find(query || {}, project).sort({ filename: 1 }).toArray((err, docs) => {
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

	const insert = (source) => {
		if (!source || !source.content) return Promise.reject('Invalid source');
		return new Promise((resolve, reject) => {
			collection.insertOne(source, (err, result) => {
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
		find, get, insert, remove
	}
}