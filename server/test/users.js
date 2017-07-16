//User Routes Tests
const assert  = require('assert');
const request = require('supertest');
const Server  = require('../server');

before("Starting up...", (done) => {
  done();
});

after("Cleaning up...", (done) => {
  done();
});

describe("A user", () => {
  it("Can be created", (done) => {
    request(Server)
      .post('/api/users')
      .send({username: "David", password: "cornbread"})
      .expect(200)
      .expect('Content-Type','application/json; charset=utf-8')
      .expect( (res) => {
        assert(res.body.user, "No user sent back");
        let receivedUser = res.body.user;
        assert.equal(receivedUser.username, "David", "Received user has the wrong username. Expected 'David'. Received: " + receivedUser.username);
        assert(receivedUser.password, "Received user has no password");
        assert(receivedUser.password.salt, "Received password has no salt");
        assert(receivedUser.password.iterations, "Received password has no iterations");
        assert(receivedUser.password.hash, "Received password has no hash");
      })
      .end( (err, res) => {
        if(err) done(err);
        else done();
      })
  });

  it("can be retrieved by ID", (done) => {
    assert(false);
    done();
  });

  it("can be retrieved in an array with all users", (done) => {
    assert(false);
    done();
  });
});
