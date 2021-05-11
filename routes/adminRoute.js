//Import modules

const express = require('express');
const router = express.Router();

//Import Controller
const adminController = require('../controllers/adminController');

//Import middleware to protect routes
const isAuth = require("../middleware/is-Auth");
//Dont't invoke function
router.get('/products', isAuth, adminController.getProducts);

router.get('/add-product', isAuth, adminController.getAddProduct);

router.get("/edit-product/:productID", isAuth, adminController.getEditProduct);

router.post("/edit-product", isAuth, adminController.postEditProduct)

router.post("/delete-product", isAuth, adminController.postDeleteProduct);

router.post('/submit', isAuth, adminController.postSubmit);




//Export router
module.exports = router;