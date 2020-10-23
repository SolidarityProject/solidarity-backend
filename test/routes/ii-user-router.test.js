const chai = require("chai");
const chaiHttp = require("chai-http");
const server = require("../../src/app");
const { user1, user2, userRouterTestBeforeFunc } = require("../dynamic-test-data");

const should = chai.should();
const expect = chai.expect;
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
        response.should.have.status(204);
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
        response.should.have.status(204);
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
        response.should.have.status(204);
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
        response.should.have.status(204);
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

  //* starred-post

  //* testing add post for starred-post test
  it("POST : add post for starred-post test", (done) => {
    chai
      .request(server)
      .post("/api/v1/posts")
      .set("token", user1.token)
      .send(testObjects.addPostObj_starredPost)
      .end((error, response) => {
        expect(response.status, 201);
        user1.starredPostId[0] = response.header.location.split("/").pop();
        expect(response.header.location, "/api/v1/posts/" + user1.starredPostId[0]);
        done();
      });
  });

  //* testing add post for starred-post test (delete)
  it("POST : add post for starred-post test (for delete operation)", (done) => {
    chai
      .request(server)
      .post("/api/v1/posts")
      .set("token", user1.token)
      .send(testObjects.addPostObj_starredPost)
      .end((error, response) => {
        expect(response.status, 201);
        user1.starredPostId[1] = response.header.location.split("/").pop();
        expect(response.header.location, "/api/v1/posts/" + user1.starredPostId[1]);
        done();
      });
  });

  //* testing add starred post
  it("POST : add starred post", (done) => {
    testObjects.addStarredPostObj.postId = user1.starredPostId[0];
    chai
      .request(server)
      .post("/api/v1/users/" + user1._id + "/starred/")
      .set("token", user1.token)
      .send(testObjects.addStarredPostObj)
      .end((error, response) => {
        expect(response.status).to.equal(201);
        done();
      });
  });

  //* testing add starred post (other post)
  it("POST : add starred post (other post)", (done) => {
    testObjects.addStarredPostObj.postId = user1.starredPostId[1];
    chai
      .request(server)
      .post("/api/v1/users/" + user1._id + "/starred/")
      .set("token", user1.token)
      .send(testObjects.addStarredPostObj)
      .end((error, response) => {
        expect(response.status).to.equal(201);
        done();
      });
  });

  //* testing add starred post error because this post already starred
  it("POST : add starred post error 400 (this post already starred)", (done) => {
    chai
      .request(server)
      .post("/api/v1/users/" + user1._id + "/starred/")
      .set("token", user1.token)
      .send(testObjects.addStarredPostObj)
      .end((error, response) => {
        expect(response.status).to.equal(400);
        done();
      });
  });

  //* testing get my starred posts
  it("GET : get my starred posts", (done) => {
    chai
      .request(server)
      .get("/api/v1/users/me/starred-post/")
      .set("token", user1.token)
      .end((error, response) => {
        expect(response.status).to.equal(200);
        expect(response.body).to.be.an.instanceof(Array);
        expect(response.body[0]).to.equal(user1.starredPostId[0]);
        done();
      });
  });

  //* testing get starred posts by user id
  it("GET : get starred posts by user id", (done) => {
    chai
      .request(server)
      .get("/api/v1/users/" + user1._id + "/starred/")
      .set("token", user1.token)
      .end((error, response) => {
        expect(response.status).to.equal(200);
        expect(response.body).to.be.an.instanceof(Array);
        expect(response.body[0]._id).to.equal(user1.starredPostId[0]);
        done();
      });
  });

  //* testing delete starred post
  it("DEL : delete starred post", (done) => {
    chai
      .request(server)
      .delete("/api/v1/users/" + user1._id + "/starred/" + user1.starredPostId[1])
      .set("token", user1.token)
      .end((error, response) => {
        expect(response.status).to.equal(204);
        done();
      });
  });

  //* testing delete starred post error because this post non starred
  it("DEL : delete starred post error 400 (this post non starred)", (done) => {
    chai
      .request(server)
      .delete("/api/v1/users/" + user1._id + "/starred/" + user1.starredPostId[1])
      .set("token", user1.token)
      .end((error, response) => {
        expect(response.status).to.equal(400);
        done();
      });
  });
});
