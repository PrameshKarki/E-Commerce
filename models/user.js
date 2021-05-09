//Import modules
const mongoose = require("mongoose");
const Order = require("./order");

const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    cart: {
        items: [{ productID: { type: Schema.Types.ObjectId, ref: "Product", required: true }, quantity: { type: Number, required: true } }]
    }
})

userSchema.methods.addToCart = function (productID) {
    let updatedCart;
    if (this.cart) {
        //Check the current product is already exist in database or not
        const cartItems = [...this.cart.items];
        const productIndex = cartItems.findIndex(pro => pro.productID.toString() === productID);
        if (productIndex >= 0) {
            cartItems[productIndex].quantity += 1;
        } else {
            cartItems.push({ productID: productID, quantity: 1 });
        }
        updatedCart = {
            items: cartItems
        }

    } else {
        updatedCart = { items: [{ productID: productID, quantity: 1 }] };

    }
    this.cart = updatedCart;
    return this.save();


}
userSchema.methods.removeCartProduct = function (productID) {
    const updatedCartItems = this.cart.items.filter(item => {
        return item.productID.toString() !== productID;
    })
    this.cart.items = updatedCartItems;
    return this.save();
}

userSchema.methods.orderPlace = function (callback) {
    const items = [];
    let product = {};
    this.populate("cart.items.productID").execPopulate().then(user => {
        user.cart.items.forEach(element => {
            product = {
                details: { ...element.productID._doc },
                quantity: element.quantity
            }
            items.push(product);
        })
        const order = new Order({ userID: this._id, items: items });
        order.save();
        this.cart.items = [];
        this.save();
        callback();
    })
}


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
//         const updatedCartItems = this.cart.items.filter(item => {
//             return item.productID.toString() !== productID;
//         })
//         return db.collection("users").updateOne({ _id: new ObjectId(this._id) }, { $set: { cart: { items: updatedCartItems } } });

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