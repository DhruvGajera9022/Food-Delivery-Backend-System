const bcrypt = require("bcrypt");
const fs = require('fs');

const { check, body, validationResult } = require('express-validator');
require("dotenv").config();

const Users = require("../models/user");
const Address = require("../models/address");

const sessionHelper = require("../helpers/session_helper");
const dateHelper = require("../helpers/date_formator");



// To get Logged in User data
const getLoggedInUserData = async (req, res) => {
    const data = await sessionHelper.loggedInUserData(req);
    res.json(data);
}



// To display dashboard
const dashboard = async (req, res) => {
    res.render("dashboard/dashboard", { title: "Dashboard" });
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



// To display profile
const profile = async (req, res) => {
    const data = await sessionHelper.loggedInUserData(req);
    const address = await Address.findOne({ where: { id: data.id } });

    // Check if dob exists before formatting it
    data.formattedDob = dateHelper.formatDate(data.dob);
    data.hobbies = data.hobbies ? data.hobbies.split(',') : [];

    res.render("profile/user_profile", { title: "Profile", userData: data, userAddress: address });
};
// To edit profile
const editProfile = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const user = req.session.user;
    const { fullname, email, number, gender, dob, hobby, image_old } = req.body;
    let image = req.file ? req.file.filename : image_old;

    if (req.file && image_old) {
        fs.unlink(`assets/img/userImages/${image_old}`, (err) => {
            if (err) {
                console.error("Failed to delete old image:", err);
            }
        });
    }

    let userData = {
        fullName: fullname,
        image: image,
        role: user.role
    }

    const rowsUpdated = await Users.update(
        {
            fullName: fullname,
            email: email,
            number: number,
            gender: gender,
            dob: dob,
            hobbies: [hobby].join(", "),
            image: image,
        },
        {
            where: { id: user.id },
        }
    );

    if (rowsUpdated > 0 || rowsUpdated[0] === 0) {
        res.cookie('userData', userData);
        res.redirect("/profile");
    } else {
        return res.status(400).send('Profile update failed.');
    }

};
// Validation Middleware
const validateProfileUpdate = [
    check('fullname')
        .notEmpty()
        .withMessage('Full name is required')
        .isLength({ min: 3 })
        .withMessage('Full name must be at least 3 characters long'),
    check('email')
        .isEmail()
        .withMessage('Please provide a valid email address'),
    check('number')
        .optional()
        .isMobilePhone()
        .withMessage('Please provide a valid phone number'),
];

// To fetch all address
const getAddress = async (req, res) => {
    const user = req.session.user;

    const allAddress = await Address.findOne({ where: { userId: user.id } });
    res.json(allAddress);
};

// To add Address
const addAddress = async (req, res) => {
    const user = req.session.user;

    let { street, city, state, zipCode, landMark, country, type, isDefault } = req.body;

    isDefault = isDefault === "on";

    const isAddressAdded = await Address.create({
        street: street,
        city: city,
        state: state,
        zipCode: zipCode,
        landMark: landMark,
        country: country,
        type: type,
        isDefault: isDefault,
        userId: user.id,
    });

    if (isAddressAdded) {
        res.redirect("/profile");
    }

}


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

    profile,
    editProfile,
    validateProfileUpdate,

    getAddress,
    addAddress,

    dashboardChangePassword,
    validatePasswordChange,

    getLoggedInUserData,

    logout,
}
