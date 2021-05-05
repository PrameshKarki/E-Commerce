const mysql = require("mysql2");

const db = mysql.createPool({
    host: "localhost",
    user: "pramesh",
    password: "password",
    database: "shop"
});

module.exports = db.promise();

