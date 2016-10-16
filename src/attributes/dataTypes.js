const { Promise } = require('es6-promise');

function InvalidValue(type, value, msg) {
	this.type = type;
	this.value = value;
	this.message = msg;
}

const parsedType = (type, mapping, parser) => {
	if (!mapping.name) throw new Error(`${type} type requires a name`);
	let column = mapping.column || mapping.name;
	return {
		name: mapping.name,
		column: column,
		parser: parser
	};
}

const parseNumber = (mapping) => {
	const defaultToZero = !!mapping.defaultToZero;
	const outputField = mapping.name;
	const min = mapping.min;
	const max = mapping.max;

	return (result, data) => {
		let value = null;
		if (isNaN(data) || (!defaultToZero && !data)) return new InvalidValue(outputField, data, 'Not a number');
		value = Number(data);
		// Check ranges if required
		if ((min && min > value) || (max && max < value)) {
			return new InvalidValue(outputField, data, 'Outside of accepted range');
		}
		result[outputField] = value;
		return result;
	};
};

/**
  Helper for creating a numeric type
 **/
const numericValue = (mapping) => {
	return parsedType('Numeric', mapping, parseNumber(mapping));
};

const parseBoolean = (mapping) => {
	let defaultToFalse = mapping.defaultToFalse;
	let outputField = mapping.name;

	return (result, data) => {
		if (isNaN(data) || (!defaultToFalse && !data)) return new InvalidValue(outputField, data);
		result[outputField] = !!Number(data);
		return result;
	};
};

/**
  Helper for creating a boolean type
 **/
const booleanValue = (mapping) => {
	return parsedType('Boolean', mapping, parseBoolean(mapping));
};

const parseString = (mapping) => {
	let valid = mapping.valid;
	let preserveFormatting = mapping.preserveFormatting;
	let outputField = mapping.name;

	return (result, data) => {
		if (!preserveFormatting) data = (data || '').toUpperCase();
		if (valid && valid.indexOf(data) === -1) return new InvalidValue(outputField, data);
		result[outputField] = data;
		return result;
	};
};

/**
  Helper for creating a string type
 **/
const stringValue = (mapping) => {
	return parsedType('String', mapping, parseString(mapping));
}

module.exports = {
	numeric: numericValue,
	boolean: booleanValue,
	string: stringValue,
	InvalidValue
};