// See http://docs.sequelizejs.com/en/latest/docs/models-definition/
// for more of what you can do here.
const Sequelize = require('sequelize');
const DataTypes = Sequelize.DataTypes;

module.exports = function (app) {
  const sequelizeClient = app.get('sequelizeClient');
  const Product = sequelizeClient.define(
    'Product',
    {
      name: { type: DataTypes.STRING(45), allowNull: false },
      vendor: { type: DataTypes.STRING(30) },
      units: { type: DataTypes.INTEGER },
      unitSize: { type: DataTypes.INTEGER },
      size: { type: DataTypes.INTEGER },
      barcode: { type: DataTypes.STRING },
      kcal: { type: DataTypes.INTEGER, allowNull: false },
      protein: { type: DataTypes.DECIMAL(3, 1), allowNull: false },
      carb: { type: DataTypes.DECIMAL(3, 1), allowNull: false },
      sugar: { type: DataTypes.DECIMAL(3, 1), allowNull: false },
      fat: { type: DataTypes.DECIMAL(3, 1), allowNull: false },
      saturated: { type: DataTypes.DECIMAL(3, 1), allowNull: false },
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
  Product.associate = function (models) {
    // Define associations here
    // See http://docs.sequelizejs.com/en/latest/docs/associations/

    const User = models.User;

    User.hasMany(Product, { foreignKey: { allowNull: true } });
    Product.belongsTo(User);
  };

  return Product;
};
