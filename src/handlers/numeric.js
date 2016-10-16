const { h } = require('mercury');
const { row, checkbox } = require('../renderers/input');

exports.id = 'numeric';

exports.description = 'Numeric';

exports.input = (state, app) => {
	return h('div.Handler_Content', [
		row('Default to Zero', h('input.form-control', { type: 'checkbox', name: 'defaultToZero' })),
		row('Minimum Value', h('input.form-control', { type: 'number', name: 'min' })),
		row('Maximum Value', h('input.form-control', { type: 'number', name: 'max' })),
	]);
};

exports.validate = (data) => {
	['min', 'max'].forEach((key) => {
		let value = (data[key] || '').trim();
		if (value === '') {
			delete data[key];
		} else {
			data[key] = parseInt(value);
		}
	});
	return data;
}

const conditions = {
	'$eq': '=',
	'$gt': '>',
	'$gte': '>=',
	'$lt': '<',
	'$lte': '<='
};

exports.expression = (mapping, expression, update) => {
	const setCondition = (condition) => {
		update.condition.set((condition === '' ? null : condition));
	};

	let controls = [
		h('select', {
			'ev-change': (e) => {
				setCondition(e.target.value);
			}
		}, [
			h('option', { value: '' }, '-- Select a condition --')
		].concat(Object.keys(conditions).map((condition) => {
			let selected = expression.condition === condition;
			return h('option', {
				value: condition, selected: selected
			}, conditions[condition]);
		})))
	];

	if (expression.condition) {
		controls.push(h('input', {
			value: expression.value,
			type: 'number',
			'ev-change': (e) => {
				update.value.set(parseInt(e.target.value))
			}
		}));
	}
	return h('span', controls);
}

exports.validateExpression = (mapping, query) => {
	return query && conditions[query.condition] && query.value !== null && !isNaN(query.value);
};