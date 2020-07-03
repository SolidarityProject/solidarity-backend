const chai = require("chai");
const chaiHttp = require("chai-http");
const server = require("../../src/app");
const testObjects = require("../test-objects.json");
const faker = require("faker");

const should = chai.should();
chai.use(chaiHttp);

let user1 = {
    _id: "",
    lastName: "",
    email: "",
    username: "",
    token: "",
    postId: ""
}

let user2 = {
    _id: "",
    lastName: "",
    email: "",
    username: "",
    token: ""
}

describe("Auth Router Test Functions", () => {

    before(done => {

        testObjects.registerObj.lastname = faker.name.lastName();
        testObjects.registerObj.username = faker.internet.userName("user", faker.random.alphaNumeric(4));
        testObjects.registerObj.email = faker.internet.email("user", faker.random.alphaNumeric(4));

        testObjects.registerObj2.lastname = faker.name.lastName();
        testObjects.registerObj2.username = faker.internet.userName("user", faker.random.alphaNumeric(4));
        testObjects.registerObj2.email = faker.internet.email("user", faker.random.alphaNumeric(4));

        done();
    });

    //* testing register
    it("Register", done => {
        chai.request(server)
            .post("/auth/register")
            .send(testObjects.registerObj)
            .end((error, response) => {
                response.should.have.status(200);
                response.should.be.a("object");
                response.body.should.be.property("_id");
                response.body.should.be.property("email").eql(testObjects.registerObj.email);

                user1._id = response.body._id;
                user1.lastName = testObjects.registerObj.lastname;
                user1.email = testObjects.registerObj.email;
                user1.username = testObjects.registerObj.username;

                done();
            });
    });

    //* testing register other account -> required update & delete
    it("Register (other account for update & delete)", done => {
        chai.request(server)
            .post("/auth/register")
            .send(testObjects.registerObj2)
            .end((error, response) => {
                response.should.have.status(200);
                response.should.be.a("object");
                response.body.should.be.property("_id");
                response.body.should.be.property("email").eql(testObjects.registerObj2.email);

                user2._id = response.body._id;
                user2.lastName = testObjects.registerObj2.lastname;
                user2.email = testObjects.registerObj2.email;
                user2.username = testObjects.registerObj2.username;

                done();
            });
    });

    //* testing login
    it("Login", done => {
        chai.request(server)
            .post("/auth/login")
            .send({ email: user1.email, password: testObjects.loginObj.password })
            .end((error, response) => {
                response.should.have.status(200);
                response.body.should.be.property("token");
                response.header.should.be.property("token"); // check token header
                done();
            });
    });
});

module.exports = { user1, user2 };