const { h } = require('mercury');

const validate = (state, app) => {
	let content = [];
	let { mappings } = state;
	if (mappings.store.validating) {
		content.push(h('p', 'Validating...'));
	} else if (mappings.store.validation.data) {

		let validation = mappings.store.validation;

		content.push(h('h2', 'Invalid Data Values'));
		content.push(h('div', Object.keys(validation.invalidValues).map((key) => {
			return h('div.InvalidValue', [
				h('h3', key),
				h('ul.ValueList', validation.invalidValues[key].map((item) => {
					return h('li', item);
				}))
			]);
		})));

		content.push(h('h2', 'Unsupported Fields'));
		content.push(h('ul.ValueList', validation.unsupported.map((item) => {
			return h('li.-selectable', {
				'ev-click': () => {
					let column = encodeURIComponent(item);
					app.state.route.set(`/mappings/new?column=${column}`);
				}
			}, item);
		})));

		content.push(h('h2', 'Data'));
		content.push(h('div.Result_Sets', validation.data.map((item) => {
			return h('div', JSON.stringify(item));
		})));
	} else {
		content.push(h('p', 'Click Validate to test the current mappings'));
	}
	return h('div.Validation', content);
};

module.exports = (state, app) => {

	let { mappings } = state;

	return h('section.Content', [
		h('div.Content_Header', [
			h('div.Content_Title', 'Validation'),
			h('div.Content_Options.btn-group', [
				h('button.btn.btn-default', {
					'ev-click': mappings.methods.validate
				}, 'Validate'),
				h('button.btn.btn-default', {
					'ev-click': () => {
						app.state.route.set('/mappings/new')
					}
				}, 'New mapping'),
			])
		]),
		h('div.Content_Main', [
			validate(state, app),
		])
	]);
}