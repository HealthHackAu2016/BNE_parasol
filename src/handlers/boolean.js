const { h } = require('mercury');
const { row } = require('../renderers/input');

exports.id = 'boolean';

exports.description = 'True/false';

exports.input = (state, app) => {
	return h('div.Handler_Content', [
		row('Default to false', h('input.form-control', { type: 'checkbox', name: 'defaultToFalse' })),
	]);
};

exports.validate = (data) => {
	return data;
}

exports.expression = (mapping, expression, update) => {
	const setCondition = (value) => {
		update.condition.set('$eq');
		update.value.set((value === '' ? '' : Boolean(value)));
	};

	return h('select', {
		'ev-change': (e) => {
			setCondition(e.target.value);
		}
	}, [
		h('option', { value: '' }, '-- Select a condition --'),
		h('option', { value: true, selected: expression.value === true }, 'is true'),
		h('option', { value: false, selected: expression.value === false }, 'is false')
	]);
}

exports.validateExpression = (mapping, query) => {
	return query && query.condition === '$eq' && (query.value === true || query.value === false);
};