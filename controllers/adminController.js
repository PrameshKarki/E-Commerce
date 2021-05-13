const { validationResult } = require('express-validator');
const Product = require('../models/product');

const getAddProduct = (req, res, next) => {
    res.render('admins/edit-product', {
        pageTitle: 'Add Product',
        path: "/admin/add-product",
        editMode: false,
        hasError: false,
        error: []

    });
};

module.exports.getEditProduct = (req, res, next) => {
    const editMode = req.query.edit;
    if (!editMode) {
        res.redirect('/');

    } else {
        const productID = req.params.productID;
        Product.find({ _id: productID, userId: req.user._id }).then(product => {
            if (product.length <= 0) {
                req.flash("err-message", "You are not authorized!");
                res.redirect('/admin/products');
            } else {
                res.render('admins/edit-product', {
                    pageTitle: "Edit Product",
                    path: "/admin/edit-product",
                    editMode: true,
                    hasError: false,
                    error: [],
                    product: product[0], //For single element only

                })
            }

        }).catch(err => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);

        })

    }


}

module.exports.postEditProduct = (req, res, next) => {
    const ID = req.body.ID;
    const updatedTitle = req.body.title;
    const updatedPrice = req.body.price;
    const image = req.file;
    const updatedDescription = req.body.description;
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        res.status(422).render("admins/edit-product.ejs", {
            pageTitle: "Edit Product",
            path: "/admin/edit-product",
            editMode: true,
            hasError: true,
            errMessage: errors.array().map(element => element.msg),
            error: errors.array(),
            product: {
                _id: ID,
                title: updatedTitle,
                description: updatedDescription,
                price: updatedPrice,
            }
        })

    } else {
        Product.findById(ID).then((product) => {
            if (req.user._id.toString() !== product.userId.toString()) {
                req.flash("err-message", "You are not authorized!");
                return res.redirect("/admin/products");
            }
            product.title = updatedTitle;
            product.price = updatedPrice;
            product.description = updatedDescription;
            if (image) {

                product.imageURL = image.path;
            }
            return product.save();
        }).then(() => {
            res.redirect("/admin/products");
        }).catch((err) => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);

        });

    }


}

module.exports.postDeleteProduct = (req, res, next) => {
    let ID = req.body.ID;
    Product.deleteOne({ _id: ID, userId: req.user._id }).then(() => {
        //Remove from cart too
        req.user.removeCartProduct(ID).then(() => {
            res.redirect("/admin/products");
        })
    }).catch(err => {
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
    });
}

const getProducts = (req, res, next) => {
    Product.find({ userId: req.user._id }).then((products) => {
        res.render('admins/products', {
            pageTitle: "Products-webTRON Shop",
            path: "/admin/products",
            products: products,

        });
    }).catch(err => {
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
    });
}

const postSubmit = (req, res, next) => {
    let body = JSON.parse(JSON.stringify(req.body));
    const title = body.title;
    const price = body.price;
    const description = body.description;
    const image = req.file;
    if (!image) {
        return res.status(422).render("admins/edit-product.ejs", {
            pageTitle: "Add Product-webTRON Shop",
            path: "/admin/add-product",
            editMode: false,
            hasError: true,
            errMessage: ["Invalid image type/format"],
            error: [],
            product: {
                title: title,
                price: price,
                description: description
            }
        })
    }
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(422).render("admins/edit-product.ejs", {
            pageTitle: "Add Product-webTRON Shop",
            path: "/admin/add-product",
            editMode: false,
            hasError: true,
            errMessage: errors.array().map(element => element.msg),
            error: errors.array(),
            product: {
                title: title,
                price: price,
                description: description
            }
        })

    } else {
        const imageURL = image.path;
        //Instantiate new Product
        const product = new Product({ title: title, price: price, description: description, imageURL: imageURL, userId: req.user._id });
        //Save product
        product.save().then(() => {
            res.redirect('/');

        }).catch(err => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);

        });
    }

};

module.exports.getAddProduct = getAddProduct;
module.exports.postSubmit = postSubmit;
module.exports.getProducts = getProducts;