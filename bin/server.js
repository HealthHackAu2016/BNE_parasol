const config = require('../config')
const server = require('../server/main')
const debug = require('debug')('app:bin:server')
const port = config.server_port

server()
.then((app) => {
	app.listen(port)
	debug(`Server is now running at http://localhost:${port}.`)
}).catch((err) => {
	console.error('Failed to start server', err);
});

