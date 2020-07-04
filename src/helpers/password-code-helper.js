const { user1 } = require("../../test/dynamic-test-data");

//* create random password code
function generatePasswordCode() {
    const passwordCode = Math.floor(100000 + Math.random() * 900000); // random 6 digit number
    console.log(passwordCode + " - " + new Date());

    user1.passwordCode = passwordCode.toString();

    return passwordCode;
}

// TODO : password code to send user function (email, sms etc.)

module.exports = { generatePasswordCode };