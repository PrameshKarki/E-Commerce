//Import product model
const Product = require('../models/product');
const Order = require("../models/order");
const User = require("../models/user");

const getProducts = (req, res, next) => {
    Product.find().then((products) => {
        res.render('shop/product-list', {
            pageTitle: "Products-webTRON Shop",
            path: "/products",
            products: products,
            isAuthenticated: req.session.isLoggedIn

        });
    }).catch(err => console.log(err));


}
const getProduct = (req, res, next) => {
    const ID = req.params.productID;
    Product.findById(ID).then(product => {
        res.render("shop/product-detail", {
            pageTitle: "Product Title-webTRON Shop",
            path: "/products",
            product: product,
            isAuthenticated: req.session.isLoggedIn

        })
    }).catch(err => {
        console.log(err);
    })

}

const getHome = (req, res, next) => {
    console.log("isAuthenticated", req.session.isLoggedIn);
    Product.find().then(products => {
        res.render('shop/index', {
            pageTitle: "Welcome to webTRON Shop",
            path: "/",
            products: products,
            isAuthenticated: req.session.isLoggedIn

        });
    }).catch(err => console.log(err));
}

const getCart = (req, res, next) => {
    req.user.populate("cart.items.productID").execPopulate().then(user => {
        const data = user.cart.items;
        let totalPrice = 0;
        data.forEach(element => totalPrice += element.quantity * element.productID.price)
        res.render('shop/cart', {
            pageTitle: "Your Cart-webTRON Shop",
            path: "/cart",
            products: data,
            totalPrice: totalPrice,
            isAuthenticated: req.session.isLoggedIn

        })
    }).catch(err => {
        console.log(err);
    })
}

const getOrders = (req, res, next) => {
    let totalPrice = 0;
    Order.find({ "userID": req.user._id }).then((data) => {
        data.forEach(d => {
            d.items.forEach(i => {
                totalPrice += i.details.price * i.quantity;
            })
        })
        res.render("shop/orders", {
            pageTitle: "Your orders",
            path: "/orders",
            data: data,
            totalPrice: totalPrice,
            isAuthenticated: req.session.isLoggedIn

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

    req.user.orderPlace(() => {
        res.redirect("/orders");
    })

}

module.exports.getProducts = getProducts;
module.exports.getProduct = getProduct;
module.exports.getCart = getCart;
module.exports.getHome = getHome;
module.exports.getOrders = getOrders;


// Tips:Here we can clearly see that controller works as a middleman between Models and Views