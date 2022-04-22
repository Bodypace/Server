'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Users', [{
      id: 1,
      email: 'robert@me.com',
      password: '$2a$10$76wKDN0Qnk8bHwOhJ/dePeZb44297i8QdbzUO/zt66BNDokxkiwLG',
      createdAt: '2021-06-19 14:06:15',
      updatedAt: '2021-06-19 14:06:15',
    }]);
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Users', null, {});
  }
};
