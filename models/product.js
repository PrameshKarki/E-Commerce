//Import Modules
const fs = require('fs');
const path = require('path');

//Import root directory path
const rootPath = require('../utils/rootPath');

//Cart Model
const Cart = require("./cart");


class Product {
    constructor(ID, title, price, description, imageURL) {
        this.ID = ID;
        this.title = title;
        this.price = price;
        this.imageURL = imageURL;
        this.description = description;
    }
    save() {
        const p = path.join(rootPath, 'data', 'products.json');
        fs.readFile(p, (err, data) => {
            let products = [];
            if (!err) {
                products = JSON.parse(data);
            }
            products.push(this);
            //Here this refers to current object due to the Arrow function this binding

            //Insert new content again
            fs.writeFile(p, JSON.stringify(products), (err) => {
                console.log(err);
            })
        })



    }
    static fetchAll(cb) {
        const p = path.join(rootPath, 'data', 'products.json');
        fs.readFile(p, (err, data) => {
            if (!err) {
                cb(JSON.parse(data));
            } else {
                cb([]);
            }
        })
    }
    static fetchByID(ID, cb) {
        const p = path.join(rootPath, 'data', 'products.json');
        fs.readFile(p, (err, data) => {
            if (!err) {
                const productCollection = JSON.parse(data);
                let product = productCollection.find((element) => element.ID === ID);
                cb(product);
            }
            else {
                cb([]);
            }
        })
    }
    static update(obj) {
        let products = [];
        const p = path.join(rootPath, 'data', 'products.json');
        fs.readFile(p, (err, fileData) => {
            products = JSON.parse(fileData);
            let index = products.findIndex(prod => prod.ID === obj.ID);
            console.log(index);
            let updatedProducts = [...products];
            updatedProducts[index] = obj;
            fs.writeFile(p, JSON.stringify(updatedProducts), (err) => {
                console.log(err);
            })
        })
    }
    static deleteByID(ID) {
        const p = path.join(rootPath, "data", "products.json");
        fs.readFile(p, (err, fileContent) => {
            if (err)
                return;
            const products = JSON.parse(fileContent);
            const deletedProduct = products.find(prod => prod.ID === ID);
            const updatedProducts = products.filter(product => product.ID !== ID);

            fs.writeFile(p, JSON.stringify(updatedProducts), (err) => {
                if (!err) {
                    //Delete from cart also
                    Cart.deleteProduct(ID, deletedProduct.price);
                }
            })
        })
    }
}

//Export Product class
module.exports = Product;