const testObjects = require("../test-objects.json");
const helper = require("../../src/helpers/auth-control-helper");

var assert = require("assert");

describe("Auth Control Helper Test Functions", () => {
  //* testing auth_err_control
  it("auth_err_control when true story should return false", (done) => {
    const result = helper.auth_err_control(testObjects.verifiedDataObj); // check error
    assert.equal(result, false); // false  ->  no error
    done();
  });

  //* testing auth_user_err_control
  it("auth_user_err_control when true story should return false", (done) => {
    const result = helper.auth_user_err_control(
      testObjects.verifiedDataObj,
      testObjects.reqBodyDataObj
    ); // check error
    assert.equal(result, false); // false  ->  no error
    done();
  });

  //* testing auth_post_err_control
  it("auth_post_err_control when true story should return false", (done) => {
    const result = helper.auth_post_err_control(
      testObjects.verifiedDataObj,
      testObjects.reqBodyDataObj
    );
    assert.equal(result, false);
    done();
  });

  //* testing auth_post_verified_err_control
  it("auth_post_verified_err_control when true story should return false", (done) => {
    const result = helper.auth_post_verified_err_control(
      testObjects.verifiedDataObj,
      testObjects.reqBodyDataObj
    );
    assert.equal(result, false);
    done();
  });
});

describe("Auth Control Helper Test Functions - Error", () => {
  //* testing auth_error (token is not active)
  it("auth_err_control when token is not active should return true", (done) => {
    const result = helper.auth_err_control(
      testObjects.verifiedDataObj_active_error
    ); // check error
    assert.equal(result, true); // true  ->  there is an error
    done();
  });

  //* testing auth_user_err_control (user is not active)
  it("auth_user_err_control when user is not active should return true", (done) => {
    const result = helper.auth_user_err_control(
      testObjects.verifiedDataObj_active_error,
      testObjects.reqBodyDataObj
    ); // check error
    assert.equal(result, true); // true  ->  there is an error
    done();
  });

  //* testing auth_user_err_control (userId does not match the _id in token)
  it("auth_user_err_control when userId does not match the id in token should return true", (done) => {
    const result = helper.auth_user_err_control(
      testObjects.verifiedDataObj,
      testObjects.reqBodyDataObj_error
    ); // check error
    assert.equal(result, true); // true  ->  there is an error
    done();
  });

  //* testing auth_post_err_control (token is not active)
  it("auth_post_err_control when token is not active should return true", (done) => {
    const result = helper.auth_post_err_control(
      testObjects.verifiedDataObj_active_error,
      testObjects.reqBodyDataObj
    );
    assert.equal(result, true);
    done();
  });

  //* testing auth_post_err_control (userId does not match the _id in token)
  it("auth_post_err_control when userId does not match the id in token should return true", (done) => {
    const result = helper.auth_post_err_control(
      testObjects.verifiedDataObj,
      testObjects.reqBodyDataObj_error
    );
    assert.equal(result, true);
    done();
  });

  //* testing auth_post_verified_err_control (token is not active)
  it("auth_post_verified_err_control when token is not active should return true", (done) => {
    const result = helper.auth_post_verified_err_control(
      testObjects.verifiedDataObj_active_error,
      testObjects.reqBodyDataObj
    );
    assert.equal(result, true);
    done();
  });

  //* testing auth_post_verified_err_control (not verified)
  it("auth_post_verified_err_control when token is not verified should return true", (done) => {
    const result = helper.auth_post_verified_err_control(
      testObjects.verifiedDataObj_verified_error,
      testObjects.reqBodyDataObj
    );
    assert.equal(result, true);
    done();
  });

  //* testing auth_post_verified_err_control (userId does not match the _id in token)
  it("auth_post_verified_err_control when userId does not match the id in token should return true", (done) => {
    const result = helper.auth_post_verified_err_control(
      testObjects.verifiedDataObj,
      testObjects.reqBodyDataObj_error
    );
    assert.equal(result, true);
    done();
  });
});
