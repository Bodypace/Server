'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Eats', { 
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
      },
      amount: { type: Sequelize.DataTypes.INTEGER, allowNull: false },
      wasted: { type: Sequelize.DataTypes.DATEONLY },
      createdAt: {
        type: Sequelize.DataTypes.DATE,
        allowNull: false
      },
      updatedAt: {
        type: Sequelize.DataTypes.DATE,
        allowNull: false
      },
      MealTimeId: {
        type: Sequelize.DataTypes.INTEGER,
        allowNull: true,
        references: { model: "MealTimes" }
      },
      ProductId: {
        type: Sequelize.DataTypes.INTEGER,
        allowNull: false,
        references: { model: "Products" }
      },
      BuyId: {
        type: Sequelize.DataTypes.INTEGER,
        allowNull: true,
        references: { model: "Buys" }
      },
      UserId: {
        type: Sequelize.DataTypes.INTEGER,
        allowNull: false,
        references: { model: "Users" }
      }
    });
  },

  down: (queryInterface, Sequelize) => {
     return queryInterface.dropTable('Eats');
  }
};
