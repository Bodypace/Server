// See http://docs.sequelizejs.com/en/latest/docs/models-definition/
// for more of what you can do here.
const Sequelize = require('sequelize');
const DataTypes = Sequelize.DataTypes;

module.exports = function (app) {
  const sequelizeClient = app.get('sequelizeClient');

  const Buy = sequelizeClient.define('Buy', {
    day: { type:DataTypes.DATEONLY },
    amount: { type: DataTypes.INTEGER },
    amountUsed: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
    unitsUsed: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
    finished: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
    price: { type: DataTypes.DECIMAL(6, 2) },
  }, {
    hooks: {
      beforeCount(options) {
        options.raw = true;
      }
    }
  });

  // eslint-disable-next-line no-unused-vars
  Buy.associate = function (models) {
    // Define associations here
    // See http://docs.sequelizejs.com/en/latest/docs/associations/

    const Product = models.Product;
    const User = models.User;

    Product.hasMany(Buy, { foreignKey: { allowNull: false } });
    Buy.belongsTo(Product);

    User.hasMany(Buy, { foreignKey: { allowNull: false } });
    Buy.belongsTo(User);
  };

  return Buy;
};
