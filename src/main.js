require('isomorphic-fetch');
const mercury = require('mercury');
const router = require('mercury-router');
import './styles/core.scss'

let appRender = require('./renderers/app');

function App() {
  let mappings = require('./stores/mappings')();
  let query = require('./stores/query')();
  let sources = require('./stores/sources')();
  let route = router();

  let state = mercury.state({
      title: mercury.value('Router Example'),
      route: route,
      mappings: mappings,
      sources: sources,
      query: query,
      version: mercury.value(1),

      methods: {
        validate: () => {
          state.route.set('/validation');
          state.mappings.methods.validate();
        },
        applyRules: () => {
          state.route.set('/validation');
          state.mappings.methods.applyRules();
        }
      }
  });

  this.state = state;
}

App.prototype.validate = function() {

};

let app = new App();

//Bootstrap App
mercury.app(document.getElementById('app'), app.state, (state) => {
  return appRender(state, app);
});

if (module.hot) {
  module.hot.accept('./renderers/app.js', () => {
    appRender = require('./renderers/app.js');
    // Invalidate thunks
    // thunk.version = state.version() + 1
    // Trigger top-level re-render
    // state.version.set(thunk.version);
    app.state.version.set(app.state.version() + 1);
    return true;
  });
}