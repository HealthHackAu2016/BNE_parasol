const core = require('../server/core');

console.log('Loading core...');

core().then((app) => {
	console.log('Validating...');
	const validator = app.services.validator;
	validator.validateExisting().then((result) => {
		console.log(result);
	}).catch(console.error);
});