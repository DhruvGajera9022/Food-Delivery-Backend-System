const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth");
const userController = require("../controllers/user");

// Login routes
router.get("/login", authController.loginPage);
router.post("/login", authController.validateLogin, authController.loginUser);

// Registration routes
router.get("/register", authController.registerPage);
router.post("/register", authController.validateRegistration, authController.registerUser);

// Forgot password routes
router.get("/forgot_password", authController.forgotPassword);
router.post("/forgot_password", authController.validateForgotPassword, authController.checkEmail);

// Password recovery routes
router.get("/recover_password/:id", authController.recoverPassword);
router.post("/recover_password/:id", authController.validatePasswordChange, authController.changePassword);

// Dashboard route
router.get("/", userController.dashboard);
router.post("/", userController.validatePasswordChange, userController.dashboardChangePassword);

// User route
router.get("/users", userController.users);
router.post("/users/delete/:id", userController.deleteUser);
router.get("/user/:id?", userController.fetchUserData);

// Add-Edit User route
// router.get("/add_user", userController.displayAddUserPage);
router.post("/add_user", userController.userValidationRules, userController.addUserPage);

// Profile route
router.get("/profile", userController.profile);
router.post("/profile", userController.upload, userController.validateProfileUpdate, userController.editProfile);

// Logout route
router.get("/user_logout", userController.logout);

module.exports = router;
