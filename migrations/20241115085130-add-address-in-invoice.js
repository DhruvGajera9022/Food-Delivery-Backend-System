'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn(
      'invoice',
      'address',
      {
        type: Sequelize.STRING,
        allowNull: true,
        after: 'status',
      }
    )
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('invoice', 'address')
  }
};
