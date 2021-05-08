//Import product model
const Product = require('../models/product');
const Order = require("../models/order");

const getProducts = (req, res, next) => {
    Product.find().then((products) => {
        res.render('shop/product-list', {
            pageTitle: "Products-webTRON Shop",
            path: "/products",
            products: products
        });
    }).catch(err => console.log(err));


}
const getProduct = (req, res, next) => {
    const ID = req.params.productID;
    Product.findById(ID).then(product => {
        res.render("shop/product-detail", {
            pageTitle: "Product Title-webTRON Shop",
            path: "/products",
            product: product
        })
    }).catch(err => {
        console.log(err);
    })

}

const getHome = (req, res, next) => {
    Product.find().then(products => {
        res.render('shop/index', {
            pageTitle: "Welcome to webTRON Shop",
            path: "/",
            products: products
        });
    }).catch(err => console.log(err));
}

const getCart = (req, res, next) => {
    req.user.getCart().then(data => {
        let totalPrice = 0;
        data.forEach(element => totalPrice += element.quantity * element.price)
        res.render('shop/cart', {
            pageTitle: "Your Cart-webTRON Shop",
            path: "/cart",
            products: data,
            totalPrice: totalPrice
        })
    }).catch(err => {
        console.log(err);
    })
}

const getOrders = (req, res, next) => {
    let totalPrice = 0;
    req.user.getOrders().then((data) => {
        data.forEach(d => {
            d.items.forEach(product => {
                totalPrice += product.price * product.quantity;

            })
        })
        res.render("shop/orders", {
            pageTitle: "Your orders",
            path: "/orders",
            data: data,
            totalPrice: totalPrice
        })
    }).catch(err => {
        console.log(err);
    })
}
exports.postCart = (req, res, next) => {
    const productID = req.body.productID;
    req.user.addToCart(productID).then(data => {
        res.redirect("/cart");
    }).catch(err => {
        console.log(err);
    })


}

exports.postDeleteCartItem = (req, res, next) => {
    const productID = req.body.productID;
    req.user.removeCartProduct(productID).then(() => {
        res.redirect("/cart");

    }).catch(err => {
        console.log(err);
    })
}

exports.postOrderItems = (req, res, next) => {
    req.user.orderPlace().then(() => {
        res.redirect("/orders");

    }).catch(err => {
        console.log(err);
    });


}

module.exports.getProducts = getProducts;
module.exports.getProduct = getProduct;
module.exports.getCart = getCart;
module.exports.getHome = getHome;
module.exports.getOrders = getOrders;


// Tips:Here we can clearly see that controller works as a middleman between Models and Views