//Import product model
const Product = require('../models/product');
const Cart = require("../models/cart");
const e = require('express');

const getProducts = (req, res, next) => {
    Product.fetchAll(products => {
        res.render('shop/product-list', {
            pageTitle: "Products-webTRON Shop",
            path: "/products",
            products: products
        });
    });


}
const getProduct = (req, res, next) => {
    const ID = +req.params.productID;
    Product.fetchByID(ID, (product => {
        res.render("shop/product-detail", {
            pageTitle: "Product Title-webTRON Shop",
            path: "/products",
            product: product
        })

    }))

}

const getHome = (req, res, next) => {
    Product.fetchAll(products => {
        res.render('shop/index', {
            pageTitle: "Welcome-webTRON Shop",
            path: "/",
            products: products
        });
    });
}

const getCart = (req, res, next) => {
    Cart.getCart((cart) => {
        Product.fetchAll(products => {
            const productsInCart = [];
            if (cart.products)
                for (element of products) {
                    let selectedProduct;
                    selectedProduct = cart.products.find(prod => element.ID === prod.ID);
                    if (selectedProduct) {
                        productsInCart.push({ product: element, qty: selectedProduct.qty });
                    }
                }
            res.render('shop/cart', {
                pageTitle: "Your Cart-webTRON Shop",
                path: "/cart",
                products: productsInCart,
                totalPrice: cart.totalPrice
            })

        })
    })
}

const getOrders = (req, res, next) => {
    res.render("shop/orders", {
        pageTitle: "Your orders",
        path: "/orders"
    })
}
exports.postCart = (req, res, next) => {
    const id = +req.body.productID;
    Product.fetchByID(id, (product) => {
        Cart.addProduct(id, product.price);

    })
    res.redirect("/");
}

exports.postDeleteCartItem = (req, res, next) => {
    const productID = +req.body.productID;
    Product.fetchByID(productID, (product) => {

        Cart.deleteProduct(productID, product.price);
    })
    res.redirect("/cart");
}

module.exports.getProducts = getProducts;
module.exports.getProduct = getProduct;
module.exports.getCart = getCart;
module.exports.getHome = getHome;
module.exports.getOrders = getOrders;


// Tips:Here we can clearly see that controller works as a middleman between Models and Views