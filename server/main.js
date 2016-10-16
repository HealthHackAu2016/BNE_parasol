const express = require('express')
const path = require('path');
const debug = require('debug')('app:server')
const bodyParser = require('body-parser');
const history = require('connect-history-api-fallback');
const development = require('./development');
const core = require('./core');

const server = express()

module.exports = () => {

  return core().then((app) => {

    const paths = app.config.utils_paths;

    server.core = app;
    server.use('/api', bodyParser.json());

    // Load routes
    require('./routes/mappings')(server, app.config);
    require('./routes/records')(server, app.config);
    require('./routes/sources')(server, app.config);

    server.use(history());

    // Apply development handlers
    if (app.config.env === 'development') {
      development(server, app.config);
    } else {
      debug(
        'Server is being run outside of live development mode, meaning it will ' +
        'only serve the compiled application bundle in ~/dist. Generally you ' +
        'do not need an application server for this and can instead use a web ' +
        'server such as nginx to serve your static files. See the "deployment" ' +
        'section in the README for more information on deployment strategies.'
      )

      // Serving ~/dist by default. Ideally these files should be served by
      // the web server and not the app server, but this helps to demo the
      // server in production.
      server.use(express.static(paths.dist()))
    }
    return server;
  });
}