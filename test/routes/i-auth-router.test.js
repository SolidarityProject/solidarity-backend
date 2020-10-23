const chai = require("chai");
const chaiHttp = require("chai-http");
const server = require("../../src/app");
const { user1, user2, authRouterTestBeforeFunc } = require("../dynamic-test-data");

const should = chai.should();
chai.use(chaiHttp);

let testObjects;

describe("Auth Router Test Functions", () => {
  //* things to do before
  before((done) => {
    testObjects = authRouterTestBeforeFunc(); // update test objects dynamic values before
    done();
  });

  //* testing register
  it("POST : register", (done) => {
    chai
      .request(server)
      .post("/api/v1/auth/register")
      .send(testObjects.registerObj)
      .end((error, response) => {
        response.should.have.status(201);
        user1._id = response.header.location.split("/").pop();
        response.header.location.should.eql("/api/v1/users/" + user1._id);

        // update user1 (temp test object) values
        user1.lastName = testObjects.registerObj.lastname;
        user1.email = testObjects.registerObj.email;
        user1.username = testObjects.registerObj.username;
        done();
      });
  });

  //* testing register error because birthdate isn't valid (valid age : 18 - 100)
  it("POST : register error 400 (birthdate isn't valid)", (done) => {
    testObjects.registerObj.birthdate = "2020-01-01";
    chai
      .request(server)
      .post("/api/v1/auth/register")
      .send(testObjects.registerObj)
      .end((error, response) => {
        response.should.have.status(400);
        done();
      });
  });

  //* testing register other account -> required update & delete
  it("POST : register - other account", (done) => {
    chai
      .request(server)
      .post("/api/v1/auth/register")
      .send(testObjects.registerObj2)
      .end((error, response) => {
        response.should.have.status(201);
        response.header.should.be.property("location");

        // update user2 (temp test object) values
        user2._id = response.header.location.split("/").pop();
        user2.lastName = testObjects.registerObj2.lastname;
        user2.email = testObjects.registerObj2.email;
        user2.username = testObjects.registerObj2.username;
        done();
      });
  });

  //* testing login
  it("POST : login", (done) => {
    chai
      .request(server)
      .post("/api/v1/auth/login")
      .send({ email: user1.email, password: testObjects.loginObj.password })
      .end((error, response) => {
        response.should.have.status(200);
        response.body.should.be.property("token");
        response.header.should.be.property("token"); // check token header
        done();
      });
  });

  //* testing login error because password is wrong
  it("POST : login error 400 (password is wrong)", (done) => {
    chai
      .request(server)
      .post("/api/v1/auth/login")
      .send({ email: user1.email, password: "password" })
      .end((error, response) => {
        response.should.have.status(400);
        done();
      });
  });

  let changePasswordToken;

  //* testing password-request
  it("POST : password request", (done) => {
    chai
      .request(server)
      .post("/api/v1/auth/password-request")
      .send({ email: user1.email })
      .end((error, response) => {
        response.should.have.status(200);
        response.body.should.be.property("token");
        response.header.should.be.property("token");
        changePasswordToken = response.body.token;
        done();
      });
  });

  //* testing change password error because password request code is wrong
  it("POST : change password error 400 (password request code is wrong)", (done) => {
    testObjects.authChangePasswordObj._id = user1._id;
    chai
      .request(server)
      .post("/api/v1/auth/" + testObjects.authChangePasswordObj._id + "/password")
      .set("token", changePasswordToken)
      .send(testObjects.authChangePasswordObj)
      .end((error, response) => {
        response.should.have.status(400);
        done();
      });
  });

  //* testing available-email
  it("POST : available email", (done) => {
    testObjects.checkAvailableEmailObj.email = user1.email + ".tr";
    chai
      .request(server)
      .post("/api/v1/auth/available-email")
      .send(testObjects.checkAvailableEmailObj)
      .end((error, response) => {
        response.should.have.status(200);
        done();
      });
  });

  //* testing available-username error because username exists
  it("POST : available username error 400 (username exists)", (done) => {
    testObjects.checkAvailableUsernameObj.username = user1.username;
    chai
      .request(server)
      .post("/api/v1/auth/available-username")
      .send(testObjects.checkAvailableUsernameObj)
      .end((error, response) => {
        response.should.have.status(400);
        done();
      });
  });

  //* testing available-username
  it("POST : available username", (done) => {
    testObjects.checkAvailableUsernameObj.username = user1.username + "456";
    chai
      .request(server)
      .post("/api/v1/auth/available-username")
      .send(testObjects.checkAvailableUsernameObj)
      .end((error, response) => {
        response.should.have.status(200);
        done();
      });
  });
});
