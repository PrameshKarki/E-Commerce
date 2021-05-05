//Import modules
const express = require('express');
const router = express.Router();

const shopController = require('../controllers/shopController');

router.get("/", shopController.getHome)

router.get("/products", shopController.getProducts);

router.get("/cart", shopController.getCart);

router.post("/cart", shopController.postCart);

router.get("/details/:productID", shopController.getProduct);

router.post("/delete-cart-item",shopController.postDeleteCartItem);

router.get("/checkout");

router.get("/orders", shopController.getOrders);

//Export router
module.exports = router;
