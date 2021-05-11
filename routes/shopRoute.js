//Import modules
const express = require('express');
const router = express.Router();

const shopController = require('../controllers/shopController');

//Import middleware to protect routes
const isAuth = require("../middleware/is-Auth");

router.get("/", shopController.getHome)

router.get("/products", shopController.getProducts);

router.get("/cart", isAuth, shopController.getCart);

router.post("/cart", isAuth, shopController.postCart);

router.get("/details/:productID", shopController.getProduct);

router.post("/delete-cart-item", isAuth, shopController.postDeleteCartItem);

router.post("/order-items", isAuth, shopController.postOrderItems);

router.get("/orders", isAuth, shopController.getOrders);


//Export router
module.exports = router;
