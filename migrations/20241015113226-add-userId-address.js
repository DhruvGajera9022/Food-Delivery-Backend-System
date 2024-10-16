'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn(
      'address',
      'userId',
      {
        type: Sequelize.INTEGER,
        allowNull: false,
        after: 'isDefault',
      }
    )
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('address', 'userId')
  }
};
