'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('MealTimes', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
      },
      day: { type: Sequelize.DataTypes.DATEONLY, allowNull: false },
      hour: { type: Sequelize.DataTypes.TIME, allowNull: false },
      createdAt: {
        type: Sequelize.DataTypes.DATE,
        allowNull: false
      },
      updatedAt: {
        type: Sequelize.DataTypes.DATE,
        allowNull: false
      },
      MealId: {
        type: Sequelize.DataTypes.INTEGER,
        allowNull: false,
        references: { model: "Meals" }
      },
      UserId: {
        type: Sequelize.DataTypes.INTEGER,
        allowNull: false,
        references: { model: "Users" }
      }
    })
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('MealTimes');
  }
};
