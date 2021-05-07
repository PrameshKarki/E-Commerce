//Import database
const mongodb = require("mongodb");

const getDB = require("../utils/database").getDB;
class Product {
    constructor(title, price, description, imageURL, id, userID) {
        this.title = title;
        this.price = price;
        this.imageURL = imageURL;
        this.description = description;
        this._id = id ? new mongodb.ObjectId(id) : null;
        this.userID = userID;
    }
    save() {
        const db = getDB();//It returns database connection
        if (!this._id)
            return db.collection("products").insertOne(this);
        else
            return db.collection("products").updateOne({ _id: this._id }, { $set: this });
    }
    static fetchAll() {
        const db = getDB();
        return db.collection("products").find().toArray();

    }
    static fetchByID(ID) {
        const db = getDB();
        return db.collection("products").find({ _id: new mongodb.ObjectId(ID) }).next();

    }

    static deleteByID(ID) {
        const db = getDB();
        return db.collection("products").deleteOne({ _id: new mongodb.ObjectId(ID) });
    }
}

//Export Product class
module.exports = Product;