'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Products', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      name: { type: Sequelize.DataTypes.STRING(45), allowNull: false },
      vendor: { type: Sequelize.DataTypes.STRING(30), allowNull: true },
      units: { type: Sequelize.DataTypes.INTEGER, allowNull: true },
      unitSize: { type: Sequelize.DataTypes.INTEGER, allowNull: true },
      size: { type: Sequelize.DataTypes.INTEGER, allowNull: true },
      barcode: { type: Sequelize.DataTypes.STRING, allowNull: true },
      kcal: { type: Sequelize.DataTypes.INTEGER, allowNull: false },
      protein: { type: Sequelize.DataTypes.DECIMAL(3, 1), allowNull: false },
      carb: { type: Sequelize.DataTypes.DECIMAL(3, 1), allowNull: false },
      sugar: { type: Sequelize.DataTypes.DECIMAL(3, 1), allowNull: false },
      fat: { type: Sequelize.DataTypes.DECIMAL(3, 1), allowNull: false },
      saturated: { type: Sequelize.DataTypes.DECIMAL(3, 1), allowNull: false },
      salt: { type: Sequelize.DataTypes.DECIMAL(4, 2), allowNull: true },
      createdAt: {
        type: Sequelize.DataTypes.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: Sequelize.DataTypes.DATE,
        allowNull: false,
      },
      UserId: {
        type: Sequelize.DataTypes.INTEGER,
        allowNull: true,
        references: { model: 'Users' },
      },
    });
  },

  down: (queryInterface) => {
    return queryInterface.dropTable('Products');
  },
};
