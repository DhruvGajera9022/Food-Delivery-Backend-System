const express = require("express");
const router = express.Router();

const paymentController = require("../controllers/payment");


// Payment route
router.post("/checkout", paymentController.payment);
router.post("/payment", paymentController.generateInvoice);


module.exports = router;