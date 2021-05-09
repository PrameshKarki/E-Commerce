//Import modules
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const orderSchema = new Schema({
    userID: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "User"
    },
    items: [{
        type: Object,
        require: true
    }]
})

module.exports = mongoose.model("Order", orderSchema);










// //Import connection pool
// const db = require("../utils/database");

// module.exports = class Order {
//     static place(userID) {
//         const insert = db.execute("INSERT INTO orders SELECT * FROM carts WHERE userID=?", [userID]);
//         insert.then(() => {
//             return db.execute("DELETE FROM carts WHERE userID=?", [userID]);

//         }).catch(err => {
//             console.log(err);
//         })
//     }
//     static fetch(userID) {
//         return db.execute("SELECT ID,title,price,imageURL,description,count(productID) AS quantity FROM orders INNER JOIN products ON orders.productID=products.ID WHERE userID=? GROUP BY(productID)", [userID])
//     }
// }