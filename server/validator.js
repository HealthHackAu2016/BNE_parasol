const XSLX = require('xlsx');
const path = require('path');
const { InvalidValue } = require('../src/attributes/dataTypes');
const dataPath = path.resolve(__dirname, '..', 'data', 'HealthHack2016_Patient_info.xlsx');

function Validator(mappings, handlers) {
	this.columnLookups = mappings.reduce((r, mapping) => {
		r[mapping.column] = mapping.name;
		return r;
	}, {});

	this.mappings = mappings.reduce((r, mapping) => {
		r[mapping.name] =  handlers[mapping.type](mapping);
		return r;
	}, {});
}

Validator.prototype.validate = function() {
	let workbook = XSLX.readFile(dataPath);
	let sheet = workbook.Sheets[workbook.SheetNames[0]];

	// A bit lengthy, but a quick hack to get the data in a nice format
	let data = XSLX.utils.sheet_to_json(sheet);
	let invalidValues = {};
	let unsupported = [];
	let validator = this;

	const logInvalidValue = (invalid) => {
		let type = invalid.type;
		let values = invalidValues[type] = invalidValues[type] || [];
		if (values.indexOf(invalid.value) === -1) values.push(invalid.value);
	}

	let results = data.map((line) => {
		return Object.keys(line).reduce((r, key) => {
			let value = (line[key] || '').trim();
			let name = validator.columnLookups[key];
			if (!name) {
				if (unsupported.indexOf(key) === -1) {
					unsupported.push(key);
				}
				return r;
			}

			let handler = validator.mappings[name];
			if (!handler || !handler.parser) {
				console.log(`Unsupported attribute ${key}`);
				return r;
			}

			let result = handler.parser(r, value);
			if (result instanceof InvalidValue) {
				logInvalidValue(result)
				return r;
			}
			return result;
		}, {});
	});

	return {
		data: results,
		unsupported: unsupported,
		invalidValues: invalidValues
	};
};

module.exports = Validator;