const express = require("express");
const router = express.Router();

const paymentController = require("../controllers/payment");

const JWTMiddleware = require("../middlewares/jwt_token");


// Payment route
router.post("/checkout", paymentController.payment);
router.post("/payment", JWTMiddleware.JWTMiddleware, paymentController.generateInvoice);


module.exports = router;