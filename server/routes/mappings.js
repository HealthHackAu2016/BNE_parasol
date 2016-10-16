const { ObjectID } = require('mongodb');

module.exports = (app, config) => {

	const mappings = app.core.services.mappings;
	const validator = app.core.services.validator;

	// List available mappings
	app.get('/api/mappings', (req, res, next) => {
		mappings.find().then((results) => {
			return res.json(results);
		}).catch(next);
	});

	// Add new mapping
	app.post('/api/mappings', (req, res, next) => {
		mappings.update(req.body).then((created) => {
			res.json({ status: 'OK' });
		}).catch(next);
	});

	// Get a mapping by ID
	app.get('/api/mappings/:id', (req, res, next) => {

	});

	app.post('/api/mappings/:id', (req, res, next) => {
		mappings.update(req.body).then((created) => {
			res.json({ status: 'OK' });
		}).catch(next);
	});

	app.delete('/api/mappings/:id', (req, res, next) => {
		mappings.remove({ _id: new ObjectID(req.params.id) }).then(() => {
			res.json({ status: 'OK' });
		}).catch(next);
	});

	// Validates the mappings against the current data file
	app.get('/api/validate', (req, res, next) => {
		validator.validateExisting().then((result) => {
			res.json(result);
		}).catch(next);
	});
}