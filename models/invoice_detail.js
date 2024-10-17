const { sequelize } = require("../config/config");
const { Sequelize, DataTypes } = require("sequelize");

const InvoiceDetail = sequelize.define("invoice_detail", {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
    },
    invoice_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
    },
    product_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
    },
    qty: {
        type: Sequelize.INTEGER,
        allowNull: false,
    },
    price: {
        type: Sequelize.FLOAT,
        allowNull: false,
    },
}, {
    timestamps: false,
    freezeTableName: true,
});

module.exports = InvoiceDetail