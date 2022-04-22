// See https://sequelize.org/master/manual/model-basics.html
// for more of what you can do here.
const Sequelize = require('sequelize');
const DataTypes = Sequelize.DataTypes;

module.exports = function (app) {
  const sequelizeClient = app.get('sequelizeClient');
  const MealTime = sequelizeClient.define('MealTime', {
    day: { type:DataTypes.DATEONLY, allowNull: false },
    hour: { type:DataTypes.TIME, allowNull: false },
  }, {
    hooks: {
      beforeCount(options) {
        options.raw = true;
      }
    }
  });

  // eslint-disable-next-line no-unused-vars
  MealTime.associate = function (models) {
    // Define associations here
    // See https://sequelize.org/master/manual/assocs.html
    const User = models.User;
    const Meal = models.Meal;

    User.hasMany(MealTime, { foreignKey: { allowNull: false } });
    MealTime.belongsTo(User);

    Meal.hasMany(MealTime, { foreignKey: { allowNull: false } });
    MealTime.belongsTo(Meal);
  };

  return MealTime;
};
