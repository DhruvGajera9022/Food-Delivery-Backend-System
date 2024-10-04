const bcrypt = require("bcrypt");
const fs = require('fs');
const Users = require("../models/user");
const { check, body, validationResult } = require('express-validator');
require("dotenv").config();
const multer = require("multer");


// Image upload setup
let storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "assets/img/userImages/");
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + "-" + Date.now() + "-" + file.originalname);
    },
});
const upload = multer({
    storage: storage,
}).single("image"); // Single file upload for image


// To format date-of-birth
function formatDate(dateString) {
    if (!dateString) return '';

    const [year, month, day] = dateString.split('-');
    return `${day}/${month}/${year}`;
}


// To display dashboard
const dashboard = async (req, res) => {
    const id = req.session.user;
    let data = await Users.findOne({ where: id });

    if (id) {
        res.render("dashboard/dashboard", { title: "Dashboard", userData: data });
    } else {
        res.redirect("authentication/login");
    }
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


//To display users
const users = async (req, res) => {
    const id = req.session.user;
    let data = await Users.findOne({ where: id });
    let allData = await Users.findAll({});

    allData = allData.map(user => {
        return {
            ...user.dataValues,
            formattedDob: formatDate(user.dob)
        };
    });

    if (id) {
        res.render("users/users", { title: "Users", userData: data, allData });
    } else {
        res.redirect("authentication/login");
    }
}
// To display add user page
const displayAddUserPage = async (req, res) => {
    const id = req.session.user;
    let data = await Users.findOne({ where: id });

    if (id) {
        res.render("users/add_user", { title: "Add User", userData: data });
    } else {
        res.redirect("authentication/login");
    }
}
// To add user
const addUserPage = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { fullName, email, password, number, gender, dob, hobby } = req.body;

    let hashedPassword = await bcrypt.hash(password, parseInt(process.env.SALT));


    // Create user
    const isUserAdded = await Users.create({
        fullName: fullName,
        email: email,
        password: hashedPassword,
        number: number,
        gender: gender,
        dob: dob,
        hobbies: [hobby].join(", "),
    });

    if (isUserAdded) {
        return res.redirect("/users");
    } else {
        return res.status(500).json({ message: 'User could not be added.' });
    }
};
// To edit user
const fetchUserData = async (req, res) => {
    // Get logged-in user data from session
    const loggedInUser = req.session.user;

    // Check if user is logged in
    if (!loggedInUser || !loggedInUser.id) {
        return res.redirect("/authentication/login");
    }

    // Fetch logged-in user data
    let loggedInUserData = await Users.findOne({ where: { id: loggedInUser.id } });
    if (!loggedInUserData) {
        return res.status(404).send("Logged-in user not found.");
    }

    // Operation on user
    const id = req.params.id;

    // Fetch user data for the given ID
    if (id) {
        const user = await Users.findOne({ where: { id } });
        user.hobbies = user.hobbies ? user.hobbies.split(',') : [];
        if (user) {
            res.render("users/add_user", {
                title: "Edit User",
                userData: loggedInUserData,
                user: user
            });
        } else {
            return res.status(404).send("User not found.");
        }
    } else {
        // Render the page for adding a new user
        res.render("users/add_user", {
            title: "Add User",
            userData: loggedInUserData,
            user: null,
        });
    }
}


// To delete user
const deleteUser = async (req, res) => {
    const id = req.params.id;

    const user = await Users.findOne({
        attributes: ["image"],
        where: { id },
    });

    if (!user) {
        return res.status(404).send("User not found");
    }

    const image = user.image;

    await Users.destroy({ where: { id } });

    if (image) {
        const imagePath = `assets/img/userImages/${image}`;
        fs.unlink(imagePath, (err) => {
            if (err) {
                console.error("Failed to delete image:", err);
            }
        });
    }
    res.redirect("/users");
}
// To validate add user fields
const userValidationRules = [
    check('fullName')
        .trim()
        .isLength({ min: 1 }).withMessage('Full name is required.'),

    check('email')
        .normalizeEmail()
        .isEmail().withMessage('Please provide a valid email address.'),

    check('password')
        .isLength({ min: 6 }).withMessage('Password must be at least 6 characters long.'),

    check('cpassword')
        .custom((value, { req }) => {
            if (value !== req.body.password) {
                throw new Error('Passwords do not match.');
            }
            return true;
        }),

    check('number')
        .optional()
        .isMobilePhone().withMessage('Please provide a valid mobile number.'),

    check('gender')
        .optional()
        .isIn(['Male', 'Female', 'other'])
        .withMessage('Gender must be male, female, or other.'),

    check('dob')
        .optional()
        .isDate({ format: 'YYYY-MM-DD' })
        .withMessage('Please provide a valid date of birth.'),
];


//To display profile
const profile = async (req, res) => {
    const id = req.session.user;
    let data = await Users.findOne({ where: id });

    data.formattedDob = formatDate(data.dob);
    data.hobbies = data.hobbies ? data.hobbies.split(',') : [];

    if (id) {
        res.render("profile/user_profile", { title: "Profile", userData: data });
    } else {
        res.redirect("authentication/login");
    }
}
// To edit profile
const editProfile = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const user = req.session.user;
    const { fullname, email, number, gender, dob, image_old } = req.body;
    const hobby = Array.isArray(req.body.hobby) ? req.body.hobby.join(',') : '';
    let image = req.file ? req.file.filename : image_old;

    if (req.file && image_old) {
        fs.unlink(`assets/img/userImages/${image_old}`, (err) => {
            if (err) {
                console.error("Failed to delete old image:", err);
            }
        });
    }

    const rowsUpdated = await Users.update(
        {
            fullName: fullname,
            email: email,
            number: number,
            gender: gender,
            dob: dob,
            hobbies: hobby,
            image: image,
        },
        {
            where: { id: user.id },
        }
    );

    if (rowsUpdated[0] === 0) {
        return res.status(400).send('Profile update failed.');
    }

};
// Validation Middleware
const validateProfileUpdate = [
    body('fullname')
        .notEmpty()
        .withMessage('Full name is required')
        .isLength({ min: 3 })
        .withMessage('Full name must be at least 3 characters long'),
    body('email')
        .isEmail()
        .withMessage('Please provide a valid email address'),
    body('number')
        .optional()
        .isMobilePhone()
        .withMessage('Please provide a valid phone number'),
    body('gender')
        .optional()
        .isIn(['Male', 'Female'])
        .withMessage("Gender must be either 'Male' or 'Female'"),
    body('dob')
        .optional()
        .isDate()
        .withMessage('Please provide a valid date of birth'),
    body('hobby')
        .optional()
        .isArray()
        .withMessage('Hobbies should be an array'),
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


module.exports = {
    dashboard,

    users,
    displayAddUserPage,
    addUserPage,
    fetchUserData,
    deleteUser,
    userValidationRules,

    profile,
    editProfile,
    upload,
    validateProfileUpdate,

    dashboardChangePassword,
    validatePasswordChange,

    logout,
}