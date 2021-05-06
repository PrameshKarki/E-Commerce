//Import product model
const Product = require('../models/product');
const Cart = require("../models/cart");
const Order = require("../models/order");

const getProducts = (req, res, next) => {
    Product.fetchAll().then(([rows, fieldData]) => {
        res.render('shop/product-list', {
            pageTitle: "Products-webTRON Shop",
            path: "/products",
            products: rows
        });
    }).catch(err => console.log(err));


}
const getProduct = (req, res, next) => {
    const ID = +req.params.productID;
    Product.fetchByID(ID).then(([product]) => {
        res.render("shop/product-detail", {
            pageTitle: "Product Title-webTRON Shop",
            path: "/products",
            product: product[0]
        })
    }).catch(err => {
        console.log(err);
    })

}

const getHome = (req, res, next) => {
    Product.fetchAll().then(([rows, fieldData]) => {
        res.render('shop/index', {
            pageTitle: "Welcome to webTRON Shop",
            path: "/",
            products: rows
        });
    }).catch(err => console.log(err));
}

const getCart = (req, res, next) => {
    const userID = req.user.ID;
    Cart.fetch(userID).then(([data]) => {
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
    const userID = req.user.ID;
    let totalPrice = 0;
    Order.fetch(userID).then(([products]) => {
        products.forEach(element => totalPrice += element.quantity * element.price);
        res.render("shop/orders", {
            pageTitle: "Your orders",
            path: "/orders",
            products: products,
            totalPrice: totalPrice
        })
    }).catch(err => {
        console.log(error);
    })
}
exports.postCart = (req, res, next) => {
    const id = +req.body.productID;
    const userID = req.user;
    Cart.save(req.user.ID, id).then(() => {
        res.redirect("/");

    }).catch(err => {
        console.log(err);
    })
}

exports.postDeleteCartItem = (req, res, next) => {
    const productID = +req.body.productID;
    const userID = req.user.ID;
    Cart.removeProduct(userID, productID).then(() => {
        res.redirect("/cart");

    }).catch(err => {
        console.log(err);
    })
}

exports.postOrderItems = (req, res, next) => {
    const userID = req.user.ID;
    Order.place(userID);
    res.redirect("/orders");


}

module.exports.getProducts = getProducts;
module.exports.getProduct = getProduct;
module.exports.getCart = getCart;
module.exports.getHome = getHome;
module.exports.getOrders = getOrders;


// Tips:Here we can clearly see that controller works as a middleman between Models and Views