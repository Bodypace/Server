// See http://docs.sequelizejs.com/en/latest/docs/models-definition/
// for more of what you can do here.
const Sequelize = require('sequelize');
const DataTypes = Sequelize.DataTypes;

module.exports = function (app) {
  const sequelizeClient = app.get('sequelizeClient');
  const Goal = sequelizeClient.define(
    'Goal',
    {
      daySince: { type: DataTypes.DATEONLY, allowNull: false },
      dayUntil: { type: DataTypes.DATEONLY },
      name: { type: DataTypes.STRING(45), allowNull: false },
      water: { type: DataTypes.STRING, allowNull: false },
      kcal: { type: DataTypes.INTEGER, allowNull: false },
      protein: { type: DataTypes.DECIMAL(4, 1), allowNull: false },
      carb: { type: DataTypes.DECIMAL(4, 1), allowNull: false },
      fat: { type: DataTypes.DECIMAL(4, 1), allowNull: false },
      salt: { type: DataTypes.DECIMAL(4, 2) },
    },
    {
      hooks: {
        beforeCount(options) {
          options.raw = true;
        },
      },
    }
  );

  // eslint-disable-next-line no-unused-vars
  Goal.associate = function (models) {
    // Define associations here
    // See http://docs.sequelizejs.com/en/latest/docs/associations/
    const User = models.User;

    User.hasMany(Goal, { foreignKey: { allowNull: false } });
    Goal.belongsTo(User);
  };

  return Goal;
};
