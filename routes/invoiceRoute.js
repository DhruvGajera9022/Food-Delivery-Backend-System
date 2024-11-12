const express = require("express");
const router = express.Router();

const invoiceController = require("../controllers/invoice");

const Middleware = require("../middlewares/auth_middleware");
const JWTMiddleware = require("../middlewares/jwt_token");


// Invoice route
router.get("/invoice", Middleware.authenticate, Middleware.isAdmin, invoiceController.invoice);

router.post("/invoice_delete/:id", invoiceController.deleteInvoice);


// API
router.get("/api/invoice", Middleware.authenticate, JWTMiddleware.JWTMiddleware, invoiceController.allInvoices);
router.get("/api/invoice/:id", Middleware.authenticate, JWTMiddleware.JWTMiddleware, invoiceController.singleInvoice);


module.exports = router;