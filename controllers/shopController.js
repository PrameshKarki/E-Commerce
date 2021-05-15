const fs = require('fs');
const path = require('path');

//Import product model
const Product = require('../models/product');
const Order = require("../models/order");
const User = require("../models/user");

const PRODUCTS_PER_PAGE = 1;

const getProducts = (req, res, next) => {
    const page = +req.query.page || 1;
    Product.countDocuments().then(totalProducts => {
        Product.find()
            .skip((page - 1) * PRODUCTS_PER_PAGE)
            .limit(PRODUCTS_PER_PAGE)
            .then(products => {
                res.render('shop/product-list', {
                    pageTitle: "Products-webTRON Shop",
                    path: "/products",
                    products: products,
                    hasNextPage: PRODUCTS_PER_PAGE * page < totalProducts,
                    hasPreviousPage: page > 1,
                    nextPage: page + 1,
                    previousPage: page - 1,
                    lastPage: Math.ceil(totalProducts / PRODUCTS_PER_PAGE),
                    currentPage: page,
                    errMessage: req.flash("err-message"),
                });
            }).catch(err => {
                const error = new Error(err);
                error.httpStatusCode = 500;
                return next(error);
            });
    }).catch(err => {
        const error = new Error(err);
        error.httpStatusCode = 200;
        return next(error);
    })

}
const getProduct = (req, res, next) => {
    const ID = req.params.productID;
    Product.findById(ID).then(product => {
        res.render("shop/product-detail", {
            pageTitle: "Product Title-webTRON Shop",
            path: "/products",
            product: product,
            errMessage: req.flash("err-message"),

        })
    }).catch(err => {
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);

    })

}

const getHome = (req, res, next) => {
    const page = +req.query.page || 1;
    Product.countDocuments().then(totalProducts => {
        Product.find()
            .skip((page - 1) * PRODUCTS_PER_PAGE)
            .limit(PRODUCTS_PER_PAGE)
            .then(products => {
                res.render('shop/index', {
                    pageTitle: "Welcome to webTRON Shop",
                    path: "/",
                    products: products,
                    hasNextPage: PRODUCTS_PER_PAGE * page < totalProducts,
                    hasPreviousPage: page > 1,
                    nextPage: page + 1,
                    previousPage: page - 1,
                    lastPage: Math.ceil(totalProducts / PRODUCTS_PER_PAGE),
                    currentPage: page,
                    errMessage: req.flash("err-message"),

                });
            }).catch(err => {
                const error = new Error(err);
                error.httpStatusCode = 500;
                return next(error);
            });
    }).catch(err => {
        const error = new Error(err);
        error.httpStatusCode = 200;
        return next(error);
    })

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
            errMessage: req.flash("err-message"),

        })
    }).catch(err => {
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);

    })
}

const getOrders = (req, res, next) => {
    let totalPrice = 0;
    Order.find({ userID: req.user._id }).then((data) => {
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
            errMessage: req.flash("err-message"),

        })
    }).catch(err => {
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);

    })
}
exports.postCart = (req, res, next) => {
    const productID = req.body.productID;
    req.user.addToCart(productID).then(data => {
        res.redirect("/cart");
    }).catch(err => {
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);

    })


}

exports.postDeleteCartItem = (req, res, next) => {
    const productID = req.body.productID;
    req.user.removeCartProduct(productID).then(() => {
        res.redirect("/cart");

    }).catch(err => {
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);

    })
}

exports.postOrderItems = (req, res, next) => {

    req.user.orderPlace(() => {
        res.redirect("/orders");
    })

}

exports.getReceipt = (req, res, next) => {
    const orderID = req.params.orderID;
    const receiptName = `receipt-${orderID}.pdf`;
    const receiptPath = path.join('data', 'receipts', receiptName);

    Order.findOne({ _id: orderID }).then((order) => {
        if (order.userID.toString() === req.user._id.toString()) {
            const file = fs.createReadStream(receiptPath);
            res.setHeader("Content-Type", "application/pdf");
            res.setHeader("Content-Disposition", `inline;filename=${receiptName}`);
            file.pipe(res);

            // fs.readFile(receiptPath, (err, data) => {
            //     if (err) {
            //         return next(new Error(err));
            //     } else {
            //         res.setHeader("Content-Type", "application/pdf");
            //         res.setHeader("Content-Disposition", `inline;filename=${receiptName}`);
            //         res.send(data);
            //     }
            // })
        } else {
            next(new Error("Not Authorized!"));
        }

    }).catch(err => {
        next(new Error(err));
    })
}

module.exports.getProducts = getProducts;
module.exports.getProduct = getProduct;
module.exports.getCart = getCart;
module.exports.getHome = getHome;
module.exports.getOrders = getOrders;


// Tips:Here we can clearly see that controller works as a middleman between Models and Views