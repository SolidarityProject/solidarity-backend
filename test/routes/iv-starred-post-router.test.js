const chai = require("chai");
const chaiHttp = require("chai-http");
const server = require("../../src/app");
const { user1, starredRouterTestBeforeFunc } = require("../dynamic-test-data");

const expect = chai.expect;
chai.use(chaiHttp);

let testObjects;

describe("Starred Router Test Functions", () => {
  //* things to do before
  before((done) => {
    testObjects = starredRouterTestBeforeFunc(); // update test objects dynamic values before
    done();
  });

  //* testing add
  it("POST : add", (done) => {
    chai
      .request(server)
      .post("/api/v1/starred-posts")
      .set("token", user1.token)
      .send(testObjects.addStarredPostObj)
      .end((error, response) => {
        expect(response.status).to.equal(200);
        expect(response.body).to.be.an.instanceof(Array);
        expect(response.body[0]).to.equal(user1.postId[0]);
        done();
      });
  });

  //* testing add error because this post already starred
  it("POST : add error 400 (this post already starred)", (done) => {
    chai
      .request(server)
      .post("/api/v1/starred-posts")
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
      .get("/api/v1/starred-posts/my-starred-posts")
      .set("token", user1.token)
      .end((error, response) => {
        expect(response.status).to.equal(200);
        expect(response.body).to.be.an.instanceof(Array);
        expect(response.body[0]).to.equal(user1.postId[0]);
        done();
      });
  });

  //* testing get posts by user id
  it("GET : get posts by user id", (done) => {
    chai
      .request(server)
      .get("/api/v1/starred-posts/p/" + user1._id)
      .set("token", user1.token)
      .end((error, response) => {
        expect(response.status).to.equal(200);
        expect(response.body).to.be.an.instanceof(Array);
        expect(response.body[0]._id).to.equal(user1.postId[0]);
        done();
      });
  });

  //* testing get users info by post id
  it("GET : get users info by post id", (done) => {
    chai
      .request(server)
      .get("/api/v1/starred-posts/u/" + user1.postId[0])
      .set("token", user1.token)
      .end((error, response) => {
        expect(response.status).to.equal(200);
        expect(response.body).to.be.an.instanceof(Array);
        expect(response.body[0]._id).to.equal(user1._id);
        done();
      });
  });

  //* testing delete
  it("DEL : delete", (done) => {
    chai
      .request(server)
      .delete("/api/v1/starred-posts/" + user1.postId[0])
      .set("token", user1.token)
      .end((error, response) => {
        expect(response.status).to.equal(200);
        expect(response.body).to.be.an.instanceof(Array);
        done();
      });
  });

  //* testing delete error because this post non starred
  it("DEL : delete error 400 (this post non starred)", (done) => {
    chai
      .request(server)
      .delete("/api/v1/starred-posts/" + user1.postId[0])
      .set("token", user1.token)
      .end((error, response) => {
        expect(response.status).to.equal(400);
        done();
      });
  });
});
