// Initializes the `water` service on path `/water`
const { Water } = require('./water.class');
const createModel = require('../../models/water.model');
const hooks = require('./water.hooks');

module.exports = function (app) {
  const options = {
    Model: createModel(app),
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/water', new Water(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('water');

  service.hooks(hooks);
};
