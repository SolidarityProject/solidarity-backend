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
      .post("/api/v1/starred-posts/add")
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
  it("POST : add (error)", (done) => {
    chai
      .request(server)
      .post("/api/v1/starred-posts/add")
      .set("token", user1.token)
      .send(testObjects.addStarredPostObj)
      .end((error, response) => {
        expect(response.status).to.equal(400);
        done();
      });
  });

  //* testing getmystarredposts
  it("GET : getmystarredposts", (done) => {
    chai
      .request(server)
      .get("/api/v1/starred-posts/getmystarredposts")
      .set("token", user1.token)
      .end((error, response) => {
        expect(response.status).to.equal(200);
        expect(response.body).to.be.an.instanceof(Array);
        expect(response.body[0]).to.equal(user1.postId[0]);
        done();
      });
  });

  //* testing getusersbypostid
  it("GET : getusersbypostid", (done) => {
    chai
      .request(server)
      .get("/api/v1/starred-posts/getusersbypostid/" + user1.postId[0])
      .set("token", user1.token)
      .end((error, response) => {
        expect(response.status).to.equal(200);
        expect(response.body).to.be.an.instanceof(Array);
        expect(response.body[0]).to.equal(user1._id);
        done();
      });
  });

  //* testing getpostsbyuserid
  it("GET : getpostsbyuserid", (done) => {
    chai
      .request(server)
      .get("/api/v1/starred-posts/getpostsbyuserid/" + user1._id)
      .set("token", user1.token)
      .end((error, response) => {
        expect(response.status).to.equal(200);
        expect(response.body).to.be.an.instanceof(Array);
        expect(response.body[0]._id).to.equal(user1.postId[0]);
        done();
      });
  });

  //* testing getusersinfobypostid
  it("GET : getusersinfobypostid", (done) => {
    chai
      .request(server)
      .get("/api/v1/starred-posts/getusersinfobypostid/" + user1.postId[0])
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
      .delete("/api/v1/starred-posts/delete/" + user1.postId[0])
      .set("token", user1.token)
      .end((error, response) => {
        expect(response.status).to.equal(200);
        expect(response.body).to.be.an.instanceof(Array);
        done();
      });
  });

  //* testing delete error because this post non starred
  it("DEL : delete (error)", (done) => {
    chai
      .request(server)
      .delete("/api/v1/starred-posts/delete/" + user1.postId[0])
      .set("token", user1.token)
      .end((error, response) => {
        expect(response.status).to.equal(400);
        done();
      });
  });
});
