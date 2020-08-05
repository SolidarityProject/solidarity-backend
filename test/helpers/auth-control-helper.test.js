const chai = require("chai");
const testObjects = require("../test-objects.json");
const helper = require("../../src/helpers/auth-control-helper");

const expect = chai.expect;

describe("Auth Control Helper Test Functions", () => {
  //* testing auth_error
  it("function : auth_error", (done) => {
    const result = helper.auth_error(testObjects.verifiedDataObj); // check error
    expect(result).to.be.undefined; // undefined  ->  no error
    done();
  });

  //* testing auth_user_error
  it("function : auth_user_error", (done) => {
    const result = helper.auth_user_error(
      testObjects.verifiedDataObj,
      testObjects.reqBodyDataObj
    ); // check error
    expect(result).to.be.undefined; // undefined  ->  no error
    done();
  });

  //* testing auth_post_error
  it("function : auth_post_error", (done) => {
    const result = helper.auth_post_error(
      testObjects.verifiedDataObj,
      testObjects.reqBodyDataObj
    );
    expect(result).to.be.undefined;
    done();
  });

  //* testing auth_post_verified_error
  it("function : auth_post_verified_error", (done) => {
    const result = helper.auth_post_verified_error(
      testObjects.verifiedDataObj,
      testObjects.reqBodyDataObj
    );
    expect(result).to.be.undefined;
    done();
  });
});

describe("Auth Control Helper Test Functions - Error", () => {
  //* testing auth_error (not active)
  it("function : auth_error (not active)", (done) => {
    const result = helper.auth_error(testObjects.verifiedDataObj_active_error); // check error
    expect(result).to.be.true; // true  ->  there is an error
    done();
  });

  //* testing auth_user_error (not active)
  it("function : auth_user_error (not active)", (done) => {
    const result = helper.auth_user_error(
      testObjects.verifiedDataObj_active_error,
      testObjects.reqBodyDataObj
    ); // check error
    expect(result).to.be.true; // true  ->  there is an error
    done();
  });

  //* testing auth_user_error (_id no matches)
  it("function : auth_user_error (_id no matches)", (done) => {
    const result = helper.auth_user_error(
      testObjects.verifiedDataObj,
      testObjects.reqBodyDataObj_error
    ); // check error
    expect(result).to.be.true; // true  ->  there is an error
    done();
  });

  //* testing auth_post_error (not active)
  it("function : auth_post_error (not active)", (done) => {
    const result = helper.auth_post_error(
      testObjects.verifiedDataObj_active_error,
      testObjects.reqBodyDataObj
    );
    expect(result).to.be.true;
    done();
  });

  //* testing auth_post_error (userId no matches)
  it("function : auth_post_error (userId no matches)", (done) => {
    const result = helper.auth_post_error(
      testObjects.verifiedDataObj,
      testObjects.reqBodyDataObj_error
    );
    expect(result).to.be.true;
    done();
  });

  //* testing auth_post_verified_error (not active)
  it("function : auth_post_verified_error (not active)", (done) => {
    const result = helper.auth_post_verified_error(
      testObjects.verifiedDataObj_active_error,
      testObjects.reqBodyDataObj
    );
    expect(result).to.be.true;
    done();
  });

  //* testing auth_post_verified_error (not verified)
  it("function : auth_post_verified_error (not verified)", (done) => {
    const result = helper.auth_post_verified_error(
      testObjects.verifiedDataObj_verified_error,
      testObjects.reqBodyDataObj
    );
    expect(result).to.be.true;
    done();
  });

  //* testing auth_post_verified_error (userId no matches)
  it("function : auth_post_verified_error (userId no matches)", (done) => {
    const result = helper.auth_post_verified_error(
      testObjects.verifiedDataObj,
      testObjects.reqBodyDataObj_error
    );
    expect(result).to.be.true;
    done();
  });
});
