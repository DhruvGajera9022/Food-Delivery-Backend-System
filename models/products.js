const { sequelize } = require("../config/config");
const { Sequelize, DataTypes } = require("sequelize");

const Products = sequelize.define("products", {
    id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
    },
    category_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
    },
    name: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    price: {
        type: Sequelize.FLOAT,
        allowNull: false,
    },
    description: {
        type: Sequelize.STRING
    },
    isActive: {
        type: Sequelize.BOOLEAN,
    },
    rating: {
        type: Sequelize.FLOAT,
    },
    image: {
        type: Sequelize.STRING,
    }
}, {
    timestamps: false,
    freezeTableName: true,
});

module.exports = Products