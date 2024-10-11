const multer = require("multer");


// Image upload setup for user
let storageForUserImage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "assets/img/userImages/");
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + "-" + Date.now() + "-" + file.originalname);
    },
});
const uploadUserImage = multer({
    storage: storageForUserImage,
}).single("image"); // Single file upload for image




// Image upload setup for category 
let storageForCategoryImage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "assets/img/categoryImages/");
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + "-" + Date.now() + "-" + file.originalname);
    },
});
const uploadCategoryImage = multer({
    storage: storageForCategoryImage,
}).single("image"); // Single file upload for image



// Image upload setup for product 
let storageForProductImage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "assets/img/productImages/");
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + "-" + Date.now() + "-" + file.originalname);
    },
});
const uploadProductImages = multer({
    storage: storageForProductImage,
}).single("image"); // Single file upload for image




module.exports = {
    uploadUserImage,
    uploadCategoryImage,
    uploadProductImages,
}