const Promise = require('es6-promise').Promise;
const Validator = require('../validator');
const dataTypes = require('../../src/attributes/dataTypes');

module.exports = (app, config) => {

	const validate = (rules) => {
		let validator = new Validator(rules, dataTypes);
		return validator.validate();
	};

	const validateExisting = () => {
		let mappings = app.services.mappings;
		return mappings.find().then(validate);
	};

	return { validate, validateExisting };
};