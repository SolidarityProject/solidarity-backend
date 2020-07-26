const faker = require("faker");
const faker_tr = require("faker/locale/tr");
const { createToken } = require("../src/utils/security/token");
const { getDateForCheck_month } = require("../src/helpers/date-helper");
const testObjects = require("./test-objects.json");

let user1 = {
    _id: "",
    lastName: "",
    username: "",
    email: "",
    token: "",
    postId: "",
}; // user1 -> temp test object

let user2 = {
    _id: "",
    lastName: "",
    username: "",
    email: "",
    token: ""
}; // user2 -> temp test object


//* assignment test objects dynamic values


function authRouterTestBeforeFunc() {

    const nameForUsername = "user" + faker.random.alphaNumeric(2);
    const nameForUsername2 = "user" + faker.random.alphaNumeric(2);

    testObjects.registerObj.lastname = faker_tr.name.lastName();
    testObjects.registerObj.username = faker.internet.userName(nameForUsername, faker.random.alphaNumeric(4));
    testObjects.registerObj.email = faker.internet.email(nameForUsername, faker.random.alphaNumeric(4));

    testObjects.registerObj2.lastname = faker_tr.name.lastName();
    testObjects.registerObj2.username = faker.internet.userName(nameForUsername2, faker.random.alphaNumeric(4));
    testObjects.registerObj2.email = faker.internet.email(nameForUsername2, faker.random.alphaNumeric(4));

    return testObjects;
}

function userRouterTestBeforeFunc() {

    testObjects.createTokenObj._id = user1._id;
    testObjects.createTokenObj2._id = user2._id;

    // create tokens for user1 & user2
    user1.token = createToken(testObjects.createTokenObj);
    user2.token = createToken(testObjects.createTokenObj2);

    testObjects.updateUserObj._id = user1._id;
    testObjects.updateUserObj.lastname = user1.lastName;

    testObjects.updateUserObj_username_mail._id = user2._id;
    testObjects.updateUserObj_username_mail.lastname = user2.lastName;
    testObjects.updateUserObj_username_mail.username = faker.internet.userName();
    testObjects.updateUserObj_username_mail.email = faker.internet.email();

    testObjects.changePasswordObj._id = user2._id;

    testObjects.deleteUserObj._id = user2._id;

    testObjects.deleteUserObj_error._id = user2._id;

    return testObjects;
}

function postRouterTestBeforeFunc() {

    testObjects.addPostObj.userId = user1._id;
    testObjects.addPostObj.description += faker_tr.random.words(5);
    testObjects.addPostObj.dateSolidarity = getDateForCheck_month(1);

    testObjects.addPostObj2.userId = user2._id;
    testObjects.addPostObj2.description += faker_tr.random.words(5);
    testObjects.addPostObj2.dateSolidarity = getDateForCheck_month(1);

    testObjects.updatePostObj.userId = user1._id;
    testObjects.updatePostObj.description += faker_tr.random.words(5);
    testObjects.updatePostObj.dateSolidarity = getDateForCheck_month(1);

    testObjects.deletePostObj.userId = user1._id;

    return testObjects;
}

module.exports = {
    user1, user2,
    authRouterTestBeforeFunc,
    userRouterTestBeforeFunc,
    postRouterTestBeforeFunc
}