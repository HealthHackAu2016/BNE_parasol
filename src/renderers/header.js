const { h } = require('mercury');
const Router = require('mercury-router');

const routes = {
	'Query': '/query',
	'Mappings': '/mappings',
	'Validation': '/validation',
	'Data Sources': '/sources'
};

module.exports = (state, app) => {

	const active = (path) => {
		return state.route.indexOf(path) !== -1;
	};

	return h('nav.Header', [
		h('span.Header_Title', 'Parasort'),
		h('ul', Object.keys(routes).map((label) => {
			let route = routes[label];
			return h('li' + (active(route) ? '.-active' : ''), {
				'ev-click': () => {
					app.state.route.set(route);
				}
			}, label);
		}))
	]);
};