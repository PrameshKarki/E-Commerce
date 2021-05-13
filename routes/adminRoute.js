//Import modules

const express = require('express');
const router = express.Router();

//Import validator
const { body } = require("express-validator/check");

//Import Controller
const adminController = require('../controllers/adminController');

//Import middleware to protect routes
const isAuth = require("../middleware/is-Auth");
//Dont't invoke function
router.get('/products', isAuth, adminController.getProducts);

router.get('/add-product', isAuth, adminController.getAddProduct);

router.get("/edit-product/:productID", isAuth, adminController.getEditProduct);

router.post("/edit-product", isAuth, [
    body("title", "Invalid title").isLength({ min: 3 }).trim(),
    body("price", "Price must be float value").isFloat().trim(),
    body("description", "Invalid description").isString().isLength({ min: 10, max: 255 }).trim()
], adminController.postEditProduct)

router.post("/delete-product", isAuth, adminController.postDeleteProduct);

router.post('/submit', isAuth, [
    body("title", "Invalid title").isLength({ min: 3 }).trim(),
    body("price", "Price must be float value").isFloat().trim(),
    body("description", "Invalid description").isString().isLength({ min: 10, max: 255 }).trim()


], adminController.postSubmit);






//Export router
module.exports = router;