'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Buys', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
      },
      day: { type: Sequelize.DataTypes.DATEONLY, allowNull: true },
      amount: { type: Sequelize.DataTypes.INTEGER, allowNull: true },
      amountUsed: { type: Sequelize.DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
      unitsUsed: { type: Sequelize.DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
      price: { type: Sequelize.DataTypes.DECIMAL(6, 2), allowNull: true },
      createdAt: {
        type: Sequelize.DataTypes.DATE,
        allowNull: false
      },
      updatedAt: {
        type: Sequelize.DataTypes.DATE,
        allowNull: false
      },
      ProductId: {
        type: Sequelize.DataTypes.INTEGER,
        allowNull: false,
        references: { model: "Products" }
      },
      UserId: {
        type: Sequelize.DataTypes.INTEGER,
        allowNull: false,
        references: { model: "Users" }
      }
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Buys');
  }
};
