const chai = require("chai");
const chaiHttp = require("chai-http");
const server = require("../../src/app");
const {
  user1,
  user2,
  userRouterTestBeforeFunc,
} = require("../dynamic-test-data");

const should = chai.should();
chai.use(chaiHttp);

let testObjects;

describe("User Router Test Functions", () => {
  //* things to do before
  before((done) => {
    testObjects = userRouterTestBeforeFunc(); // update test objects dynamic values before
    done();
  });

  //* testing me
  it("GET : me", (done) => {
    chai
      .request(server)
      .get("/api/v1/users/me/info")
      .set("token", user1.token)
      .end((error, response) => {
        response.should.have.status(200);
        response.body.should.be.a("object");
        response.body.should.be.property("_id").eql(user1._id);
        done();
      });
  });

  //* testing get by id
  it("GET : get by id", (done) => {
    chai
      .request(server)
      .get("/api/v1/users/" + user1._id)
      .set("token", user1.token)
      .end((error, response) => {
        response.should.have.status(200);
        response.body.should.be.a("object");
        response.body.should.be.property("email").eql(user1.email);
        done();
      });
  });

  //* testing get by id error because token is required
  it("GET : get by id error 401 (token is required)", (done) => {
    chai
      .request(server)
      .get("/api/v1/users/" + user1._id)
      .end((error, response) => {
        response.should.have.status(401); // unauthorize
        done();
      });
  });

  //* testing get by username
  it("GET : get by username", (done) => {
    chai
      .request(server)
      .get("/api/v1/users/u/" + user1.username)
      .set("token", user1.token)
      .end((error, response) => {
        response.should.have.status(200);
        response.body.should.be.a("object");
        response.body.should.be.property("_id").eql(user1._id);
        done();
      });
  });

  //* testing update
  it("PUT : update", (done) => {
    chai
      .request(server)
      .put("/api/v1/users/")
      .set("token", user1.token)
      .send(testObjects.updateUserObj)
      .end((error, response) => {
        response.should.have.status(200);
        response.body.should.be.a("object");
        response.body.should.be.property("_id").eql(user1._id);
        response.body.should.be
          .property("name")
          .eql(testObjects.updateUserObj.name);
        done();
      });
  });

  //* testing update error because gender isn't valid (valid gender numbers : 0,1,2,3,4)
  it("PUT : update error 400 (gender isn't valid)", (done) => {
    testObjects.updateUserObj.gender = 5;
    chai
      .request(server)
      .put("/api/v1/users/")
      .set("token", user1.token)
      .send(testObjects.updateUserObj)
      .end((error, response) => {
        response.should.have.status(400);
        done();
      });
  });

  //* testing update with changing email & username
  it("PUT : update - change email & username", (done) => {
    chai
      .request(server)
      .put("/api/v1/users/")
      .set("token", user2.token)
      .send(testObjects.updateUserObj_username_mail)
      .end((error, response) => {
        response.should.have.status(200);
        response.body.should.be.a("object");
        response.body.should.be
          .property("_id")
          .eql(testObjects.updateUserObj_username_mail._id);
        response.body.should.be
          .property("username")
          .eql(testObjects.updateUserObj_username_mail.username.toLowerCase());
        response.body.should.be
          .property("email")
          .eql(testObjects.updateUserObj_username_mail.email.toLowerCase());
        done();
      });
  });

  //* testing change password
  it("PUT : change password", (done) => {
    chai
      .request(server)
      .put("/api/v1/users/" + user2._id + "/password")
      .set("token", user2.token)
      .send(testObjects.changePasswordObj)
      .end((error, response) => {
        response.should.have.status(200);
        response.body.should.be.a("object");
        response.body.should.be
          .property("_id")
          .eql(testObjects.changePasswordObj._id);
        response.body.should.be.property("password");
        done();
      });
  });

  //* testing change password error because old password is wrong
  it("PUT : changepassword error 400 (old password is wromg)", (done) => {
    testObjects.changePasswordObj.oldPassword = "password";
    chai
      .request(server)
      .put("/api/v1/users/" + user2._id + "/password")
      .set("token", user2.token)
      .send(testObjects.changePasswordObj)
      .end((error, response) => {
        response.should.have.status(400);
        done();
      });
  });

  //* testing delete
  it("DEL : delete", (done) => {
    chai
      .request(server)
      .del("/api/v1/users/")
      .set("token", user2.token)
      .send(testObjects.deleteUserObj)
      .end((error, response) => {
        response.should.have.status(200);
        response.body.should.be.a("object");
        response.body.should.be
          .property("_id")
          .eql(testObjects.deleteUserObj._id);
        response.body.should.be.property("activeStatus").eql(false);
        done();
      });
  });

  //* testing delete error because not own account
  it("DEL : delete error 400 (not own account)", (done) => {
    chai
      .request(server)
      .delete("/api/v1/users/")
      .set("token", user1.token)
      .send(testObjects.deleteUserObj)
      .end((error, response) => {
        response.should.have.status(400);
        done();
      });
  });
});
