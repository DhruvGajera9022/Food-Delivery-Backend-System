const Category = require("../models/category");
const { check, validationResult } = require('express-validator');
const fs = require('fs');



// To display category page
const categories = async (req, res) => {
    let allData = await getlAllCategory();
    res.render("category/category", { title: "Category", allData });
}



// To render page according to add or edit request
const displayCategoryPage = async (req, res) => {
    // Operation on category
    const id = req.params.id;

    // Fetch user data for the given ID
    if (id) {
        const category = await Category.findOne({ where: { id } });
        if (category) {
            res.render("category/add_category", {
                title: "Edit Category",
                category: category
            });
        } else {
            return res.status(404).send("Category not found.");
        }
    } else {
        // Render the page for adding a new user
        res.render("category/add_category", {
            title: "Add Category",
            category: null,
        });
    }
}
// To add-edit category
const addOrEditCategory = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    let { id, name, active, image_old } = req.body;
    let image = req.file ? req.file.filename : image_old;

    if (req.file && image_old) {
        fs.unlink(`assets/img/categoryImages/${image_old}`, (err) => {
            if (err) {
                console.error("Failed to delete old image:", err);
            }
        });
    }

    active = active === "on";

    if (id) {
        // edit category
        const isCategoryUpdated = await Category.update({
            name: name,
            isActive: active,
            image: image,
        }, { where: { id: id } });
        if (isCategoryUpdated > 0) {
            res.redirect("/category");
        }
    } else {
        // add category
        const isCategoryAdded = await Category.create({
            name: name,
            isActive: active,
            image: image,
        });
        if (isCategoryAdded) {
            res.redirect("/category");
        }
    }
}
// To delete category
const deleteCategory = async (req, res) => {
    const id = req.params.id;

    const category = await Category.findOne({
        attributes: ["image"],
        where: { id },
    });

    if (!category) {
        return res.status(404).send("Category not found");
    }

    const image = category.image;

    await Category.destroy({ where: { id } });

    if (image) {
        const imagePath = `assets/img/categoryImages/${image}`;
        fs.unlink(imagePath, (err) => {
            if (err) {
                console.error("Failed to delete image:", err);
            }
        });
    }
    res.redirect("/category");
}
// To validate category fields
const categoryValidationRules = [
    check('name')
        .trim()
        .isLength({ min: 1 }).withMessage('Name is required.'),
];



// To display all category in product form into dropdown
const getCategory = async (req, res) => {
    const categories = await getlAllCategory();
    res.json(categories);
};


// Fetch category
const getlAllCategory = async () => {
    return await Category.findAll({});
}


// API category
const categoriesAPI = async (req, res) => {
    let categories = await getlAllCategory();

    categories = categories.filter(category => category.isActive);

    categories = await Promise.all(categories.map(async (category) => {
        return {
            ...category.dataValues,
            image: `/img/categoryImages/${category.image}`
        };
    }));

    res.json(categories);
}


module.exports = {
    categories,

    getCategory,

    displayCategoryPage,
    addOrEditCategory,
    deleteCategory,
    categoryValidationRules,

    categoriesAPI,
}