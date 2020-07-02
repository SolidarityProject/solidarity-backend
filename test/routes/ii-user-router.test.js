const chai = require("chai");
const chaiHttp = require("chai-http");
const server = require("../../src/app");
const testObjects = require("../test-objects.json");
const { createToken } = require("../../src/utils/security/token");

const should = chai.should();
chai.use(chaiHttp);

let token;
let token2;

describe("User Router Test Functions", () => {

    //* before creating token
    before(done => {
        token = createToken(testObjects.createTokenObj);    // token  -> get functions, update
        token2 = createToken(testObjects.createTokenObj2);  // token2 -> update (username & email), changepassword, delete
        done();
    });

    //* testing getbyid
    it("GET : getbyid", done => {
        chai.request(server)
            .get("/users/getbyid/5efb3602c106002090dc7746")
            .set("token", token)
            .end((error, response) => {
                response.should.have.status(200);
                response.body.should.be.a("object");
                response.body.should.be.property("username").eql("testuser");
                done();
            });
    });

    //* testing getbyusername
    it("GET : getbyusername", done => {
        chai.request(server)
            .get("/users/getbyusername/testuser")
            .set("token", token)
            .end((error, response) => {
                response.should.have.status(200);
                response.body.should.be.a("object");
                response.body.should.be.property("_id").eql("5efb3602c106002090dc7746");
                done();
            });
    });

    //* testing update
    it("PUT : update", done => {
        chai.request(server)
            .put("/users/update")
            .set("token", token)
            .send(testObjects.updateUserObj)
            .end((error, response) => {
                response.should.have.status(200);
                response.body.should.be.a("object");
                response.body.should.be.property("_id").eql(testObjects.updateUserObj._id);
                response.body.should.be.property("name").eql(testObjects.updateUserObj.name);
                done();
            });
    });

    //* testing update with changing email & username
    it("PUT : update (change email & username)", done => {
        chai.request(server)
            .put("/users/update")
            .set("token", token2)
            .send(testObjects.updateUserObj_username_mail)
            .end((error, response) => {
                response.should.have.status(200);
                response.body.should.be.a("object");
                response.body.should.be.property("_id").eql(testObjects.updateUserObj_username_mail._id);
                response.body.should.be.property("username").eql(testObjects.updateUserObj_username_mail.username);
                response.body.should.be.property("email").eql(testObjects.updateUserObj_username_mail.email);
                done();
            });
    });

    //* testing changepassword
    it("PUT : changepassword", done => {
        chai.request(server)
            .put("/users/changepassword")
            .set("token", token2)
            .send(testObjects.changePasswordObj)
            .end((error, response) => {
                response.should.have.status(200);
                response.body.should.be.a("object");
                response.body.should.be.property("_id").eql(testObjects.changePasswordObj._id);
                response.body.should.be.property("password");
                done();
            });
    });

    //* testing delete
    it("DEL : delete", done => {
        chai.request(server)
            .del("/users/delete")
            .set("token", token2)
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
            .set("token", token)
            .send(testObjects.deleteUserObj)
            .end((error, response) => {
                response.should.have.status(400);
                done();
            });
    });
});