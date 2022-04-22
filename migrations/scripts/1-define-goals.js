'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Goals', { 
        id: {
          type: Sequelize.INTEGER,
          allowNull: false,
          primaryKey: true,
          autoIncrement: true
        },
        daySince: { type:Sequelize.DataTypes.DATEONLY, allowNull: false },
        name: { type: Sequelize.DataTypes.STRING(45), allowNull: false },
        water: { type: Sequelize.DataTypes.INTEGER, allowNull: false },
        kcal: { type: Sequelize.DataTypes.INTEGER, allowNull: false },
        protein: { type: Sequelize.DataTypes.DECIMAL(4,1), allowNull: false },
        carb: { type: Sequelize.DataTypes.DECIMAL(4,1), allowNull: false },
        fat: { type: Sequelize.DataTypes.DECIMAL(4,1), allowNull: false },
        salt: { type: Sequelize.DataTypes.DECIMAL(4,2), allowNull: true },
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
    return queryInterface.dropTable('Goals');
  }
};
