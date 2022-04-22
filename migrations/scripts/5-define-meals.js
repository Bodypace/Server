'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Meals', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
      },
      daySince: { type: Sequelize.DataTypes.DATEONLY, allowNull: false },
      dayUntil: { type: Sequelize.DataTypes.DATEONLY, allowNull: true },
      defaultHour: { type: Sequelize.DataTypes.TIME, allowNull: false },
      name: { type: Sequelize.DataTypes.STRING, allowNull: false },
      createdAt: {
        type: Sequelize.DataTypes.DATE,
        allowNull: false
      },
      updatedAt: {
        type: Sequelize.DataTypes.DATE,
        allowNull: false
      },
      UserId: {
        type: Sequelize.DataTypes.INTEGER,
        allowNull: false,
        references: { model: "Users" }
      }
    })
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Meals');
  }
};
