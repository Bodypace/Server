// See https://sequelize.org/master/manual/model-basics.html
// for more of what you can do here.
const Sequelize = require('sequelize');
const DataTypes = Sequelize.DataTypes;

module.exports = function (app) {
  const sequelizeClient = app.get('sequelizeClient');
  const Meal = sequelizeClient.define('Meal', {
    daySince: { type: DataTypes.DATEONLY, allowNull: false },
    dayUntil: { type: DataTypes.DATEONLY },
    defaultHour: { type: DataTypes.TIME, allowNull: false },
    name: { type: DataTypes.STRING, allowNull: false },
  }, {
    hooks: {
      beforeCount(options) {
        options.raw = true;
      }
    }
  });

  // eslint-disable-next-line no-unused-vars
  Meal.associate = function (models) {
    // Define associations here
    // See https://sequelize.org/master/manual/assocs.html
    const User = models.User;

    User.hasMany(Meal, { foreignKey: { allowNull: false } });
    Meal.belongsTo(User);
  };

  return Meal;
};
