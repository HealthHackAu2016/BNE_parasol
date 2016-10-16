const { h } = require('mercury');
const { row } = require('../renderers/input');

exports.id = 'string';

exports.description = 'Text';

exports.input = (state, app) => {
	return h('div.Handler_Content', [
		row('Preserve formatting', h('input.form-control', { type: 'checkbox', name: 'preserveFormatting' })),
		row('Acceptable values (comma-delimited)', h('input.form-control', { type: 'text', name: 'valid' })),
	]);
};

const trim = (val) => {
	return (val || '').trim();
};

const exists = (val) => {
	return val;
};

exports.validate = (data) => {
	var valid = trim(data.valid);
	if (!data.preserveFormatting) valid = valid.toUpperCase();
	if (valid) {
		data.valid = valid.split(',').map(trim).filter(exists);
	}
	return data;
}

const conditions = {
	'$eq': 'equals',
	'$ne': 'not equals',
	'$in': 'is one of',
	'$nin': 'is not one of',
	'$regex': 'matches'
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

	let expectedValues = mapping.valid.length > 0;

	const selectValues = (multiple) => {
		// If we don't have a set of permissible values, just render a text input
		if (!expectedValues) {
			return h('input', {
				type: 'text',
				required: true,
				'ev-change': (e) => update.value.set(e.target.value)
			})
		}

		let existingValues = Array.isArray(expression.value) ? expression.value : [expression.value];
		// Otherwise display a range of accepted values
		let values = (!multiple ? [
			h('option', { value: '' }, '-- Select a value --')
		] : []).concat(mapping.valid.map((expected) => {
			return h('option', {
				value: expected,
				selected: existingValues.indexOf(expected) !== -1
			}, expected);
		}));

		return h('select', {
			'ev-change': (e) => {
				let selected = e.target.selectedOptions;
				let values = Array.prototype.map.bind(selected)((opt) => {
					return opt.value;
				});
				update.value.set(values);
			},
			multiple: !!multiple
		}, values);
	}

	if (expression.condition) {
		switch (expression.condition) {
			case '$eq':
				controls.push(selectValues());
				break;
			case '$ne':
				controls.push(selectValues());
				break;
			case '$in':
				controls.push(selectValues(true));
				break;
			case '$nin':
				controls.push(selectValues(true));
				break;
			// case: '$regex':
			// 	controls.push(h('input'));
			// 	break;
		}
	}
	return h('span', controls);
}

exports.validateExpression = (mapping, query) => {
	let expectedValues = mapping.valid;
	return query && conditions[query.condition] && query.value !== null && (!Array.isArray(query.value) || query.value.length > 0);
};