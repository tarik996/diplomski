const fs = require("fs");

var encodeFunction = (file) => {
    const encoding = fs.readFileSync(file, {encoding: process.env.ENCODING});
        
    return encoding;
}

module.exports = { encodeFunction };