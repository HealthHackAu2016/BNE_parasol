const database = require('./database');
const config = require('../config')

module.exports = () => {
	let core = {
		config: config
	};
	return database(core, config).then((app) => {
		// Load services
		app.services = ['mappings', 'validator', 'records', 'sources'].reduce((r, id) => {
		  r[id] = require(`./services/${id}`)(app, config);
		  return r;
		}, {});
		return app;
	});
}