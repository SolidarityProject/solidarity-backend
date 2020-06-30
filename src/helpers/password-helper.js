const bcrypt = require("bcryptjs");

//* password hashing
async function passwordHashing(password) { // TODO : research ??
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
}

//* password comparing
async function passwordComparing(unencrypted, encrypted) {
    return await bcrypt.compare(unencrypted, encrypted);
}

module.exports = { passwordHashing, passwordComparing };