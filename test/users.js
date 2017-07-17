//User Routes Tests
const assert  = require('assert');
const request = require('supertest');
const Server  = require('../server');
const Models  = require('../models');

let User;

before("Starting up...", (done) => {
  let newUser = {
    username: "test",
    salt: "himalayan",
    iterations: 42,
    hash: "browns"
  }
  Models.Users.create(newUser)
  .then( (user) => {
    User = user;
    done();
  });
});

after("Cleaning up...", (done) => {
  Models.Users.destroy({ where: {} })
  .then( done() );
});

describe("A user", () => {
  it("can be created", (done) => {
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

  it("will throw a 400 if username is blank", (done) => {
    request(Server)
      .post("/api/users")
      .send({username: "", password: "fail"})
      .expect(400)
      .end( (err, res) => {
        if(err) done(err);
        else done();
      });
  });

  it("will throw a 400 if password is blank", (done) => {
    request(Server)
      .post('/api/users')
      .send({username:'noPW', password: ""})
      .expect(400)
      .end( (err, res) => {
        if(err) done(err);
        else done();
      });
  });

  it("will throw a 400 if username is taken", (done) => {
    request(Server)
      .post('/api/users')
      .send({username: 'test', password: 'taken'})
      .expect(400)
      .end( (err, res) => {
        if(err) done(err);
        else done();
      })
  })

  it("can be retrieved by ID", (done) => {
    request(Server)
      .get('/api/users/'+User.id)
      .expect(200)
      .expect('Content-Type','application/json; charset=utf-8')
      .expect( (res) => {
        assert(res.body.user, "No user sent back");
        assert.equal(res.body.user.id, User.id, "Id's do not match. Expected: " + User.id + ". Received: " + res.body.user.id);
      })
      .end( (err, res) => {
        if(err) done(err);
        else done();
      });
  });

  it("can be retrieved in an array with all users", (done) => {
    request(Server)
      .get('/api/users')
      .expect(200)
      .expect('Content-Type','application/json; charset=utf-8')
      .expect( (res) => {
        assert(res.body.users, "No users sent back. Are they on a key called users?");
        assert(res.body.users.length, "Users has no length. Is it an array?");
        assert(res.body.users[0], "No object at index 0. Is it an array?");
      })
      .end( (err, res) => {
        if(err) done(err);
        else done();
      });
  });
});
