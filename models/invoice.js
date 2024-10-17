const { sequelize } = require("../config/config");
const { Sequelize, DataTypes } = require("sequelize");

const Invoice = sequelize.define("invoice", {
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
        type: Sequelize.INTEGER,
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
    },
    extra:{
        type: Sequelize.STRING,
    }
}, {
    timestamps: false,
    freezeTableName: true,
});

module.exports = Invoice