const chai = require("chai");
const chaiHttp = require("chai-http");
const server = require("../../src/app");
const testObjects = require("../test-objects.json");

const should = chai.should();

chai.use(chaiHttp);

describe("Auth Router Test Functions", () => {

    //* testing login
    it("Login", done => {
        chai.request(server)
            .post("/auth/login")
            .send(testObjects.loginObj)
            .end((error, response) => {
                response.should.have.status(200);
                response.body.should.be.property("token"); 
                response.header.should.be.property("token"); // check token header
                done();
            })
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
                done();
            })
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
                done();
            })
    });
});