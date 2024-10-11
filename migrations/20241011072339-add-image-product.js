'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn(
      'products',
      'image',
      {
        type: Sequelize.STRING,
        allowNull: true,
        after: 'rating',
      }
    )
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('products', 'image')
  }
};
