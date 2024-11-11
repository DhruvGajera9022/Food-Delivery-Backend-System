const express = require("express");
const router = express.Router();

const dashboardController = require("../controllers/dashboard");

const Middleware = require("../middlewares/auth_middleware");


// Dashboard route
router.get("/", Middleware.authenticate, dashboardController.dashboard);
router.post("/", dashboardController.validatePasswordChange, dashboardController.dashboardChangePassword);
router.get("/getData", Middleware.authenticate, dashboardController.getLoggedInUserData);


// Logout route
router.get("/user_logout", dashboardController.logout);


module.exports = router