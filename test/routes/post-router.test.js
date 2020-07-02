const chai = require("chai");
const chaiHttp = require("chai-http");
const server = require("../../src/app");
const testObjects = require("../test-objects.json");
const { createToken } = require("../../src/utils/security/token");

const expect = chai.expect;

chai.use(chaiHttp);

let token;
let token2;

describe("Post Router Test Functions", () => {

    //* before creating token
    before(done => {
        token = createToken(testObjects.createTokenObj);    // token  -> all functions 
        token2 = createToken(testObjects.createTokenObj2);  // token2 -> not verified account
        done();
    });

    //* testing add
    it("POST : add (5 posts)", done => {
        for (let i = 0; i < 5; i++) {
            chai.request(server)
                .post("/posts/add")
                .set("token", token)
                .send(testObjects.addPostObj)
                .end((error, response) => {
                    expect(response.status).to.equal(200);
                });
        }
        done();
    });

    //* testing add error because not verified account
    it("POST : add (error)", done => {
        chai.request(server)
            .post("/posts/add")
            .set("token", token2)
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
            .get("/posts/getbyid/5efbaab0fc804a04d8004f13")
            .set("token", token)
            .end((error, response) => {
                expect(response.status).to.equal(200);
                expect(response.body).to.be.an.instanceof(Object);
                expect(response.body).to.have.property("_id", "5efbaab0fc804a04d8004f13");
                done();
            });
    });


    //* testing getbyuserid
    it("GET : getbyuserid", done => {
        chai.request(server)
            .get("/posts/getbyuserid/5efb3602c106002090dc7746")
            .set("token", token)
            .end((error, response) => {
                expect(response.status).to.equal(200);
                expect(response.body).to.be.an.instanceof(Array);
                expect(response.body).to.have.lengthOf.at.least(5);
                expect(response.body[0]).to.have.property("userId", "5efb3602c106002090dc7746");
                done();
            });
    });

    //* testing getbyfulladdress
    it("GET : getbyfulladdress", done => {
        chai.request(server)
            .get("/posts/getbyfulladdress/5eef567d7e22131964053540")
            .set("token", token)
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
            .set("token", token)
            .end((error, response) => {
                expect(response.status).to.equal(200);
                expect(response.body).to.be.an.instanceof(Array);
                expect(response.body[0].address).to.have.property("provinceId", "5ed2c0e3bd08e22e84efea49");
                done();
            });
    });

    //* testing update
    it("PUT : update", done => {
        chai.request(server)
            .put("/posts/update")
            .set("token", token)
            .send(testObjects.updatePostObj)
            .end((error, response) => {
                expect(response.status).to.equal(200);
                expect(response.body).to.be.an.instanceof(Object);
                expect(response.body).to.have.property("_id", "5efbaab0fc804a04d8004f13");
                expect(response.body).to.have.property("title", "New Post **** updated");
                done();
            })
    });

    //* testing delete
    it("DEL : delete", done => {
        chai.request(server)
            .del("/posts/delete")
            .set("token", token)
            .send(testObjects.deletePostObj)
            .end((error, response) => {
                expect(response.status).to.equal(200);
                expect(response.body).to.be.an.instanceof(Object);
                expect(response.body).to.have.property("_id", "5efbaab0fc804a04d8004f14");
                expect(response.body).to.have.property("activeStatus", false);
                done();
            })
    });
});