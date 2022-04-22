'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Waters', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
      },
      day: { type: Sequelize.DataTypes.DATEONLY, allowNull: false },
      hour: { type: Sequelize.DataTypes.TIME, allowNull: false },
      amount: { type: Sequelize.DataTypes.INTEGER, allowNull: false },
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
    return queryInterface.dropTable('Waters');
  }
};
