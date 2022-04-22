// See http://docs.sequelizejs.com/en/latest/docs/models-definition/
// for more of what you can do here.
const Sequelize = require('sequelize');
const DataTypes = Sequelize.DataTypes;

module.exports = function (app) {
  const sequelizeClient = app.get('sequelizeClient');

  const User = sequelizeClient.define('User', {
    email: { type: DataTypes.STRING(30), allowNull: false, unique: true },
    password: { type: DataTypes.STRING(100), allowNull: false },
    glassSize: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 250 }
  }, {
    hooks: {
      beforeCount(options) {
        options.raw = true;
      }
    }
  });

  // eslint-disable-next-line no-unused-vars
  User.associate = function (models) {
    // Define associations here
    // See http://docs.sequelizejs.com/en/latest/docs/associations/
  };

  return User;
};
