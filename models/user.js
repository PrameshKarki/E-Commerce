//Import modules
const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: {
        type: String,
        require: true
    },
    email: {
        type: String,
        require: true
    },
    cart: {
        items: [{ productID: { type: Schema.Types.ObjectId, ref: "Product", require: true }, quantity: { type: Number, require: true } }]
    }
})

module.exports = mongoose.model("User", userSchema);

















// //Import database
// const getDB = require("../utils/database").getDB;
// const mongoDB = require("mongodb");
// const ObjectId = mongoDB.ObjectId;

// module.exports = class User {
//     constructor(givenName, givenEmail, cart, ID) {
//         this.name = givenName;
//         this.email = givenEmail;
//         this.cart = cart;
//         this._id = ID;
//     }
//     save() {
//         const db = getDB();
//         return db.collection("users").insertOne(this);
//     }
//     addToCart(productID) {
//         const db = getDB();
//         let updatedCart;
//         if (this.cart) {
//             //Check the current product is already exist in database or not
//             const cartItems = [...this.cart.items];
//             const productIndex = cartItems.findIndex(pro => pro.productID.toString() === productID);
//             if (productIndex >= 0) {
//                 cartItems[productIndex].quantity += 1;
//             } else {
//                 cartItems.push({ productID: new ObjectId(productID), quantity: 1 });
//             }
//             updatedCart = {
//                 items: cartItems
//             }

//         } else {
//             updatedCart = { items: [{ productID: new ObjectId(productID), quantity: 1 }] };

//         }
//         return db.collection("users").updateOne({ _id: new ObjectId(this._id) }, { $set: { cart: updatedCart } });

//     }
//     getCart() {
//         const db = getDB();
//         const productIDs = this.cart.items.map(i => i.productID);
//         return db.collection("products").find({ _id: { $in: productIDs } }).toArray()
//             .then(products => {
//                 return products.map(p => {
//                     return {
//                         ...p, quantity: this.cart.items.find(i => {
//                             return i.productID.toString() === p._id.toString();
//                         }).quantity
//                     }
//                 })
//             })
//     }
//     removeCartProduct(productID) {
//         const db = getDB();
//         const updatedCart = this.cart.items.filter(item => {
//             return item.productID.toString() !== productID;
//         })
//         return db.collection("users").updateOne({ _id: new ObjectId(this._id) }, { $set: { cart: { items: updatedCart } } });

//     }
//     orderPlace() {
//         const db = getDB();
//         return this.getCart().then((products) => {
//             const order = {
//                 user: {
//                     _id: new ObjectId(this._id)
//                 },
//                 items: products
//             }
//             return db.collection("orders").insertOne(order);
//         }).then(() => {
//             this.cart = { items: [] };
//             return db.collection("users").updateOne({ _id: new ObjectId(this._id) }, { $set: { cart: { items: [] } } });
//         }).catch(err => {
//             console.log(err);
//         })

//     }
//     getOrders() {
//         const db = getDB();
//         return db.collection("orders").find({ "user._id": new ObjectId(this._id) }).toArray();
//     }
//     static fetch(ID) {
//         const db = getDB();
//         return db.collection("users").findOne({ _id: new ObjectId(ID) });
//     }
// }