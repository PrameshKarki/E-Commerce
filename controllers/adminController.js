const Product = require('../models/product');

const getAddProduct = (req, res, next) => {
    res.render('admins/edit-product', {
        pageTitle: 'Add Product',
        path: "/admin/add-product",
        editMode: false
    });
};

module.exports.getEditProduct = (req, res, next) => {
    const editMode = req.query.edit;
    if (!editMode) {
        res.redirect('/');

    } else {
        const productID = +req.params.productID;
        Product.fetchByID(productID, (product) => {
            if (!product) {
                res.redirect('/');
            } else {
                res.render('admins/edit-product', {
                    pageTitle: "Edit Product",
                    path: "/admin/edit-product",
                    editMode: true,
                    product: product
                })
            }
        })

    }


}

module.exports.postEditProduct = (req, res, next) => {
    const ID = +req.body.ID;
    const updatedTitle = req.body.title;
    const updatedPrice = req.body.price;
    const updatedImageUrl = req.body.imageURL;
    const updatedDescription = req.body.description;

    const updatedProduct = new Product(ID, updatedTitle, updatedPrice, updatedDescription, updatedImageUrl);
    Product.update(updatedProduct);

    res.redirect("/admin/products");
}

module.exports.postDeleteProduct = (req, res, next) => {
    let ID = +req.body.ID;
    Product.deleteByID(ID);
    res.redirect("/admin/products");
}

const getProducts = (req, res, next) => {
    Product.fetchAll(products => {
        res.render('admins/products', {
            pageTitle: "Products-webTRON Shop",
            path: "/admin/products",
            products: products
        });
    });
}

const postSubmit = (req, res, next) => {
    let body = JSON.parse(JSON.stringify(req.body));
    const ID = Math.random();
    const title = body.title;
    const price = body.price;
    const imageURL = body.imageURL;
    const description = body.description;
    //Instantiate new Product
    const product = new Product(ID, title, price, description, imageURL);
    //Save product
    product.save();
    res.redirect('/');
};

module.exports.getAddProduct = getAddProduct;
module.exports.postSubmit = postSubmit;
module.exports.getProducts = getProducts;