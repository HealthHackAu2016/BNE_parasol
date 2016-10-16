module.exports = (app, config) => {

	const records = app.core.services.records;
	const validator = app.core.services.validator;

	app.post('/api/records/query', (req, res, next) => {
		var query = req.body;
		records.find(query).then((results) => {
			return res.json(results);
		}).catch(next);
	});

	// Validates the mappings against the current data file
	app.get('/api/import', (req, res, next) => {
		let validation = null;
		records.remove({}).then(() => {
			return validator.validateExisting();
		}).then((imported) => {
			validation = imported;
			return records.insertMany(imported.data);
		}).then(() => {
			return res.json(validation);
		}).catch(next);
	});
}