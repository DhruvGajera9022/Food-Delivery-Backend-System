const bcrypt = require("bcrypt");
const Users = require("../models/user");
require("dotenv").config();
const { check, validationResult } = require('express-validator');
const JWT = require("jsonwebtoken");
require("../passport");



// To display login page
const loginPage = (req, res) => {
    res.render("authentication/login_page", {
        errorMsg: [],
        formData: {},
    });
};
// To check user credentials
const loginUser = async (req, res) => {
    const errorMsg = [];
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        errors.array().forEach(err => {
            errorMsg.push({
                param: err.param,
                msg: err.msg,
                value: err.value,
                path: err.path,
            });
        });
        return res.render("authentication/login_page", {
            errorMsg,
            formData: req.body,
        });
    }

    let { email, password } = req.body;

    const user = await Users.findOne({ where: { email } });
    if (!user) {
        errorMsg.push({
            param: "email",
            msg: "Invalid email",
            value: email,
            path: 'email',
        });
        return res.render("authentication/login_page", {
            errorMsg,
            formData: req.body,
        });
    }

    let userData = {
        fullName: user.fullName,
        image: user.image,
        role: user.role
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (isPasswordValid) {
        req.session.user = { id: user.id, fullName: user.fullName };
        res.cookie('userData', userData);
        return res.redirect("/");
    } else {
        errorMsg.push({
            param: "password",
            msg: "Invalid password",
            value: password,
            path: 'password',
        });
        return res.render("authentication/login_page", {
            errorMsg,
            formData: req.body,
        });
    }
};
// To validate login fields
const validateLogin = [
    check('email', 'Email is required').notEmpty(),
    check('password', 'Password is required').notEmpty(),
];



// API for login
const loginAPI = async (req, res) => {
    const errorMsg = [];
    const errors = validationResult(req);

    // Check for validation errors
    if (!errors.isEmpty()) {
        errors.array().forEach(err => {
            errorMsg.push({
                param: err.param,
                msg: err.msg,
                value: err.value,
                path: err.path,
            });
        });

        return res.json({
            status: false,
            message: errorMsg,
        });
    }

    const { email, password } = req.body;

    const user = await Users.findOne({ where: { email } });
    if (!user) {
        errorMsg.push({
            param: "email",
            msg: "User with this email does not exist",
            value: email,
            path: 'email',
        });
        return res.json({
            status: false,
            message: errorMsg,
        });
    }

    // Compare provided password with hashed password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
        errorMsg.push({
            param: "password",
            msg: "Invalid password",
            value: password,
            path: 'password',
        });
        return res.json({
            status: false,
            message: errorMsg,
        });
    }

    // Generate JWT token
    const token = JWT.sign({ id: user.id }, process.env.TOKEN_SECRET);

    // Set session and cookie
    req.session.user = { id: user.id, fullName: user.fullName };
    res.cookie('userData', { id: user.id, fullName: user.fullName });

    let baseURL = `${process.env.URL}${process.env.PORT}`;

    return res.json({
        status: true,
        message: "Login successful",
        token: token,
        data: {
            fullName: user.fullName,
            email: user.email,
            image: `${baseURL}/img/userImages/${user.image}`,
        }
    });
};



// To display register page
const registerPage = (req, res) => {
    res.render("authentication/register_page", {
        errorMsg: [],
        formData: {},
    });
};
// To create a new user
const registerUser = async (req, res) => {
    const errorMsg = [];
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        errors.array().forEach(err => {
            errorMsg.push({
                param: err.param,
                msg: err.msg,
                value: err.value,
                path: err.path,
            });
        });
        return res.render("authentication/register_page", {
            errorMsg,
            formData: req.body,
        });
    }

    let { fullname, email, password } = req.body;

    const existingUser = await Users.findOne({ where: { email } });
    if (existingUser) {
        errorMsg.push({
            param: "email",
            msg: "User with this email already exists.",
            value: email,
            path: 'email',
        });
        return res.render("authentication/register_page", {
            errorMsg,
            formData: req.body,
        });
    }

    const hashedPassword = await bcrypt.hash(password, parseInt(process.env.SALT));

    const isUserCreated = await Users.create({
        fullName: fullname,
        email: email,
        password: hashedPassword,
    });

    if (isUserCreated) {
        res.redirect("/login");
    } else {
        errorMsg.push({
            param: "registration",
            msg: "User registration failed.",
            value: null,
            path: 'registration',
        });
        return res.render("authentication/register_page", {
            errorMsg,
            formData: req.body,
        });
    }
};
// To store data in database from google register
const registerWithGoogle = async (req, res) => {
    const { displayName, email, picture } = req.user;

    let user = await Users.findOne({ where: { email: email } });

    if (!user) {
        user = await Users.create({
            fullName: displayName,
            email: email,
            image: picture,
        });
    }

    let userData = {
        fullName: displayName,
        email: email,
        image: picture,
    }

    req.session.user = { id: user.id, fullName: user.fullName };
    res.cookie('userData', userData);
    res.redirect("/");
}
// To store data in database from facebook register
const registerWithFacebook = async (req, res) => {
    const { displayName, emails, photos } = req.user;

    const email = emails && emails[0] ? emails[0].value : null;

    let user = await Users.findOne({ where: { email: email } });

    if (!user) {
        user = await Users.create({
            fullName: displayName,
            email: email,
            image: photos ? photos[0].value : null,
        });
    }

    let userData = {
        fullName: displayName,
        email: email,
        image: photos ? photos[0].value : null,
    }


    req.session.user = { id: user.id, fullName: user.fullName };
    res.cookie('userData', userData);
    res.redirect("/");
}
// To validate register fields
const validateRegistration = [
    check('fullname', 'Full name is required').notEmpty(),
    check('email', 'Email is required').isEmail().withMessage('Enter a valid email'),
    check('password', 'Password must be at least 6 characters long').isLength({ min: 6 }),
    check('confirmpassword', 'Passwords do not match').custom((value, { req }) => value === req.body.password),
];


// API for registration
const registerAPI = async (req, res) => {
    const errorMsg = [];
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        errors.array().forEach(err => {
            errorMsg.push({
                param: err.param,
                msg: err.msg,
                value: err.value,
                path: err.path,
            });
        });

        return res.json({
            status: false,
            message: errorMsg,
        });
    }

    let { fullname, email, password } = req.body;

    const existingUser = await Users.findOne({ where: { email } });
    if (existingUser) {
        errorMsg.push({
            param: "email",
            msg: "User with this email already exists.",
            value: email,
            path: 'email',
        });
    }

    if (errorMsg.length == 0) {
        const hashedPassword = await bcrypt.hash(password, parseInt(process.env.SALT));

        const isUserCreated = await Users.create({
            fullName: fullname,
            email: email,
            password: hashedPassword,
        });

        if (isUserCreated) {
            message: "Registration successfull"
        } /*else {
            errorMsg.push({
                param: "registration",
                msg: "User registration failed.",
                value: null,
                path: 'registration',
            });
        }*/
    }

    return res.json({
        status: errorMsg.length > 0 ? false : true,
        message: errorMsg.length > 0 ? errorMsg : 'Registration successfull'
    });
}



// To display forgot-password page
const forgotPassword = (req, res) => {
    res.render("authentication/forgot_password", { errorMsg: [] });
};
// To handle forgot-password
const checkEmail = async (req, res) => {
    const errorMsg = [];
    const errors = validationResult(req);
    let { email } = req.body;

    if (!errors.isEmpty()) {
        errors.array().forEach(err => errorMsg.push(err.msg));
        return res.render("authentication/forgot_password", { errorMsg });
    }

    const user = await Users.findOne({ where: { email } });

    if (user) {
        res.redirect(`/recover_password/${user.id}`);
    } else {
        errorMsg.push("No user found with that email");
        return res.render("authentication/forgot_password", { errorMsg });
    }
};
// To validate forgot-password fields
const validateForgotPassword = [
    check('email', 'Email is required').isEmail().withMessage('Enter a valid email')
];



// To display recover-password
const recoverPassword = (req, res) => {
    const id = req.params.id;
    res.render("authentication/recover_password", { userId: id, errorMsg: [] });
};
// To change password
const changePassword = async (req, res) => {
    const errorMsg = [];
    const id = req.params.id;
    let { password } = req.body;

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        errors.array().forEach(err => errorMsg.push(err.msg));
        return res.render("authentication/recover_password", { userId: id, errorMsg });
    }

    const hashedPassword = await bcrypt.hash(password, parseInt(process.env.SALT));

    const isPasswordUpdated = await Users.update(
        { password: hashedPassword },
        { where: { id: id } }
    );

    if (isPasswordUpdated > 0) {
        return res.redirect("/login");
    } else {
        errorMsg.push("User not found or password update failed.");
        return res.render("authentication/recover_password", { userId: id, errorMsg });
    }
};
// To validate password fields
const validatePasswordChange = [
    check('password', 'Password must be at least 6 characters long').isLength({ min: 6 }),
    check('confirmpassword', 'Passwords do not match').custom((value, { req }) => value === req.body.password),
];



module.exports = {
    loginPage,
    loginUser,
    validateLogin,

    loginAPI,

    registerPage,
    registerUser,
    registerWithGoogle,
    registerWithFacebook,
    validateRegistration,

    registerAPI,

    forgotPassword,
    checkEmail,
    validateForgotPassword,

    recoverPassword,
    changePassword,
    validatePasswordChange,
};
