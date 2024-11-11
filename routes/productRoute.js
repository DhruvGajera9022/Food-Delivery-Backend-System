const express = require("express");
const router = express.Router();

const productController = require("../controllers/products");

const Middleware = require("../middlewares/auth_middleware");
const imageHelper = require("../helpers/store_image");


// Product route
router.get("/product", Middleware.authenticate, Middleware.isAdmin, productController.products);


// Add-Edit-Delete Product route
router.get("/add_product/:id?", Middleware.authenticate, Middleware.isAdmin, productController.displayProductPage);
router.post("/add_product", imageHelper.uploadProductImages, productController.productValidationRules, productController.addOrEditProduct);
router.post("/add_product/delete/:id?", productController.deleteProduct);


router.get("/api/products", productController.productsAPI);


module.exports = router;