const chai = require("chai");
const chaiHttp = require("chai-http");
const server = require("../../src/app");
const {
  user1,
  user2,
  authRouterTestBeforeFunc,
} = require("../dynamic-test-data");

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
  it("register", (done) => {
    chai
      .request(server)
      .post("/api/v1/auth/register")
      .send(testObjects.registerObj)
      .end((error, response) => {
        response.should.have.status(200);
        response.should.be.a("object");
        response.body.should.be.property("_id");
        response.body.should.be
          .property("email")
          .eql(testObjects.registerObj.email);

        // update user1 (temp test object) values
        user1._id = response.body._id;
        user1.lastName = testObjects.registerObj.lastname;
        user1.email = testObjects.registerObj.email;
        user1.username = testObjects.registerObj.username;

        done();
      });
  });

  //* testing register error because birthdate isn't valid (valid age : 18 - 100)
  it("register (error)", (done) => {
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
  it("register (other account)", (done) => {
    chai
      .request(server)
      .post("/api/v1/auth/register")
      .send(testObjects.registerObj2)
      .end((error, response) => {
        response.should.have.status(200);
        response.should.be.a("object");
        response.body.should.be.property("_id");
        response.body.should.be
          .property("email")
          .eql(testObjects.registerObj2.email);

        // update user2 (temp test object) values
        user2._id = response.body._id;
        user2.lastName = testObjects.registerObj2.lastname;
        user2.email = testObjects.registerObj2.email;
        user2.username = testObjects.registerObj2.username;

        done();
      });
  });

  //* testing login
  it("login", (done) => {
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
  it("login (error)", (done) => {
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

  //* testing passwordrequest
  it("POST : passwordrequest", (done) => {
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

  //* testing changepassword error because passwordRequestCode is wrong
  it("POST : changepassword (error)", (done) => {
    testObjects.authChangePasswordObj._id = user1._id;
    chai
      .request(server)
      .post(
        "/api/v1/auth/" + testObjects.authChangePasswordObj._id + "/password"
      )
      .set("token", changePasswordToken)
      .send(testObjects.authChangePasswordObj)
      .end((error, response) => {
        response.should.have.status(400);
        done();
      });
  });

  //* testing checkavailableemail
  it("POST : checkavailableemail", (done) => {
    testObjects.checkAvailableEmailObj.email += ".tr";
    chai
      .request(server)
      .post("/api/v1/auth/available-email")
      .send(testObjects.checkAvailableEmailObj)
      .end((error, response) => {
        response.should.have.status(200);
        done();
      });
  });

  //* testing checkavailableusername error because username exists
  it("POST : checkavailableusername (error)", (done) => {
    chai
      .request(server)
      .post("/api/v1/auth/available-username")
      .send(testObjects.checkAvailableUsernameObj)
      .end((error, response) => {
        response.should.have.status(400);
        done();
      });
  });

  //* testing checkavailableusername
  it("POST : checkavailableusername", (done) => {
    testObjects.checkAvailableUsernameObj.username += "456";
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
