const Sequelize = require('sequelize');

module.exports = function (app) {
  const settings = app.get('mysql');
  const sequelize = new Sequelize({ ...settings, logging: false });

  const oldSetup = app.setup;

  app.set('sequelizeClient', sequelize);

  app.setup = function (...args) {
    const result = oldSetup.apply(this, args);

    // Set up data relationships
    const models = sequelize.models;
    Object.keys(models).forEach((name) => {
      if ('associate' in models[name]) {
        models[name].associate(models);
      }
    });

    // Sync to the database
    app.set('sequelizeSync', sequelize.sync({ force: false }));

    return result;
  };
};
