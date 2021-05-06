//Import database
const db = require("../utils/database");

module.exports = class User {
    constructor(givenName, givenEmail) {
        this.name = givenName;
        this.email = givenEmail;
    }
    static save() {
        return db.execute("INSERT INTO user(name,email) VALUES(?,?)", [this.name, this.email]);
    }
    static fetch(ID) {
        return db.execute("SELECT * FROM users WHERE ID=?", [ID]);
    }
}