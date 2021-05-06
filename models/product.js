//Import database
const db = require("../utils/database");

//Cart Model
const Cart = require("./cart");


class Product {
    constructor(title, price, description, imageURL) {
        this.title = title;
        this.price = price;
        this.imageURL = imageURL;
        this.description = description;
    }
    save() {
        return db.execute("INSERT INTO products(title,price,imageURL,description) VALUES(?,?,?,?)", [this.title, this.price, this.imageURL, this.description]);

    }
    static fetchAll() {
        return db.execute("SELECT * FROM products");

    }
    static fetchByID(ID) {
        return db.execute("SELECT * from products WHERE ID=?", [ID]);

    }
    static update(obj, ID) {
        return db.execute("UPDATE products SET title=?,price=?,imageURL=?,description=? WHERE ID=?", [obj.title, obj.price, obj.imageURL, obj.description, ID]);

    }
    static deleteByID(ID) {
        return db.execute("DELETE FROM products WHERE ID=?",[ID]);
    }
}

//Export Product class
module.exports = Product;