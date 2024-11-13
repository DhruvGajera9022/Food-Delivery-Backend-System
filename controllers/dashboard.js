const bcrypt = require("bcrypt");

const { body, validationResult } = require('express-validator');
require("dotenv").config();

const Users = require("../models/user");
const Category = require("../models/category");
const Product = require("../models/products");
const Invoice = require("../models/invoice");

const sessionHelper = require("../helpers/session_helper");



// To get Logged in User data
const getLoggedInUserData = async (req, res) => {
    const data = await sessionHelper.loggedInUserData(req);
    res.json(data);
}



// To display dashboard
const dashboard = async (req, res) => {

    const users = await Users.findAll({});
    const categories = await Category.findAll({});
    const products = await Product.findAll({});
    const invoices = await Invoice.findAll({});

    // Calculate total income by summing up each invoice's totalAmount
    const totalIncome = invoices.reduce((sum, invoice) => sum + (invoice.total_amount || 0), 0);

    // console.log(totalIncome);

    res.render("dashboard/dashboard", {
        title: "Dashboard",
        users: users.length,
        categories: categories.length,
        products: products.length,
        totalIncome: totalIncome,
    });
}
// To change password from dashboard
const dashboardChangePassword = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const id = req.session.user;

    let { password } = req.body;

    const hashedPassword = await bcrypt.hash(password, parseInt(process.env.SALT));

    let isUserUpdated = await Users.update(
        { password: hashedPassword }, { where: id }
    );

    if (isUserUpdated > 0) {
        return res.redirect("/");
    } else {
        res.send("<script>alert('password not updated');</script>")
    }
};
// To validate password fields
const validatePasswordChange = [
    body('password')
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters long.'),
    body('cpassword')
        .custom((value, { req }) => {
            if (value !== req.body.password) {
                throw new Error('Password confirmation does not match password.');
            }
            return true;
        }),
];



//To logout user
const logout = async (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error(err);
            res.status(500).send('Error logging out');
        } else {
            res.redirect("/login");
        }
    });

    res.clearCookie('userData');
}



module.exports = {
    dashboard,

    dashboardChangePassword,
    validatePasswordChange,

    getLoggedInUserData,

    logout,
}
