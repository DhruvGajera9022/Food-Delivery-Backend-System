const bcrypt = require("bcrypt");
const Users = require("../models/user");
const { body, validationResult } = require('express-validator');
require("dotenv").config();
const multer = require("multer");

// Image upload setup
let storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "./uploads");
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + "-" + Date.now() + "-" + file.originalname);
    },
});

const upload = multer({
    storage: storage,
}).single("image"); // Single file upload for image

//To display dashboard
const dashboard = async (req, res) => {
    const id = req.session.user;
    let data = await Users.findOne({ where: id });

    if (id) {
        res.render("dashboard", { title: "Dashboard", userData: data });
    } else {
        res.redirect("/login");
    }
}

//To display users
const users = async (req, res) => {
    const id = req.session.user;
    let data = await Users.findOne({ where: id });
    let allData = await Users.findAll({});

    if (id) {
        res.render("users", { title: "Users", userData: data, allData: allData });
    } else {
        res.redirect("/login");
    }
}

//To display profile
const profile = async (req, res) => {
    const id = req.session.user;
    let data = await Users.findOne({ where: id });

    if (id) {
        res.render("user_profile", { title: "Profile", userData: data });
    } else {
        res.redirect("/login");
    }
}

// To edit profile
const editProfile = async (req, res) => {
    const user = req.session.user;

    const { fullname, email } = req.body;

    console.log(user.id);

    const rowsUpdated = await Users.update(
        {
            fullName: fullname,
            email: email,
        },
        { where: user.id }
    );

    console.log(rowsUpdated);

    if (rowsUpdated === 0) {
        return res.status(404).json({ message: "User not found or no changes made." });
    }

    if (rowsUpdated > 0) {
        res.redirect("/profile");
    }
};


const validateProfileUpdate = [
    body("fullName")
        .notEmpty()
        .withMessage("Full name is required")
        .isLength({ min: 3 })
        .withMessage("Full name must be at least 3 characters long"),
    body("email")
        .isEmail()
        .withMessage("Please provide a valid email address"),
    body("number")
        .optional()
        .isMobilePhone()
        .withMessage("Please provide a valid phone number"),
    body("gender")
        .optional()
        .isIn(["Male", "Female"])
        .withMessage("Gender must be either 'Male' or 'Female'"),
    body("dob")
        .optional()
        .isDate()
        .withMessage("Please provide a valid date of birth"),
    body("hobby")
        .optional()
        .isArray()
        .withMessage("Hobbies should be an array"),
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
}

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


module.exports = {
    dashboard,
    users,

    profile,
    editProfile,
    validateProfileUpdate,

    dashboardChangePassword,
    validatePasswordChange,

    logout,
}