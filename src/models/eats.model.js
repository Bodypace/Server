// See http://docs.sequelizejs.com/en/latest/docs/models-definition/
// for more of what you can do here.
const Sequelize = require('sequelize');
const DataTypes = Sequelize.DataTypes;

module.exports = function (app) {
  const sequelizeClient = app.get('sequelizeClient');
  const Eat = sequelizeClient.define('Eat', {
    amount: { type: DataTypes.INTEGER, allowNull: false },
  }, {
    hooks: {
      beforeCount(options) {
        options.raw = true;
      }
    }
  });

  // eslint-disable-next-line no-unused-vars
  Eat.associate = function (models) {
    // Define associations here
    // See http://docs.sequelizejs.com/en/latest/docs/associations/

    const Product = models.Product;
    const Buy = models.Buy;
    const MealTime = models.MealTime;
    const User = models.User;

    Product.hasMany(Eat, { foreignKey: { allowNull: false } });
    Eat.belongsTo(Product);

    Buy.hasMany(Eat, { foreignKey: { allowNull: true } });
    Eat.belongsTo(Buy);

    MealTime.hasMany(Eat, { foreignKey: { allowNull: false } });
    Eat.belongsTo(MealTime);

    User.hasMany(Eat, { foreignKey: { allowNull: false } });
    Eat.belongsTo(User);
  };

  return Eat;
};
