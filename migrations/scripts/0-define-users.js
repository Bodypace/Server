'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Users', { 
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
      },
      email: {
        type: Sequelize.DataTypes.STRING(30),
        allowNull: false,
        unique: true
      },
      password: {
        type: Sequelize.DataTypes.STRING(100),
        allowNull: false
      },
      glassSize: {
        type: Sequelize.DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 250
      },
      createdAt: {
        type: Sequelize.DataTypes.DATE,
        allowNull: false
      },
      updatedAt: {
        type: Sequelize.DataTypes.DATE,
        allowNull: false
      }
    });
  },

  down: (queryInterface, Sequelize) => {
     return queryInterface.dropTable('Users');
  }
};
