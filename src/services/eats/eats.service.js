// Initializes the `eats` service on path `/eats`
const { Eats } = require('./eats.class');
const createModel = require('../../models/eats.model');
const hooks = require('./eats.hooks');

module.exports = function (app) {
  const options = {
    Model: createModel(app),
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/eats', new Eats(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('eats');

  service.hooks(hooks);
};
