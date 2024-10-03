const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth");
const userController = require("../controllers/user");

// Login routes
router.get("/", authController.loginPage);
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
router.get("/dashboard", userController.dashboard);
router.get("/users", userController.users);

module.exports = router;
