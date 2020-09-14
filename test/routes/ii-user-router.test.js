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
      .get("/api/v1/users/me/")
      .set("token", user1.token)
      .end((error, response) => {
        response.should.have.status(200);
        response.body.should.be.a("object");
        response.body.should.be.property("_id").eql(user1._id);
        done();
      });
  });

  //* testing getbyid
  it("GET : getbyid", (done) => {
    chai
      .request(server)
      .get("/api/v1/users/getbyid/" + user1._id)
      .set("token", user1.token)
      .end((error, response) => {
        response.should.have.status(200);
        response.body.should.be.a("object");
        response.body.should.be.property("email").eql(user1.email);
        done();
      });
  });

  //* testing getbyid error because token is required
  it("GET : getbyid (error)", (done) => {
    chai
      .request(server)
      .get("/api/v1/users/getbyid/" + user1._id)
      .end((error, response) => {
        response.should.have.status(401); // unauthorize
        done();
      });
  });

  //* testing getbyusername
  it("GET : getbyusername", (done) => {
    chai
      .request(server)
      .get("/api/v1/users/getbyusername/" + user1.username)
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
      .put("/api/v1/users/update")
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
  it("PUT : update (error)", (done) => {
    testObjects.updateUserObj.gender = 5;
    chai
      .request(server)
      .put("/api/v1/users/update")
      .set("token", user1.token)
      .send(testObjects.updateUserObj)
      .end((error, response) => {
        response.should.have.status(400);
        done();
      });
  });

  //* testing update with changing email & username
  it("PUT : update (change email & username)", (done) => {
    chai
      .request(server)
      .put("/api/v1/users/update")
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

  //* testing changepassword
  it("PUT : changepassword", (done) => {
    chai
      .request(server)
      .put("/api/v1/users/changepassword")
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

  //* testing changepassword error because oldPassword is wrong
  it("PUT : changepassword (error)", (done) => {
    testObjects.changePasswordObj.oldPassword = "password";
    chai
      .request(server)
      .put("/api/v1/users/changepassword")
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
      .del("/api/v1/users/delete")
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
  it("DEL : delete (error)", (done) => {
    chai
      .request(server)
      .delete("/api/v1/users/delete")
      .set("token", user1.token)
      .send(testObjects.deleteUserObj)
      .end((error, response) => {
        response.should.have.status(400);
        done();
      });
  });
});
