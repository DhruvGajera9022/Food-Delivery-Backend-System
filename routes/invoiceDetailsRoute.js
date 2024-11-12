const express = require("express");
const router = express.Router();

const invoiceDetailsController = require("../controllers/invoiceDetails");


router.get("/api/invoice-details/:invoice_id", invoiceDetailsController.getInvoiceDetails);


module.exports = router;