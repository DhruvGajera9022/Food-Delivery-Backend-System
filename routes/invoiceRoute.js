const express = require("express");
const router = express.Router();

const invoiceController = require("../controllers/invoice");

const Middleware = require("../middlewares/auth_middleware");


// Invoice route
router.get("/invoice", Middleware.authenticate, Middleware.isAdmin, invoiceController.invoice);


module.exports = router;