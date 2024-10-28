'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('invoice', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
      },
      user_id: {
        type: Sequelize.INTEGER,
      },
      transaction_id: {
        type: Sequelize.STRING,
      },
      discount_id: {
        type: Sequelize.INTEGER,
      },
      order_date: {
        type: Sequelize.DATE,
      },
      total_amount: {
        type: Sequelize.FLOAT,
      },
      discount_amount: {
        type: Sequelize.FLOAT,
      },
      received_amount: {
        type: Sequelize.FLOAT,
      },
      status: {
        type: Sequelize.BOOLEAN,
      }
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('invoice');
  }
};
