const { h, sendSubmit } = require('mercury');
const handlers = require('../handlers');
const { row } = require('./input');

exports.create = (state, app) => {

	let { mappings, query } = state;

	const processExpression = (expression, idx) => {
		let updater = app.state.query.store.expressions.get(idx);
		let selector = h('select', {
			'ev-change': (e) => {
				let field = e.target.value || undefined;
				updater.field.set(field);
			}
		}, [
			h('option', { value: '' }, '-- Select a field --')
		].concat(
			mappings.store.data.map((mapping) => {
				return h('option', {
					selected: expression.field === mapping.name
				}, mapping.name);
			})
		));

		let definition = mappings.methods.get(expression.field);
		let queryBuilder = [selector];
		// Get the type handler
		let handler = definition && handlers[definition.type];
		if (handler && handler.expression) {
			queryBuilder.push(handler.expression(definition, expression, updater));
		} else if (definition) {
			queryBuilder.push(h('span.Alert.-error', `Query not yet supported for ${definition.type}`));
		}
		queryBuilder.push(h('button.btn.btn-xs.btn-danger', {
			'ev-click': () => {
				query.methods.removeExpression(idx)
			}
		}, 'Remove'));
		let valid = handler && handler.validateExpression && handler.validateExpression(definition, expression);
		if (valid) {
			queryBuilder.push(h('span.Alert.-success', 'Valid'));
		}
		return {
			render: h('div.Expression', queryBuilder),
			valid: valid
		};
	}

	let expressions = query.store.expressions.map(processExpression);
	let invalid = expressions.filter((exp) => { return !exp.valid });

	let content = [];
	if (query.store.running) {
		content.push(h('p', 'Running query...'));
	} else {
		content = [
			h('h3', 'Construct query'),
			h('div.Expressions', expressions.map((exp) => exp.render)),
			h('div.btn-group', [
				h('button.btn.btn-default', {
					'ev-click': query.methods.newExpression
				}, 'Add expression'),
				(invalid.length === 0 && expressions.length > 0 ?
					h('button.btn.btn-primary', {
						'ev-click': query.methods.runQuery
					}, 'Run query') : '')
			])
		];

		// If we have records
		if (query.store.results.records) {
			content.push(h('div.Query_Results', [
				h('h3', 'Query Results'),
				h('div.Results', query.store.results.records.map((record) => {
					return h('div', JSON.stringify(record));
				}))
			]));
		}
	}

	return h('section.Content', [
		h('div.Content_Header', [
			h('div.Content_Title', 'Query'),
			h('div.Content_Options.Control_Group', [

			])
		]),
		h('div.Content_Main', content)
	]);
};