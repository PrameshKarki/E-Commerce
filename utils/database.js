//Import mongodb
const mongodb = require("mongodb");
const MongoClient = mongodb.MongoClient;

//Connection url
const url = "mongodb://localhost:27017";

//Database name
const dbName = "shop";

//Database connection 
let _db;

const MongoConnect = callback => {
    MongoClient.connect(url).then(client => {
        console.log("Connected!");
        _db = client.db(dbName);
        callback();
    }).catch(err => {
        console.log(err);
    })
}
const getDB = () => {
    if (_db)
        return _db;
    throw "No database found!";
}
exports.MongoConnect = MongoConnect;
exports.getDB = getDB;