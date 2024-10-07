const Users = require("../models/user");
const Role = require("../models/role");
const { check, validationResult } = require('express-validator');
require("dotenv").config();


// To display role page
const roles = async (req, res) => {
    const id = req.session.user;
    let data = await Users.findOne({ where: id });
    let allData = await Role.findAll({});

    if (id) {
        res.render("role/role", { title: "Role", userData: data, allData });
    } else {
        res.redirect("/login");
    }
}


// To render page according to add or edit request
const displayRolePage = async (req, res) => {
    // Get logged-in user data from session
    const loggedInUser = req.session.user;

    // Check if user is logged in
    if (!loggedInUser || !loggedInUser.id) {
        return res.redirect("/login");
    }

    // Fetch logged-in user data
    let loggedInUserData = await Users.findOne({ where: loggedInUser.id });
    if (!loggedInUserData) {
        return res.status(404).send("Logged-in user not found.");
    }

    // Operation on role
    const id = req.params.id;

    // Fetch user data for the given ID
    if (id) {
        const role = await Role.findOne({ where: { id } });
        if (role) {
            res.render("role/add_role", {
                title: "Edit Role",
                userData: loggedInUserData,
                role: role
            });
        } else {
            return res.status(404).send("User not found.");
        }
    } else {
        // Render the page for adding a new user
        res.render("role/add_role", {
            title: "Add Role",
            userData: loggedInUserData,
            role: null,
        });
    }
}
// To add-edit role
const addOrEditRole = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    let { id, title, description } = req.body;

    if (id) {
        // edit role
        const isRoleUpdated = await Role.update({
            title: title,
            description: description,
        }, { where: { id: id } });
        if (isRoleUpdated > 0) {
            res.redirect("/role");
        }
    } else {
        // add role
        const isRoleAdded = await Role.create({
            title: title,
            description: description,
        });
        if (isRoleAdded) {
            res.redirect("/role");
        }
    }
}
// To delete role
const deleteRole = async (req, res) => {
    const id = req.params.id;

    await Role.destroy({ where: { id } });

    res.redirect("/role");
}
// To validate user fields
const roleValidationRules = [
    check('title')
        .trim()
        .isLength({ min: 1 }).withMessage('Title is required.'),
];


module.exports = {
    roles,

    displayRolePage,
    addOrEditRole,
    deleteRole,
    roleValidationRules,
};