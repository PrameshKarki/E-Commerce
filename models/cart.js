//Import connection for database
const db = require("../utils/database");

module.exports = class Cart {
    static save(userID, productID) {
        return db.execute("INSERT INTO carts VALUES(?,?)", [userID, productID]);
        //Cart No === user ID NO
    }
    static removeProduct(userID, productID) {
        return db.execute("DELETE FROM carts WHERE userID=? AND productID=?", [userID, productID]);
    }
    static fetch(userID) {
        return db.execute("SELECT ID,title,price,imageURL,description,count(productID) AS quantity FROM carts INNER JOIN products ON carts.productID=products.ID WHERE userID=? GROUP BY(productID)", [userID])
    }
}