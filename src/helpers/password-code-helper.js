
//* create random password code
function generatePasswordCode() {
    const passwordCode = Math.floor(100000 + Math.random() * 900000); // random 6 digit number
    return passwordCode;
}

// TODO : password code to send user function (email, sms etc.)

module.exports = { generatePasswordCode };