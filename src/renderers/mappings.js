const { h, sendSubmit } = require('mercury');
const handlers = require('../handlers');
const { row } = require('./input');
const qs = require('querystring');
const url = require('url');

exports.list = (state, app) => {
	let { mappings } = state;
	return h('section.Content', [
		h('div.Content_Header', [
			h('div.Content_Title', 'Mappings'),
			h('div.Content_Options.btn-group', [
				h('button.btn.btn-default', {
					'ev-click': mappings.methods.refresh
				}, 'Refresh'),
				h('button.btn.btn-default', {
					'ev-click': state.methods.validate
				}, 'Validate'),
				h('button.btn.btn-default', {
					'ev-click': state.methods.applyRules
				}, 'Apply rules'),
				h('button.btn.btn-default', {
					'ev-click': () => {
						app.state.route.set('/mappings/new')
					}
				}, 'New'),
			])
		]),
		h('div.Content_Main', [
			h('div.Mappings', mappings.store.data.map((item) => {
				return h('div.Mapping', [
					h('div.Mapping_Title', [
						h('h3', item.name),
						h('div.Button_Container', [
							h('button.btn.btn-danger.btn-sm', {
								'ev-click': () => {
									mappings.methods.remove(item._id);
								}
							}, 'Delete')
						])
					])
				].concat(Object.keys(item).map((key) => {
					return h('div.Mapping_Field', [
						h('label', key),
						h('div', item[key])
					]);
				})));
			}))
		])
	]);
};


exports.create = (state, app) => {
	let { mappings } = state;

	let selected = mappings.store.selectedType || Object.keys(handlers)[0];
	let handler = handlers[selected];

	let contents = [];

	let parsed = url.parse(state.route);
	let params = qs.parse(parsed.query);

	if (mappings.store.updating) {
		contents.push(h('div', 'Updating...'));
	} else {
		contents.push(h('form', {
			'ev-submit': [
				(e) => e.preventDefault(),
				sendSubmit(mappings.methods.update)
			]
		}, [
			row('Name', h('input.form-control', { type: 'text', name: 'name', required: true })),
			row('Column', h('input.form-control', { type: 'text', name: 'column', required: true, value: params.column })),
			row('Type', h('select.form-control', {
				name: 'type',
				'ev-change': (e) => {
					app.state.mappings.store.selectedType.set(e.target.value)
				}
			}, Object.keys(handlers).map((key) => {
				let handler = handlers[key];
				return h('option', {
					value: handler.id,
					selected: handler.id === selected
				}, handler.description);
			}))),
			handler.input(state, app),
			h('button.btn.btn-submit', {
				type: 'submit'
			}, 'Submit')
		]));
	}

	return h('section.Content', [
		h('div.Content_Header', [
			h('div.Content_Title', 'New mapping'),
		]),
		h('div.Content_Main', contents)
	]);
};