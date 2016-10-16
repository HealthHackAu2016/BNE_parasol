const { h } = require('mercury');
const router = require('mercury-router');
const header = require('./header');
const mappings = require('./mappings');
const validation = require('./validation');
const query = require('./query');
const sources = require('./sources');

module.exports = (state, app) => {
	return h('div', [
		header(state, app),
		router.render(state, {
			'/': () => query.create(state, app),
			'/mappings': () => mappings.list(state, app),
			'/mappings/new': () => mappings.create(state, app),
			'/validation' : () => validation(state, app),
			'/query': () => query.create(state, app),
			'/sources': () => sources(state, app)
		})
	]);
}