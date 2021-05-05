//Import modules
const fs = require("fs");
const path = require("path");

//Import rootPath
const rootPath = require("../utils/rootPath");


//LOGIC:
//1.Fetch the previous cart
//2.Analyze the cart,Find Existing product
//3.Add New Product/Increase quantity
//[{id:"",quantity:""},totalPrice:""]

module.exports = class Cart {
    static addProduct(ID, price) {
        const p = path.join(rootPath, "data", "cart.json");
        //Fetch the previous product
        fs.readFile(p, (error, fileContent) => {
            let cart = { products: [], totalPrice: 0 };//Here cart is a object which has field products i.e array of objects
            if (!error) {
                cart = JSON.parse(fileContent);
            }
            //Analyze the cart=>Find existing product
            const existingProductIndex = cart.products.findIndex(prod => prod.ID === ID);
            console.log(existingProductIndex);
            const existingProduct = cart.products[existingProductIndex];
            let updatedProduct;
            if (existingProduct) {
                console.log("existing product");
                updatedProduct = { ...existingProduct };
                updatedProduct.qty = updatedProduct.qty + 1;

                cart.products = [...cart.products]
                cart.products[existingProductIndex] = updatedProduct;
            } else {
                console.log("new product");
                updatedProduct = { ID: ID, qty: 1 };
                cart.products = [...cart.products, updatedProduct];

            }
            cart.totalPrice = cart.totalPrice + +price;
            fs.writeFile(p, JSON.stringify(cart), (err) => {
                console.log(err);
            })
        })

    }
    static deleteProduct(ID, price) {
        const p = path.join(rootPath, "data", "cart.json");
        fs.readFile(p, (err, fileContent) => {
            if (err)
                return;
            const cart = JSON.parse(fileContent);
            let updatedCart = { ...cart };

            let product = updatedCart.products.find(prod => prod.ID === ID);
            if (!product)
                return;
            let quantity = product.qty;
            updatedCart.totalPrice -= quantity * price;
            updatedCart.products = updatedCart.products.filter(prod => prod.ID !== ID);

            //Write again in file
            fs.writeFile(p, JSON.stringify(updatedCart), (err) => {
                console.log(err);
            })
        })
    }
    static getCart(callback) {
        const p = path.join(rootPath, "data", "cart.json");
        //Read file
        fs.readFile(p, (err, fileContent) => {
            if (err) {
                callback([]);
            } else {
                const cart = JSON.parse(fileContent);
                callback(cart);
            }
        })
    }
}