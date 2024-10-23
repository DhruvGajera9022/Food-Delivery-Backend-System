const fs = require('fs');

const { check, validationResult } = require('express-validator');
require("dotenv").config();

const Users = require("../models/user");
const Address = require("../models/address");
const Invoice = require("../models/invoice");

const sessionHelper = require("../helpers/session_helper");
const dateHelper = require("../helpers/date_formator");



// To display profile page
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

    const allAddress = await Address.findAll({
        where: { user_Id: user.id },
        order: [
            ['isDefault', 'DESC'],
            ['id', 'DESC']
        ]
    });
    res.json(allAddress);
};
// To add-edit Address
const addAddress = async (req, res) => {
    const user = await sessionHelper.loggedInUserData(req);

    let { id, no, street, city, state, zipCode, landMark, country, type, isDefault, fullName, number } = req.body;

    isDefault = isDefault === "on";

    if (id) {
        if (isDefault == true) {
            await Address.update(
                { isDefault: false },
                { where: { user_Id: user.id } }
            );
        }
        const isAddressUpdated = await Address.update({
            no: no,
            street: street,
            city: city,
            state: state,
            zipCode: zipCode,
            landMark: landMark,
            country: country,
            type: type,
            isDefault: isDefault,
            user_Id: user.id,
            fullName: fullName,
            number: number,
        }, { where: { id: id } });

        if (isAddressUpdated > 0) {
            res.redirect("/profile");
        }
    } else {
        if (isDefault == true) {
            await Address.update(
                { isDefault: false },
                { where: { user_Id: user.id } }
            );
        }
        const isAddressAdded = await Address.create({
            no: no,
            street: street,
            city: city,
            state: state,
            zipCode: zipCode,
            landMark: landMark,
            country: country,
            type: type,
            isDefault: isDefault,
            user_Id: user.id,
            fullName: fullName,
            number: number,
        });

        if (isAddressAdded) {
            res.redirect("/profile");
        }

    }

}
// To delete Address
const deleteAddress = async (req, res) => {
    const aid = req.params.id;

    const isAddressDeleted = await Address.destroy({ where: { id: aid } });

    if (isAddressDeleted) {
        res.redirect("/profile");
    }
}
// Validate address fields
const validateAddress = [
    check('no')
        .notEmpty().withMessage('House number is required.')
        .isNumeric().withMessage('House number must be numeric.'),

    check('street')
        .notEmpty().withMessage('Street is required.')
        .isString().withMessage('Street must be a string.'),

    check('city')
        .notEmpty().withMessage('City is required.')
        .isString().withMessage('City must be a string.'),

    check('state')
        .notEmpty().withMessage('State is required.')
        .isString().withMessage('State must be a string.'),

    check('zipCode')
        .notEmpty().withMessage('Zip code is required.')
        .isPostalCode('any').withMessage('Invalid zip code format.'),

    check('country')
        .notEmpty().withMessage('Country is required.')
        .isString().withMessage('Country must be a string.'),

    check('type')
        .notEmpty().withMessage('Address type is required.')
        .isIn(['Work', 'Home', 'Office']).withMessage('Invalid address type.'),

    check('fullName')
        .notEmpty().withMessage('Full name is required.')
        .isString().withMessage('Full name must be a string.'),

    check('number')
        .notEmpty().withMessage('Phone number is required.')
        .isMobilePhone().withMessage('Invalid phone number format.')
];



// get API for address
const addressAPI = async (req, res) => {
    let addresses = await Address.findAll({
        order: [
            ['isDefault', 'DESC'],
            ['id', 'DESC'],
        ]
    });

    return res.json({
        status: true,
        data: addresses
    });
}
// post API for address
const postAddressAPI = async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.json({ errors: errors.array() });
    }

    // Get user ID from JWT (set by JWTMiddleware)
    const userId = req.id;

    let {
        id, no, street, city, state, zipCode,
        landMark, country, type, isDefault,
        fullName, number
    } = req.body;

    isDefault = isDefault === "on";


    if (id) {
        // Update existing address
        if (isDefault === true) {
            await Address.update(
                { isDefault: false },
                { where: { user_Id: userId } }
            );
        }

        const isAddressUpdated = await Address.update({
            no, street, city, state, zipCode,
            landMark, country, type, isDefault,
            user_Id: userId, fullName, number
        }, { where: { id: id } });

        if (isAddressUpdated > 0) {
            return res.json({
                message: 'Address updated successfully!',
                address: { id, no, street, city, state, zipCode, landMark, country, type, isDefault, user_Id: userId, fullName, number }
            });
        } else {
            return res.json({ message: 'Failed to update address.' });
        }

    } else {
        // Add new address
        if (isDefault === true) {
            await Address.update(
                { isDefault: false },
                { where: { user_Id: userId } }
            );
        }

        const newAddress = await Address.create({
            no, street, city, state, zipCode,
            landMark, country, type, isDefault,
            user_Id: userId, fullName, number
        });

        if (newAddress) {
            return res.json({
                message: 'Address added successfully!',
                address: newAddress
            });
        } else {
            return res.json({ message: 'Failed to add new address.' });
        }
    }
};
// get API for all data of current user
const meAPI = async (req, res) => {
    const data = await sessionHelper.loggedInUserData(req);
    const userData = await Users.findOne({ where: { id: data.id } });
    let baseURL = `${process.env.URL}${process.env.PORT}`;

    let addresses = await Address.findAll({
        order: [
            ['isDefault', 'DESC'],
            ['id', 'DESC'],
        ]
    });

    const formattedUserData = {
        id: userData.id,
        fullName: userData.fullName,
        email: userData.email,
        number: userData.number,
        gender: userData.gender,
        dob: userData.dob,
        hobbies: userData.hobbies,
        image: `${baseURL}/img/userImages/${userData.image}`,
        role: userData.role,
    };

    const invoice = await Invoice.findAll({
        where: { user_id: data.id }
    });

    res.json({
        status: true,
        userData: formattedUserData,
        user_addresses: addresses,
        invoice: invoice,
    });
}


module.exports = {

    profile,
    editProfile,
    validateProfileUpdate,

    getAddress,
    addAddress,
    deleteAddress,

    validateAddress,

    addressAPI,
    postAddressAPI,
    meAPI,
}
