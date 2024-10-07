const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth");
const userController = require("../controllers/user");
const roleController = require("../controllers/role");

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


// Users route
router.get("/users", userController.allUsersData);


// Add-Edit-Delete User route
router.get("/user/:id?", userController.displayUserFormPage);
router.post("/add_user", userController.userValidationRules, userController.addOrEditUser);
router.post("/user/delete/:id", userController.deleteUser);


// Role route
router.get("/role", roleController.roles);


// Add-Edit-Delete Role route
router.get("/add_role/:id?", roleController.displayRolePage);
router.post("/add_role", roleController.roleValidationRules, roleController.addOrEditRole);
router.post("/add_role/delete/:id", roleController.deleteRole);


// Profile route
router.get("/profile", userController.profile);
router.post("/profile", userController.upload, userController.validateProfileUpdate, userController.editProfile);


// Logout route
router.get("/user_logout", userController.logout);


module.exports = router;
