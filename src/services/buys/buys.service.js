// Initializes the `buys` service on path `/buys`
const { Buys } = require('./buys.class');
const createModel = require('../../models/buys.model');
const hooks = require('./buys.hooks');

module.exports = function (app) {
  const options = {
    Model: createModel(app),
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/buys', new Buys(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('buys');

  service.hooks(hooks);
};
