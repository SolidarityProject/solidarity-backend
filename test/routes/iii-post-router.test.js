const chai = require("chai");
const chaiHttp = require("chai-http");
const server = require("../../src/app");
const testObjects = require("../test-objects.json");

const { user1, user2 } = require("./i-auth-router.test");
const faker = require("faker/locale/tr");

const expect = chai.expect;

chai.use(chaiHttp);


describe("Post Router Test Functions", () => {

    //* before creating token
    before(done => {

        testObjects.addPostObj.userId = user1._id;
        testObjects.addPostObj.description += faker.random.words(5);

        testObjects.addPostObj2.userId = user2._id;
        testObjects.addPostObj2.description += faker.random.words(5);

        testObjects.updatePostObj.description += faker.random.words(5);
        testObjects.updatePostObj.userId = user1._id;

        testObjects.deletePostObj.userId = user1._id;


        done();
    });

    //* testing add (5 posts)
    for (let postCount = 0; postCount < 5; postCount++) {

        //* testing add
        it("POST : add (count of new post : " + (postCount + 1) + ")", done => { // POST : add (count of new post : 1,2,3,4,5)
            chai.request(server)
                .post("/posts/add")
                .set("token", user1.token)
                .send(testObjects.addPostObj)
                .end((error, response) => {
                    expect(response.status).to.equal(200);
                    expect(response.body).to.be.an.instanceof(Object);
                    expect(response.body).to.have.property("_id");
                    user1.postId = response.body._id;
                    done();
                });
        });
    }

    //* testing add error because not verified account
    it("POST : add (error)", done => {
        chai.request(server)
            .post("/posts/add")
            .set("token", user2.token)
            .send(testObjects.addPostObj2)
            .end((error, response) => {
                expect(response.status).to.equal(400);
                done();
            });
    });

    //* testing getbyprovinceaddress - not required token
    it("GET : getbyprovinceaddress (for free user - not required token)", done => {
        chai.request(server)
            .get("/posts/free/getbyprovinceaddress/5ed2c0e3bd08e22e84efea49")
            .end((error, response) => {
                expect(response.status).to.equal(200);
                expect(response.body).to.be.an.instanceof(Array);
                expect(response.body).to.have.lengthOf(3);
                done();
            });
    });

    //* testing getbyid
    it("GET : getbyid", done => {
        chai.request(server)
            .get("/posts/getbyid/" + user1.postId)
            .set("token", user1.token)
            .end((error, response) => {
                expect(response.status).to.equal(200);
                expect(response.body).to.be.an.instanceof(Object);
                expect(response.body).to.have.property("_id", user1.postId);
                expect(response.body).to.have.property("description", testObjects.addPostObj.description);
                done();
            });
    });

    //* testing getbyuserid
    it("GET : getbyuserid", done => {
        chai.request(server)
            .get("/posts/getbyuserid/" + user1._id)
            .set("token", user1.token)
            .end((error, response) => {
                expect(response.status).to.equal(200);
                expect(response.body).to.be.an.instanceof(Array);
                expect(response.body).to.have.lengthOf(5);
                expect(response.body[0]).to.have.property("userId", user1._id);
                done();
            });
    });

    //* testing getbyfulladdress
    it("GET : getbyfulladdress", done => {
        chai.request(server)
            .get("/posts/getbyfulladdress/5eef567d7e22131964053540")
            .set("token", user1.token)
            .end((error, response) => {
                expect(response.status).to.equal(200);
                expect(response.body).to.be.an.instanceof(Array);
                expect(response.body[0].address).to.have.property("districtId", "5eef567d7e22131964053540");
                done();
            });
    });

    //* testing getbyprovinceaddress
    it("GET : getbyprovinceaddress", done => {
        chai.request(server)
            .get("/posts/getbyprovinceaddress/5ed2c0e3bd08e22e84efea49")
            .set("token", user1.token)
            .end((error, response) => {
                expect(response.status).to.equal(200);
                expect(response.body).to.be.an.instanceof(Array);
                expect(response.body[0].address).to.have.property("provinceId", "5ed2c0e3bd08e22e84efea49");
                done();
            });
    });

    //* testing update
    it("PUT : update", done => {
        testObjects.updatePostObj._id = user1.postId;
        chai.request(server)
            .put("/posts/update")
            .set("token", user1.token)
            .send(testObjects.updatePostObj)
            .end((error, response) => {
                expect(response.status).to.equal(200);
                expect(response.body).to.be.an.instanceof(Object);
                expect(response.body).to.have.property("_id", user1.postId);
                expect(response.body).to.have.property("title", testObjects.updatePostObj.title);
                done();
            });
    });

    //* testing delete
    it("DEL : delete", done => {
        testObjects.deletePostObj._id = user1.postId;
        chai.request(server)
            .del("/posts/delete")
            .set("token", user1.token)
            .send(testObjects.deletePostObj)
            .end((error, response) => {
                expect(response.status).to.equal(200);
                expect(response.body).to.be.an.instanceof(Object);
                expect(response.body).to.have.property("_id", user1.postId);
                expect(response.body).to.have.property("activeStatus", false);
                done();
            });
    });
});