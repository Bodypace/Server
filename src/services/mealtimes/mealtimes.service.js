// Initializes the `mealtimes` service on path `/mealtimes`
const { Mealtimes } = require('./mealtimes.class');
const createModel = require('../../models/mealtimes.model');
const hooks = require('./mealtimes.hooks');

module.exports = function (app) {
  const options = {
    Model: createModel(app),
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/mealtimes', new Mealtimes(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('mealtimes');

  service.hooks(hooks);
};
