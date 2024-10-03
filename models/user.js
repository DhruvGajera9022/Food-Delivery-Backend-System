const { sequelize } = require("../config/config");
const { Sequelize, DataTypes } = require("sequelize");

const Users = sequelize.define("users", {
    id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
    },
    fullName: {
        type: Sequelize.STRING,
    },
    email: {
        type: Sequelize.STRING,
    },
    password: {
        type: Sequelize.STRING,
    },
}, {
    timestamps: false,
    freezeTableName: true,
});

module.exports = Users