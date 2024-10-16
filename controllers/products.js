const { body, validationResult } = require('express-validator');
const Products = require("../models/products");
const categoryHelper = require("../helpers/fetch_category");
const fs = require("fs");


// To display product page
const products = async (req, res) => {
    let allData = await getAllProducts();

    allData = await Promise.all(allData.map(async (product) => {
        const categoryName = await categoryHelper.fetchCategory(product.category_id);
        return {
            ...product.dataValues,
            categoryName: categoryName,
        };
    }));

    res.render("products/products", {
        title: "Products",
        allData: allData,
    })
}


// To render page according to add or edit request
const displayProductPage = async (req, res) => {
    // Operation on product
    const id = req.params.id;

    // Fetch product data for the given ID
    if (id) {
        const product = await Products.findOne({ where: { id } });
        if (product) {
            res.render("products/add_product", {
                title: "Edit Product",
                product: product
            });
        } else {
            return res.status(404).send("Product not found.");
        }
    } else {
        // Render the page for adding a new product
        res.render("products/add_product", {
            title: "Add Product",
            product: null
        });
    }
}
// To add-edit product
const addOrEditProduct = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    let { id, name, price, description, active, rating, category, image_old } = req.body;
    let image = req.file ? req.file.filename : image_old;


    if (req.file && image_old) {
        fs.unlink(`assets/img/productImages/${image_old}`, (err) => {
            if (err) {
                console.error("Failed to delete old image:", err);
            }
        });
    }

    active = active === "on";

    if (id) {
        // edit product
        const isProductUpdated = await Products.update({
            category_id: category,
            name: name,
            price: price,
            description: description,
            isActive: active,
            rating: rating,
            image: image,
        }, { where: { id: id } });
        if (isProductUpdated > 0) {
            res.redirect("/product");
        }
    } else {
        // add category
        const isProductAdded = await Products.create({
            category_id: category,
            name: name,
            price: price,
            description: description,
            isActive: active,
            rating: rating,
            image: image,
        });
        if (isProductAdded) {
            res.redirect("/product");
        }
    }
}
// To delete product
const deleteProduct = async (req, res) => {
    const id = req.params.id;

    const product = await Products.findOne({
        attributes: ["image"],
        where: { id },
    });

    if (!product) {
        return res.status(404).send("Product not found");
    }

    const image = product.image;

    await Products.destroy({ where: { id } });

    if (image) {
        const imagePath = `assets/img/productImages/${image}`;
        fs.unlink(imagePath, (err) => {
            if (err) {
                console.error("Failed to delete image:", err);
            }
        });
    }
    res.redirect("/product");
}
// To validate product fields
const productValidationRules = [
    body('name')
        .notEmpty().withMessage('Name is required')
        .isString().withMessage('Name must be a string')
        .isLength({ min: 2 }).withMessage('Name must be at least 2 characters long'),

    body('price')
        .notEmpty().withMessage('Price is required')
        .withMessage('Price must be a positive number'),

    body('category')
        .notEmpty().withMessage('Category is required')
        .isString().withMessage('Category must be a string'),
];



// Fetch products
const getAllProducts = async () => {
    return await Products.findAll({
        order: [['id', 'DESC']]
    });
}


module.exports = {
    products,

    displayProductPage,
    addOrEditProduct,
    deleteProduct,
    productValidationRules,
}