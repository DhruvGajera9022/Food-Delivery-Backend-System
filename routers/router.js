const express = require("express");
const router = express.Router();

const passport = require("passport");
require("../passport");

const authController = require("../controllers/auth");
const dashboardController = require("../controllers/dashboard");
const profileController = require("../controllers/profile");
const userController = require("../controllers/user");
const roleController = require("../controllers/role");
const categoryController = require("../controllers/category");
const productController = require("../controllers/products");
const invoiceController = require("../controllers/invoice");
const settingsController = require("../controllers/settings");

const imageHelper = require("../helpers//store_image");

const Middleware = require("../middlewares/auth_middleware");


router.use(passport.initialize());
router.use(passport.session());


// Login routes
router.get("/login", Middleware.reverseAuthenticate, authController.loginPage);
router.post("/login", authController.validateLogin, authController.loginUser);


// Registration routes
router.get("/register", Middleware.reverseAuthenticate, authController.registerPage);
router.post("/register", authController.validateRegistration, authController.registerUser);
router.get("/auth/google", passport.authenticate('google', { scope: ['email', 'profile'] }));
router.get("/auth/google/callback",
    passport.authenticate('google', {
        failureRedirect: '/register',
    }), authController.registerWithGoogle);


// Forgot password routes
router.get("/forgot_password", Middleware.reverseAuthenticate, authController.forgotPassword);
router.post("/forgot_password", authController.validateForgotPassword, authController.checkEmail);


// Password recovery routes
router.get("/recover_password/:id", Middleware.reverseAuthenticate, authController.recoverPassword);
router.post("/recover_password/:id", authController.validatePasswordChange, authController.changePassword);


// Dashboard route
router.get("/", Middleware.authenticate, dashboardController.dashboard);
router.post("/", dashboardController.validatePasswordChange, dashboardController.dashboardChangePassword);
router.get("/getData", Middleware.authenticate, dashboardController.getLoggedInUserData);



// Users route
router.get("/users", Middleware.authenticate, Middleware.isAdmin, userController.allUsersData);


// Add-Edit-Delete User route
router.get("/user/:id?", Middleware.authenticate, Middleware.isAdmin, userController.displayUserFormPage);
router.post("/add_user", userController.userValidationRules, userController.addOrEditUser);
router.post("/user/delete/:id", userController.deleteUser);


// Role route
router.get("/role", Middleware.authenticate, Middleware.isAdmin, roleController.roles);
router.get("/getRoles", Middleware.authenticate, Middleware.isAdmin, roleController.getRole);


// Add-Edit-Delete Role route
router.get("/add_role/:id?", Middleware.authenticate, Middleware.isAdmin, roleController.displayRolePage);
router.post("/add_role", roleController.roleValidationRules, roleController.addOrEditRole);
router.post("/add_role/delete/:id", roleController.deleteRole);


// Category Route
router.get("/category", Middleware.authenticate, Middleware.isAdmin, categoryController.categories);
router.get("/getCategory", Middleware.authenticate, Middleware.isAdmin, categoryController.getCategory);


// Add-Edit-Delete Category route
router.get("/add_category/:id?", Middleware.authenticate, Middleware.isAdmin, categoryController.displayCategoryPage);
router.post("/add_category", imageHelper.uploadCategoryImage, categoryController.categoryValidationRules, categoryController.addOrEditCategory);
router.post("/add_category/delete/:id", categoryController.deleteCategory);


// Product route
router.get("/product", Middleware.authenticate, Middleware.isAdmin, productController.products);


// Add-Edit-Delete Product route
router.get("/add_product/:id?", Middleware.authenticate, Middleware.isAdmin, productController.displayProductPage);
router.post("/add_product", imageHelper.uploadProductImages, productController.productValidationRules, productController.addOrEditProduct);
router.post("/add_product/delete/:id?", productController.deleteProduct);


// Invoice route
router.get("/invoice", Middleware.authenticate, Middleware.isAdmin, invoiceController.invoice);


// Settings
router.get("/getSettings", settingsController.getSettings);
router.get('/settings/:id?', Middleware.authenticate, Middleware.isAdmin, settingsController.displaySettings);


// Add-Edit-Delete Setting route
router.post("/add_settings", imageHelper.uploadSettingImages, settingsController.addSettings);


// Profile route
router.get("/profile", Middleware.authenticate, profileController.profile);
router.post("/profile", imageHelper.uploadUserImage, profileController.validateProfileUpdate, profileController.editProfile);


// Address route
router.get("/getProfile", Middleware.authenticate, profileController.getAddress);
router.post("/address/:id?", Middleware.authenticate, profileController.addAddress);
router.post("/address/delete/:id?", Middleware.authenticate, profileController.deleteAddress);


// Logout route
router.get("/user_logout", dashboardController.logout);


// APIs
router.get("/api/category", categoryController.categoriesAPI);
router.get("/api/products", productController.productsAPI);
router.get("/api/address", profileController.addressAPI);
router.post("/api/login", authController.loginAPI);
router.post("/api/register", authController.validateRegistration, authController.registerAPI);
router.get("/api/settings", settingsController.settingsAPI);


module.exports = router;