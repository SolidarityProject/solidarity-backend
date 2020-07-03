const chai = require("chai");
const chaiHttp = require("chai-http");
const server = require("../../src/app");
const testObjects = require("../test-objects.json");
const { createToken } = require("../../src/utils/security/token");

const { user1, user2 } = require("./i-auth-router.test");
const faker = require("faker");

const should = chai.should();
chai.use(chaiHttp);

describe("User Router Test Functions", () => {

    //* before creating token
    before(done => {

        testObjects.createTokenObj._id = user1._id;
        testObjects.createTokenObj2._id = user2._id;

        testObjects.updateUserObj._id = user1._id;
        testObjects.updateUserObj.lastname = user1.lastName;

        testObjects.updateUserObj_username_mail._id = user2._id;
        testObjects.updateUserObj_username_mail.lastname = user2.lastName;
        testObjects.updateUserObj_username_mail.email = faker.internet.email();
        testObjects.updateUserObj_username_mail.username = faker.internet.userName();

        testObjects.changePasswordObj._id = user2._id;

        testObjects.deleteUserObj._id = user2._id;

        testObjects.deleteUserObj_error._id = user2._id;

        user1.token = createToken(testObjects.createTokenObj);    // token  -> get functions, update
        user2.token = createToken(testObjects.createTokenObj2);  // token2 -> update (username & email), changepassword, delete

        done();
    });

    //* testing getbyid
    it("GET : getbyid", done => {
        chai.request(server)
            .get("/users/getbyid/" + user1._id)
            .set("token", user1.token)
            .end((error, response) => {
                response.should.have.status(200);
                response.body.should.be.a("object");
                response.body.should.be.property("email").eql(user1.email);
                done();
            });
    });

    //* testing getbyusername
    it("GET : getbyusername", done => {
        chai.request(server)
            .get("/users/getbyusername/" + user1.username)
            .set("token", user1.token)
            .end((error, response) => {
                response.should.have.status(200);
                response.body.should.be.a("object");
                response.body.should.be.property("_id").eql(user1._id);
                done();
            });
    });

    //* testing update
    it("PUT : update", done => {
        chai.request(server)
            .put("/users/update")
            .set("token", user1.token)
            .send(testObjects.updateUserObj)
            .end((error, response) => {
                response.should.have.status(200);
                response.body.should.be.a("object");
                response.body.should.be.property("_id").eql(user1._id);
                response.body.should.be.property("name").eql(testObjects.updateUserObj.name);
                done();
            });
    });

    //* testing update with changing email & username
    it("PUT : update (change email & username)", done => {
        chai.request(server)
            .put("/users/update")
            .set("token", user2.token)
            .send(testObjects.updateUserObj_username_mail)
            .end((error, response) => {
                response.should.have.status(200);
                response.body.should.be.a("object");
                response.body.should.be.property("_id").eql(testObjects.updateUserObj_username_mail._id);
                response.body.should.be.property("username").eql(testObjects.updateUserObj_username_mail.username.toLowerCase());
                response.body.should.be.property("email").eql(testObjects.updateUserObj_username_mail.email.toLowerCase());
                done();
            });
    });

    //* testing changepassword
    it("PUT : changepassword", done => {
        chai.request(server)
            .put("/users/changepassword")
            .set("token", user2.token)
            .send(testObjects.changePasswordObj)
            .end((error, response) => {
                response.should.have.status(200);
                response.body.should.be.a("object");
                response.body.should.be.property("_id").eql(testObjects.changePasswordObj._id);
                response.body.should.be.property("password");
                done();
            });
    });

    // login***

    //* testing delete
    it("DEL : delete", done => {
        chai.request(server)
            .del("/users/delete")
            .set("token", user2.token)
            .send(testObjects.deleteUserObj)
            .end((error, response) => {
                response.should.have.status(200);
                response.body.should.be.a("object");
                response.body.should.be.property("_id").eql(testObjects.deleteUserObj._id);
                response.body.should.be.property("activeStatus").eql(false);
                done();
            });
    });

    //* testing delete error because not own account
    it("DEL : delete (error)", done => {
        chai.request(server)
            .delete("/users/delete")
            .set("token", user1.token)
            .send(testObjects.deleteUserObj)
            .end((error, response) => {
                response.should.have.status(400);
                done();
            });
    });
});