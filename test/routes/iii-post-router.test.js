const chai = require("chai");
const chaiHttp = require("chai-http");
const server = require("../../src/app");
const {
  user1,
  user2,
  postRouterTestBeforeFunc,
} = require("../dynamic-test-data");

const expect = chai.expect;
chai.use(chaiHttp);

let testObjects;

describe("Post Router Test Functions", () => {
  //* things to do before
  before((done) => {
    testObjects = postRouterTestBeforeFunc(); // update test objects dynamic values before
    done();
  });

  //* testing add (5 posts)
  for (let postCount = 0; postCount < 5; postCount++) {
    //* testing add
    it("POST : add (count of new post : " + (postCount + 1) + ")", (done) => {
      // POST : add (count of new post : 1,2,3,4,5)
      chai
        .request(server)
        .post("/api/v1/posts/add")
        .set("token", user1.token)
        .send(testObjects.addPostObj)
        .end((error, response) => {
          expect(response.status).to.equal(200);
          expect(response.body).to.be.an.instanceof(Object);
          expect(response.body).to.have.property("_id");
          user1.postId[postCount] = response.body._id;
          done();
        });
    });
  }

  //* testing add (other district - 5 posts)
  for (let postCount = 0; postCount < 5; postCount++) {
    //* testing add
    it(
      "POST : add (count of new post : " +
        (postCount + 1) +
        " - other district)",
      (done) => {
        // POST : add (count of new post : 1,2,3,4,5 other district)
        chai
          .request(server)
          .post("/api/v1/posts/add")
          .set("token", user1.token)
          .send(testObjects.addPostObj_otherDistrict)
          .end((error, response) => {
            expect(response.status).to.equal(200);
            expect(response.body).to.be.an.instanceof(Object);
            expect(response.body).to.have.property("_id");
            done();
          });
      }
    );
  }

  //* testing add error because not verified account
  it("POST : add (error 1)", (done) => {
    chai
      .request(server)
      .post("/api/v1/posts/add")
      .set("token", user2.token)
      .send(testObjects.addPostObj)
      .end((error, response) => {
        expect(response.status).to.equal(400);
        done();
      });
  });

  //* testing add error because dateSolidarity isn't valid (valid time 2 hours later - 2 months later)
  it("POST : add (error 2)", (done) => {
    testObjects.addPostObj.dateSolidarity = Date.now();
    chai
      .request(server)
      .post("/api/v1/posts/add")
      .set("token", user1.token)
      .send(testObjects.addPostObj)
      .end((error, response) => {
        expect(response.status).to.equal(400);
        done();
      });
  });

  //* testing getbyprovinceaddress - not required token
  it("GET : getbyprovinceaddress (for free user - not required token)", (done) => {
    chai
      .request(server)
      .get("/api/v1/posts/free/getbyprovinceaddress/5eef530e7e22131964053531")
      .end((error, response) => {
        expect(response.status).to.equal(200);
        expect(response.body).to.be.an.instanceof(Array);
        expect(response.body).to.have.lengthOf(3);
        expect(response.body[0].address).to.have.property("province", "İzmir");
        done();
      });
  });

  //* testing getbyid
  it("GET : getbyid", (done) => {
    chai
      .request(server)
      .get("/api/v1/posts/getbyid/" + user1.postId[0])
      .set("token", user1.token)
      .end((error, response) => {
        expect(response.status).to.equal(200);
        expect(response.body).to.be.an.instanceof(Object);
        expect(response.body).to.have.property("_id", user1.postId[0]);
        expect(response.body).to.have.property(
          "description",
          testObjects.addPostObj.description
        );
        done();
      });
  });

  //* testing getbyid error because token is invalid
  it("GET : getbyid (error)", (done) => {
    chai
      .request(server)
      .get("/api/v1/posts/getbyid/" + user1.postId[0])
      .set("token", "token")
      .end((error, response) => {
        expect(response.status).to.equal(400);
        done();
      });
  });

  //* testing getdetailbyid
  it("GET : getdetailbyid", (done) => {
    chai
      .request(server)
      .get("/api/v1/posts/getdetailbyid/" + user1.postId[0])
      .set("token", user1.token)
      .end((error, response) => {
        expect(response.status).to.equal(200);
        expect(response.body).to.be.an.instanceof(Object);
        expect(response.body.post).to.have.property("_id", user1.postId[0]);
        expect(response.body.post).to.have.property("userId", user1._id);
        expect(response.body).to.have.property(
          "createdFullName",
          "Test " + user1.lastName
        );
        done();
      });
  });

  //* testing getbyuserid
  it("GET : getbyuserid", (done) => {
    chai
      .request(server)
      .get("/api/v1/posts/getbyuserid/" + user1._id)
      .set("token", user1.token)
      .end((error, response) => {
        expect(response.status).to.equal(200);
        expect(response.body).to.be.an.instanceof(Array);
        expect(response.body).to.have.lengthOf(10);
        expect(response.body[0]).to.have.property("userId", user1._id);
        done();
      });
  });

  //* testing getbyfulladdress
  it("GET : getbyfulladdress", (done) => {
    chai
      .request(server)
      .get("/api/v1/posts/getbyfulladdress/5eef567d7e2213196405353f")
      .set("token", user1.token)
      .end((error, response) => {
        expect(response.status).to.equal(200);
        expect(response.body).to.be.an.instanceof(Array);
        expect(response.body[0].address).to.have.property(
          "districtId",
          "5eef567d7e2213196405353f"
        );
        expect(response.body[0].address).to.have.property("district", "Ödemiş");
        done();
      });
  });

  //* testing getbyprovinceaddress
  it("GET : getbyprovinceaddress", (done) => {
    chai
      .request(server)
      .get("/api/v1/posts/getbyprovinceaddress/5eef530e7e22131964053531")
      .set("token", user1.token)
      .end((error, response) => {
        expect(response.status).to.equal(200);
        expect(response.body).to.be.an.instanceof(Array);
        expect(response.body[0].address).to.have.property(
          "provinceId",
          "5eef530e7e22131964053531"
        );
        expect(response.body[0].address).to.have.property("province", "İzmir");
        done();
      });
  });

  //* testing update
  it("PUT : update", (done) => {
    testObjects.updatePostObj._id = user1.postId[0];
    chai
      .request(server)
      .put("/api/v1/posts/update")
      .set("token", user1.token)
      .send(testObjects.updatePostObj)
      .end((error, response) => {
        expect(response.status).to.equal(200);
        expect(response.body).to.be.an.instanceof(Object);
        expect(response.body).to.have.property("_id", user1.postId[0]);
        expect(response.body).to.have.property(
          "title",
          testObjects.updatePostObj.title
        );
        done();
      });
  });

  //* testing update error because description isn't valid (valid description length : 10 - 250)
  it("PUT : update (error)", (done) => {
    testObjects.updatePostObj._id = user1.postId[0];
    testObjects.updatePostObj.description = "desc";
    chai
      .request(server)
      .put("/api/v1/posts/update")
      .set("token", user1.token)
      .send(testObjects.updatePostObj)
      .end((error, response) => {
        expect(response.status).to.equal(400);
        done();
      });
  });

  //* testing delete
  it("DEL : delete", (done) => {
    testObjects.deletePostObj._id = user1.postId[4];
    chai
      .request(server)
      .del("/api/v1/posts/delete")
      .set("token", user1.token)
      .send(testObjects.deletePostObj)
      .end((error, response) => {
        expect(response.status).to.equal(200);
        expect(response.body).to.be.an.instanceof(Object);
        expect(response.body).to.have.property("_id", user1.postId[4]);
        expect(response.body).to.have.property("activeStatus", false);
        done();
      });
  });

  //* testing delete error because not own post
  it("DEL : delete (error)", (done) => {
    testObjects.deletePostObj._id = user1.postId[0];
    testObjects.deletePostObj.userId = user2._id;
    chai
      .request(server)
      .del("/api/v1/posts/delete")
      .set("token", user1.token)
      .send(testObjects.deletePostObj)
      .end((error, response) => {
        expect(response.status).to.equal(400);
        done();
      });
  });
});
