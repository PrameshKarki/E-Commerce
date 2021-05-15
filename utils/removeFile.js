//Import modules
const fs = require("fs");

let removeFile = (path) => {
    fs.unlink(path, (err) => {
        console.log(err);
    })

}
module.exports = removeFile;