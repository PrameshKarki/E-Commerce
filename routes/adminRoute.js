//Import modules

const express = require('express');
const router = express.Router();

//Import Controller
const adminController = require('../controllers/adminController');

//Dont't invoke function
router.get('/products', adminController.getProducts);

router.get('/add-product', adminController.getAddProduct);

router.get("/edit-product/:productID", adminController.getEditProduct);

router.post("/edit-product", adminController.postEditProduct)

router.post("/delete-product", adminController.postDeleteProduct);

router.post('/submit', adminController.postSubmit);




//Export router
module.exports = router;